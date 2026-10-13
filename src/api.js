const j = async r => {
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Request failed (${r.status})`);
  return r.json();
};
const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? {}) }).then(j);

export const api = {
  health: () => fetch('/api/health', { cache: 'no-store' }).then(j),
  profile: () => fetch('/api/profile').then(j),
  upload: file => { const f = new FormData(); f.append('file', file); return fetch('/api/documents', { method: 'POST', body: f }).then(j); },
  sample: () => post('/api/documents/sample'),
  confirm: (id, extraction) => post(`/api/documents/${id}/confirm`, { extraction }),
  remove: id => fetch(`/api/documents/${id}`, { method: 'DELETE' }).then(j),
  linkAbha: number => post('/api/abha/link', { number }),
  unlinkAbha: () => fetch('/api/abha', { method: 'DELETE' }).then(j),
};
