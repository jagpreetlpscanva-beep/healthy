import fs from 'node:fs';
import path from 'node:path';

// Storage backends (first one configured wins):
//  1. Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) -> durable, shared by all instances.
//  2. Upstash Redis / Vercel KV (KV_REST_API_URL + KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_*) -> durable.
//  3. JSON file in /tmp -> EPHEMERAL on Vercel (per instance, lost on cold start). Local dev only.
export const DATA = process.env.MEDIMIND_DATA_DIR || '/tmp/medimind-data';
export const UPLOADS = process.env.MEDIMIND_UPLOADS_DIR || '/tmp/medimind-uploads';
const FILE = path.join(DATA, 'db.json');
const KEY = 'medimind:db';
const ROW = 'main';
const empty = () => ({ documents: [], tests: [], meds: [], dx: [], events: [], abha: { number: '', linked: false }, profile: { displayName: 'Patient Zero', language: 'EN' } });

const supa = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
};
const kv = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
};
export const persistence = () => (supa() || kv() ? 'durable' : 'ephemeral');

const supaFetch = async (cfg, pathAndQuery, init = {}) => {
  const r = await fetch(`${cfg.url}/rest/v1/medimind_state${pathAndQuery}`, { ...init, headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/json', ...init.headers } });
  const text = await r.text();
  if (!r.ok) throw new Error(`Supabase error ${r.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : null;
};
const kvCall = async (cfg, cmd) => {
  const r = await fetch(cfg.url, { method: 'POST', headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(`Storage error: ${j.error || r.status}`);
  return j.result;
};

export const load = async () => {
  const s = supa();
  if (s) { const rows = await supaFetch(s, `?id=eq.${ROW}&select=data`); return { ...empty(), ...(rows?.[0]?.data || {}) }; }
  const k = kv();
  if (k) { const raw = await kvCall(k, ['GET', KEY]); return { ...empty(), ...(raw ? JSON.parse(raw) : {}) }; }
  try { return { ...empty(), ...JSON.parse(fs.readFileSync(FILE, 'utf8')) }; } catch { return empty(); }
};
export const save = async db => {
  const s = supa();
  if (s) { await supaFetch(s, '?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ id: ROW, data: db }) }); return; }
  const k = kv();
  if (k) { await kvCall(k, ['SET', KEY, JSON.stringify(db)]); return; }
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(db, null, 2));
  fs.renameSync(FILE + '.tmp', FILE);
};
