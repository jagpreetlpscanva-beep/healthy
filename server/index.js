import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { extractFromFile, aiEnabled, MODEL } from './extract.js';
import { load, save, UPLOADS } from './store.js';
import { SAMPLE_EXTRACTION, buildFhir, toBundle, statusOf } from '../src/sampleData.js';

const app = express();
export default app;
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_r, f, cb) => cb(ALLOWED.includes(f.mimetype) ? null : new Error('Only PDF, PNG, JPG or WEBP files are supported'), ALLOWED.includes(f.mimetype)) });

const LABEL = { lab_report: 'Lab report', prescription: 'Prescription', discharge_summary: 'Discharge summary', other: 'Medical document' };
const KIND = { lab_report: 'Lab', prescription: 'Prescription', discharge_summary: 'Visit', other: 'Visit' };
const publicState = db => ({
  documents: db.documents.filter(d => d.status === 'Processed').map(({ pending, storedAs, ...d }) => d),
  tests: db.tests, meds: db.meds, dx: db.dx, events: db.events, abha: db.abha, ai: aiEnabled(),
});
const merge = (old, incoming, src) => [...incoming.map(x => ({ ...x, source: src })), ...old.filter(o => !incoming.some(n => n.id === o.id))];
const pad = n => String(n).padStart(2, '0');
const ah = fn => (req, res) => fn(req, res).catch(e => { console.error(e); res.status(500).json({ error: e.message }); });

app.get('/api/health', (_q, res) => res.json({ ok: true, ai: aiEnabled(), model: aiEnabled() ? MODEL : null }));
app.get('/api/profile', (_q, res) => res.json(publicState(load())));

function createPending(db, { filename, mime, size, extraction, storedAs, sample }) {
  const id = crypto.randomUUID();
  const t = extraction.meta.documentType;
  db.documents.unshift({ id, filename, mime, size, uploadedAt: new Date().toISOString(), status: 'Ready for review', kind: KIND[t], typeLabel: LABEL[t], storedAs, sample: !!sample, pending: extraction });
  save(db);
  return { docId: id, extraction };
}

// Upload + AI extraction (not saved to the profile until the user confirms)
app.post('/api/documents', (req, res) => upload.single('file')(req, res, async err => {
  if (err) return res.status(400).json({ error: err.message });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if (!aiEnabled()) return res.status(503).json({ error: 'AI extraction is not configured. Add OPENAI_API_KEY to your environment variables, or try the sample report.' });
  if (req.file.mimetype !== 'application/pdf' && req.file.size > 5 * 1024 * 1024) return res.status(413).json({ error: 'Images must be under 5 MB for AI reading. Please compress the photo.' });
  try {
    const extraction = await extractFromFile(req.file.buffer, req.file.mimetype);
    const storedAs = crypto.randomUUID() + path.extname(req.file.originalname).toLowerCase().slice(0, 6);
    fs.mkdirSync(UPLOADS, { recursive: true }); fs.writeFileSync(path.join(UPLOADS, storedAs), req.file.buffer);
    res.json(createPending(load(), { filename: req.file.originalname, mime: req.file.mimetype, size: req.file.size, extraction, storedAs }));
  } catch (e) { console.error(e); res.status(502).json({ error: 'Extraction failed: ' + e.message }); }
}));

// Demo document that needs no API key
app.post('/api/documents/sample', ah(async (_q, res) =>
  res.json(createPending(load(), { filename: 'Sample_CBC_and_Prescription.pdf', mime: 'application/pdf', size: 1.8 * 1048576, extraction: structuredClone(SAMPLE_EXTRACTION), sample: true }))));

// User reviewed the extraction -> save into the unified profile + timeline
app.post('/api/documents/:id/confirm', ah(async (req, res) => {
  const db = load(); const doc = db.documents.find(d => d.id === req.params.id);
  if (!doc?.pending) return res.status(404).json({ error: 'Document not found or already saved' });
  const b = req.body?.extraction;
  const ok = b && Array.isArray(b.tests) && Array.isArray(b.meds) && Array.isArray(b.dx);
  const ex = ok ? { meta: doc.pending.meta, tests: b.tests.slice(0, 200), meds: b.meds.slice(0, 200), dx: b.dx.slice(0, 100) } : doc.pending;
  db.tests = merge(db.tests, ex.tests, doc.id); db.meds = merge(db.meds, ex.meds, doc.id); db.dx = merge(db.dx, ex.dx, doc.id);
  const date = ex.meta.date || doc.uploadedAt.slice(0, 10);
  const kind = ex.meta.documentType === 'other' ? (ex.tests.length >= ex.meds.length ? 'Lab' : 'Prescription') : KIND[ex.meta.documentType];
  db.events = [{ id: 'ev-' + doc.id, docId: doc.id, date, kind, title: LABEL[ex.meta.documentType],
    sub: `${ex.meta.provider || ex.meta.doctor || doc.filename} · ${LABEL[ex.meta.documentType]}`,
    tag: [ex.tests.length && `${ex.tests.length} values`, ex.meds.length && `${ex.meds.length} medicines`, ex.dx.length && `${ex.dx.length} diagnoses`].filter(Boolean).join(' · ') || 'Reviewed',
    details: [...ex.tests.map(t => ({ k: t.name, v: `${t.value} ${t.unit}`.trim(), flag: ['low', 'high'].includes(statusOf(t)) })), ...ex.meds.map(m => ({ k: m.name, v: `${m.dose} · ${m.freq}` })), ...ex.dx.map(d => ({ k: 'Diagnosis', v: d.name }))] },
    ...db.events].sort((a, z) => z.date.localeCompare(a.date));
  doc.status = 'Processed'; doc.kind = kind; doc.typeLabel = LABEL[ex.meta.documentType]; delete doc.pending;
  save(db); res.json(publicState(db));
}));

// Discard a pending upload, or delete a saved document (its timeline event goes too)
app.delete('/api/documents/:id', ah(async (req, res) => {
  const db = load(); const doc = db.documents.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  if (doc.storedAs) fs.rmSync(path.join(UPLOADS, path.basename(doc.storedAs)), { force: true });
  db.documents = db.documents.filter(d => d !== doc); db.events = db.events.filter(e => e.docId !== doc.id);
  save(db); res.json(publicState(db));
}));

// ABDM / ABHA (mock — no call to the real ABDM gateway)
app.post('/api/abha/link', ah(async (req, res) => {
  const d = String(req.body?.number || '').replace(/\D/g, '');
  if (d.length !== 14) return res.status(400).json({ error: 'ABHA number must have 14 digits' });
  const db = load(); db.abha = { number: `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}-${d.slice(10)}`, linked: true, mock: true }; save(db); res.json(db.abha);
}));
app.delete('/api/abha', ah(async (_q, res) => { const db = load(); db.abha = { number: '', linked: false }; save(db); res.json(db.abha); }));

// FHIR R4 Bundle of everything in the profile
app.get('/api/fhir/bundle', (_q, res) => {
  const db = load(); const d = new Date();
  res.setHeader('Content-Disposition', `attachment; filename="medimind-fhir-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}.json"`);
  res.json(toBundle(buildFhir({ abha: db.abha.linked ? db.abha.number : '', tests: db.tests, meds: db.meds, dx: db.dx })));
});

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
if (fs.existsSync(dist)) { app.use(express.static(dist)); app.use((req, res, next) => (req.method === 'GET' && !req.path.startsWith('/api') ? res.sendFile(path.join(dist, 'index.html')) : next())); }
const PORT = process.env.PORT || 8787;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`MediMind API on :${PORT} · AI ${aiEnabled() ? 'ON (' + MODEL + ')' : 'OFF (set OPENAI_API_KEY)'}`));
}
