import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mm-'));
process.env.MEDIMIND_DATA_DIR = dir; process.env.MEDIMIND_UPLOADS_DIR = dir; process.env.VERCEL = '1'; delete process.env.OPENAI_API_KEY;
const { default: app } = await import('../server/index.js');
const server = app.listen(0); const base = `http://127.0.0.1:${server.address().port}`;
test.after(() => server.close());
const req = (m, u, b) => fetch(base + u, { method: m, headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });

test('health', async () => { const j = await (await req('GET', '/api/health')).json(); assert.equal(j.ok, true); });
test('upload without file -> 400, without AI key -> not 404', async () => { assert.equal((await req('POST', '/api/documents')).status, 400); });
test('sample -> confirm -> reload', async () => {
  const s = await (await req('POST', '/api/documents/sample')).json();
  const r = await req('POST', `/api/documents/${s.docId}/confirm`, { extraction: s.extraction });
  assert.equal(r.status, 200);
  const p = await (await req('GET', '/api/profile')).json();
  assert.equal(p.documents.length, 1); assert.ok(p.tests.length > 0); assert.equal(p.events.length, 1);
  assert.equal((await req('POST', `/api/documents/${s.docId}/confirm`, { extraction: s.extraction })).status, 409);
});
test('confirm after pending record lost (other instance) still saves', async () => {
  const s = await (await req('POST', '/api/documents/sample')).json();
  fs.rmSync(path.join(dir, 'db.json'), { force: true });
  const r = await req('POST', `/api/documents/${s.docId}/confirm`, { extraction: s.extraction, document: { filename: 'x.pdf', size: 10 } });
  assert.equal(r.status, 200); assert.equal((await r.json()).documents[0].filename, 'x.pdf');
});
test('unknown / malformed id -> JSON 404', async () => {
  const r = await req('POST', '/api/documents/not-an-id/confirm', { extraction: { tests: [], meds: [], dx: [] } });
  assert.equal(r.status, 404); assert.ok((await r.json()).error);
  assert.equal((await req('POST', '/api/documents/00000000-0000-0000-0000-000000000000/confirm', {})).status, 404);
});
test('wrong method on confirm is not served as success', async () => { assert.notEqual((await req('GET', '/api/documents/x/confirm')).status, 200); });
test('profile PUT validates', async () => { assert.equal((await req('PUT', '/api/profile', { displayName: '', language: 'EN' })).status, 400); assert.equal((await req('PUT', '/api/profile', { displayName: 'A', language: 'HI' })).status, 200); });
