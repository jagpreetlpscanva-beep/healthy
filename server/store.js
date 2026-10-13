import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DATA = path.join(here, 'data');
export const UPLOADS = path.join(here, 'uploads');
const FILE = path.join(DATA, 'db.json');
const empty = () => ({ documents: [], tests: [], meds: [], dx: [], events: [], abha: { number: '', linked: false } });

// Simple JSON-file store (fine for a hackathon). Swap for Postgres + JSONB FHIR resources in production.
export const load = () => { try { return { ...empty(), ...JSON.parse(fs.readFileSync(FILE, 'utf8')) }; } catch { return empty(); } };
export const save = db => {
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(db, null, 2));
  fs.renameSync(FILE + '.tmp', FILE);
};
