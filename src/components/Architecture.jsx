import React from 'react';
import { ArrowRight, Braces, Brain, Database, Lock, ScanText, Smartphone, Sparkles, ShieldCheck, Upload } from 'lucide-react';
import { Head, Reveal } from './ui.jsx';

const LANES = [
  { t: '1 · Capture', c: 'teal', n: [[Smartphone, 'React web / PWA', 'Camera + file upload'], [Upload, 'Upload API', 'Validates type & size'], [Lock, 'Encrypted storage', 'Private bucket, per-user keys']] },
  { t: '2 · Understand', c: 'violet', n: [[ScanText, 'OCR engine', 'English + Hindi, handwriting'], [Brain, 'LLM extraction', 'Schema-validated JSON'], [ShieldCheck, 'Confidence gate', 'Low scores → human review']] },
  { t: '3 · Structure', c: 'blue', n: [[Braces, 'FHIR mapper', 'ABDM / NRCeS profiles'], [Database, 'Postgres + JSONB', 'Patient · Observation · Rx'], [Lock, 'Consent & audit', 'ABHA-linked access log']] },
  { t: '4 · Explain', c: 'orange', n: [[Sparkles, 'Summary + translation', 'EN / हिन्दी / తెలుగు'], [ShieldCheck, 'Safety rails', 'No diagnosis, disclaimers'], [Smartphone, 'Timeline & profile', 'What you see in this app']] },
];

export function Architecture() {
  return <div>
    <Head eyebrow="HOW IT WORKS" title="System architecture" desc="From a photo of a report to an ABDM-ready health profile." />
    <div className="x-arch">{LANES.map((l, i) => <React.Fragment key={l.t}>
      <Reveal delay={i * 120} className="x-lane"><div className={`x-lane-t x-${l.c}`}>{l.t}</div>
        {l.n.map(([Ic, a, b]) => <div className="surface x-anode" key={a}><span className={`x-aic x-${l.c}`}><Ic size={16} /></span><div><strong>{a}</strong><small>{b}</small></div></div>)}</Reveal>
      {i < LANES.length - 1 && <div className="x-link"><ArrowRight size={20} /></div>}
    </React.Fragment>)}</div>
    <Reveal><section className="surface x-block"><h3>ABDM-ready data model</h3>
      <div className="x-model">{['Patient (ABHA)', 'DocumentReference', 'DiagnosticReport', 'Observation', 'MedicationRequest', 'Condition'].map((m, i) => <React.Fragment key={m}><span>{m}</span>{i < 5 && <i>→</i>}</React.Fragment>)}</div>
      <p className="x-mini">Every extracted value keeps a link to its source document, page and confidence score, so each insight stays traceable.</p></section></Reveal>
  </div>;
}
