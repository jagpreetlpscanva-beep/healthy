import fs from 'node:fs';
import path from 'node:path';

// /tmp is the only writable directory in Vercel Lambda (and local dev still works fine)
export const DATA = '/tmp/medimind-data';
export const UPLOADS = '/tmp/medimind-uploads';
const FILE = path.join(DATA, 'db.json');
const empty = () => ({ documents: [], tests: [], meds: [], dx: [], events: [], abha: { number: '', linked: false }, profile: { displayName: 'Patient Zero', language: 'EN' } });

export const load = () => { try { return { ...empty(), ...JSON.parse(fs.readFileSync(FILE, 'utf8')) }; } catch { return empty(); } };
export const save = db => {
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(db, null, 2));
  fs.renameSync(FILE + '.tmp', FILE);
};
