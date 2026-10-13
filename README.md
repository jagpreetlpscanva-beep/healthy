# MediMind AI — Personal Health Copilot

React + Vite frontend, Node/Express API, Claude for reading documents. Works without an API key in demo mode.

## Run
```bash
npm install
cp .env.example .env        # add ANTHROPIC_API_KEY for real document reading
npm run dev:all             # web on :5173, API on :8787
```
Production: `npm start` (builds the frontend and serves everything from :8787).
Without a key: use **Try with a sample report**. With the API stopped the UI falls back to demo mode.

## Pipeline
upload → validate (type, size) → Claude vision/PDF read (English, Hindi, handwriting) → strict JSON → normalise + confidence →
**user review** → save to profile → FHIR R4 resources (ABDM/NRCeS profiles) → timeline, insights (EN/HI/TE), export bundle.
Nothing is saved to the profile until the user confirms the review screen.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | /api/health | status, whether AI is configured |
| GET | /api/profile | documents, tests, medicines, diagnoses, timeline events, ABHA |
| POST | /api/documents | multipart `file` (PDF/PNG/JPG/WEBP, ≤10 MB) → `{docId, extraction}` (pending review) |
| POST | /api/documents/sample | same, using built-in sample data (no key needed) |
| POST | /api/documents/:id/confirm | body `{extraction}` (optionally edited) → saves; returns profile |
| DELETE | /api/documents/:id | discard pending upload or delete a saved document |
| POST / DELETE | /api/abha/link, /api/abha | **mock** ABHA link / unlink |
| GET | /api/fhir/bundle | FHIR R4 `Bundle` (Patient, Observation, MedicationRequest, Condition) |

## Data model (FHIR-aligned)
Patient (ABHA identifier) → Observation (LOINC, UCUM units, referenceRange, interpretation) · MedicationRequest · Condition.
Each saved item keeps `source` = the document it came from, plus a confidence score.

## Known limits (be honest in the demo)
- Single-user, no login; JSON-file storage (`server/data`). Production: auth, Postgres, encrypted object storage, audit log.
- ABHA/ABDM is mocked; no call to the real ABDM gateway.
- AI output can be wrong; low-confidence rows are flagged and the user reviews before saving. No diagnosis or dosing advice.
