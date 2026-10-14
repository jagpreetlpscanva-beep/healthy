import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Braces, Check, FileText, Languages, LockKeyhole, PenLine, ScanText, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { statusOf, toneOf, UI } from '../data';
import { Chip, Conf, Head } from './ui.jsx';

const STEPS = [
  { t: 'Secure intake', d: 'Encrypting and queuing the file', icon: LockKeyhole, log: 'AES-256 encrypted · file queued' },
  { t: 'Bilingual OCR', d: 'English + Hindi, printed & handwritten', icon: ScanText, log: 'Detected English + Hindi · 2 handwritten regions' },
  { t: 'Entity extraction', d: 'Medicines, doses, values, dates', icon: Sparkles, log: 'Found 4 tests · 3 medicines · 2 diagnoses' },
  { t: 'FHIR mapping', d: 'ABDM-ready structured records', icon: Braces, log: 'Mapped to Observation ×4 · MedicationRequest ×3' },
  { t: 'Plain-language summary', d: 'Abnormal values explained', icon: Languages, log: 'Summary ready in English / हिन्दी / తెలుగు' },
];
const LINES = [
  { t: 'CITY DIAGNOSTICS · PATHOLOGY' },
  { t: 'Patient: Patient Zero    Date: 10-10-2026', k: 'date' },
  { t: 'Hemoglobin ........ 12.4 g/dL', k: 'test' },
  { t: 'Vitamin D (25-OH) .. 12.8 ng/mL', k: 'test' },
  { t: 'Total Cholesterol .. 210 mg/dL', k: 'test' },
  { t: 'Fasting Glucose .... 92 mg/dL', k: 'test' },
  { t: 'सुबह खाली पेट जाँच', k: 'hi' },
  { t: 'Rx  Vit D3 60000 IU — 1 wkly × 8 wk', k: 'med' },
  { t: 'Calcium 500 — 1-0-1 × 30 d', k: 'med', hand: true },
  { t: 'Omega-3 1000 — 0-0-1 × 30 d', k: 'med', hand: true },
];

export function ExtractionFlow({ file, run, onCancel, onSave, onUseSample }) {
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState('tests');
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [url, setUrl] = useState(null);
  const calls = useRef({});
  const isSample = !(file instanceof File);
  useEffect(() => {
    let live = true;
    calls.current[attempt] ??= run();
    calls.current[attempt].then(r => live && setRes(r)).catch(e => live && setErr(e.message || 'Something went wrong'));
    return () => { live = false; };
  }, [attempt]);
  useEffect(() => {
    if (file instanceof File && file.type.startsWith('image/')) { const u = URL.createObjectURL(file); setUrl(u); return () => URL.revokeObjectURL(u); }
  }, [file]);
  useEffect(() => {
    if (err || step >= STEPS.length || (step >= 2 && !res)) return;
    const id = setTimeout(() => setStep(s => s + 1), step >= 2 ? 700 : 1000);
    return () => clearTimeout(id);
  }, [step, res, err]);
  const retry = () => { setErr(''); setRes(null); setStep(0); setAttempt(a => a + 1); };
  const done = !!res && step >= STEPS.length;
  const ex = res?.extraction;
  const on = l => (l.k === 'hi' ? step >= 2 : l.k && step >= 3);
  const tabs = ex ? [['tests', 'Test values', ex.tests.length], ['meds', 'Medicines', ex.meds.length], ['dx', 'Diagnoses', ex.dx.length]] : [];
  const metaLine = ex && [{ lab_report: 'Lab report', prescription: 'Prescription', discharge_summary: 'Discharge summary', other: 'Medical document' }[ex.meta.documentType], ex.meta.provider || ex.meta.doctor, ex.meta.date].filter(Boolean).join(' · ');

  return <div>
    <Head eyebrow="AI DOCUMENT INTELLIGENCE" title={err ? 'We could not read this document' : done ? 'Review what we found' : 'Reading your document…'} desc={done ? (metaLine || 'Check the extracted details before they are saved.') : 'Extracting medicines, dosages, test values and dates.'}>
      <button className="secondary-button" onClick={() => onCancel(res?.docId)}>Cancel</button>
    </Head>
    <div className="x-flow-grid">
      <section className="surface x-doc">
        <div className="x-doc-bar"><FileText size={15} /> <span>{file?.name || 'Sample report'}</span><Chip tone="blue">Page 1 / 1</Chip></div>
        <div className="x-paper">
          {!done && !err && <div className="x-scan" />}
          {isSample ? LINES.map((l, i) => <div key={i} className={`x-line ${l.hand ? 'hand' : ''} ${on(l) ? 'hl hl-' + l.k : ''}`}>{l.hand && <PenLine size={11} />} {l.t}</div>)
            : url ? <img src={url} alt="Uploaded document" className="x-img" /> : <div className="x-pdf"><FileText size={42} /><strong>{file.name}</strong><small>PDF · read directly by the AI</small></div>}
        </div>
        {isSample && <div className="x-legend"><span className="lg-test">Test value</span><span className="lg-med">Medicine</span><span className="lg-date">Date</span><span className="lg-hi">Hindi text</span><span className="x-hand-tag">✎ handwritten</span></div>}
      </section>

      <section className="surface x-side">
        <div className="x-demo"><Sparkles size={13} /> {isSample ? 'DEMO · sample document and data' : 'LIVE · AI reading your document'}</div>
        {err ? <div className="x-err"><AlertTriangle size={22} /><strong>{err}</strong><div><button className="primary-button" onClick={retry}>Try again</button><button className="secondary-button" onClick={onUseSample}>Use the sample report</button></div></div> : !done ? <>
          <div className="x-bar"><i style={{ width: `${(step / STEPS.length) * 100}%` }} /></div>
          <div className="x-steps">{STEPS.map((s, i) => <div key={s.t} className={`x-step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
            <div className="x-step-ic">{i < step ? <Check size={15} /> : <s.icon size={15} />}</div>
            <div><strong>{s.t}</strong><p>{i < step ? s.log : s.d}</p></div>
          </div>)}</div>
        </> : <>
          <div className="x-tabs">{tabs.map(([k, l, n]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l} <em>{n}</em></button>)}</div>
          <div className="x-rows" key={tab}>
            {tab === 'tests' && ex.tests.map((t, i) => { const s = statusOf(t); return <div className="x-row" style={{ '--i': i }} key={t.id}>
              <div><strong>{t.name}</strong><small>{t.lo == null ? 'No reference range on report' : `Ref ${t.lo}–${t.hi} ${t.unit}`}</small></div>
              <div className="x-val">{t.value}<small>{t.unit}</small></div>
              <Chip tone={toneOf(s)}>{UI[s].EN}</Chip><Conf v={t.conf} /></div>; })}
            {tab === 'meds' && ex.meds.map((m, i) => <div className="x-row" style={{ '--i': i }} key={m.id}>
              <div><strong>{m.name}</strong><small>{m.dose} · {m.freq} · {m.days}</small></div>
              {m.hand ? <Chip tone="violet">✎ Handwritten</Chip> : <Chip tone="teal">Printed</Chip>}
              {m.conf < 90 ? <Chip tone="orange"><AlertTriangle size={11} /> Verify</Chip> : <span />}<Conf v={m.conf} /></div>)}
            {tab === 'dx' && ex.dx.map((d, i) => <div className="x-row" style={{ '--i': i }} key={d.id}><div><strong>{d.name}</strong><small>From visit notes</small></div><span /><span /><Conf v={d.conf} /></div>)}
          </div>
          <div className="x-save"><p><ShieldCheck size={14} /> Low-confidence items are flagged so you can verify them against the original.</p>
            <button className="primary-button" onClick={() => onSave(ex, res.docId)}><Sparkles size={16} /> Save to my health profile <ArrowRight size={16} /></button></div>
        </>}
      </section>
    </div>
  </div>;
}
