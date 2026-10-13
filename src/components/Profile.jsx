import React, { useMemo, useState } from 'react';
import { BadgeCheck, Copy, Loader2, ShieldCheck, Link2 } from 'lucide-react';
import { buildFhir, toBundle, statusOf } from '../data';
import { api } from '../api.js';
import { Chip, CountUp, Head, Reveal } from './ui.jsx';

const fmt = v => { const d = v.replace(/\D/g, '').slice(0, 14); return [d.slice(0, 2), d.slice(2, 6), d.slice(6, 10), d.slice(10, 14)].filter(Boolean).join('-'); };
const hl = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/("(\\.|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?)/g, m => `<span class="j-${/^"/.test(m) ? (/:$/.test(m) ? 'k' : 's') : /^[tfn]/.test(m) ? 'b' : 'n'}">${m}</span>`);

export function Profile({ vault, abha, setAbha, notify, backend }) {
  const [busy, setBusy] = useState(false);
  const [rt, setRt] = useState('Observation');
  const fhir = useMemo(() => buildFhir({ abha: abha.linked ? abha.number : '', ...vault }), [vault, abha]);
  const digits = abha.number.replace(/\D/g, '').length;
  const link = async () => {
    setBusy(true);
    try {
      const r = backend === 'online' ? await api.linkAbha(abha.number) : await new Promise(ok => setTimeout(() => ok({ number: abha.number }), 1500));
      setAbha({ number: r.number, linked: true }); notify('Mock ABHA linked. No real ABDM call was made.');
    } catch (e) { notify(e.message); } finally { setBusy(false); }
  };
  const unlink = () => { if (backend === 'online') api.unlinkAbha().catch(() => {}); setAbha({ number: '', linked: false }); };
  const exportBundle = () => {
    const b = new Blob([JSON.stringify(toBundle(fhir), null, 2)], { type: 'application/fhir+json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(b), download: 'medimind-fhir-bundle.json' }); a.click(); URL.revokeObjectURL(a.href);
  };
  const json = JSON.stringify(fhir[rt][0] ?? {}, null, 2);
  const abnormal = vault.tests.filter(t => ['low', 'high'].includes(statusOf(t))).length;
  return <div>
    <Head eyebrow="UNIFIED HEALTH PROFILE" title="Patient Zero" desc="Everything extracted from your records, in one ABDM-ready profile." />
    <div className="x-profile-grid">
      <section className={`x-abha ${abha.linked ? 'linked' : ''}`}>
        <div className="x-abha-top"><span>ABHA · Ayushman Bharat Health Account</span><Chip tone="blue">MOCK</Chip></div>
        {abha.linked ? <>
          <div className="x-abha-num">{abha.number}</div>
          <div className="x-abha-addr"><BadgeCheck size={16} /> patientzero@abdm <small>(mock address)</small></div>
          <div className="x-consents"><span>Lab reports</span><span>Prescriptions</span><span>Visit notes</span></div>
          <button className="x-abha-btn ghost" onClick={unlink}>Unlink</button>
        </> : <>
          <input className="x-abha-input" inputMode="numeric" placeholder="14-digit ABHA number" value={abha.number} onChange={e => setAbha(a => ({ ...a, number: fmt(e.target.value) }))} />
          <button className="x-abha-btn" disabled={digits < 14 || busy} onClick={link}>{busy ? <><Loader2 size={15} className="spin-i" /> Verifying…</> : <><Link2 size={15} /> Link ABHA</>}</button>
          <p>Enter any 14 digits to preview the flow. Real linking needs ABDM sandbox credentials.</p>
        </>}
      </section>
      <div className="x-stats">
        {[['Test values', vault.tests.length], ['Medicines', vault.meds.length], ['Conditions', vault.dx.length], ['Need review', abnormal]].map(([l, n], i) =>
          <div className="surface x-stat" key={l} style={{ '--i': i }}><b><CountUp to={n} pad={2} /></b><span>{l}</span></div>)}
      </div>
    </div>
    <Reveal><section className="surface x-block"><h3>Active medicines</h3><div className="x-meds">{vault.meds.map(m => <div className="x-med" key={m.id}>
      <strong>{m.name}</strong><small>{m.dose} · {m.freq} · {m.days}</small>
      <div className="x-sched">{['M', 'A', 'N', 'W'].map(s => <span key={s} className={m.sched.includes(s) ? 'on' : ''}>{s === 'W' ? 'Wk' : s}</span>)}</div></div>)}</div>
      <p className="x-mini">M = morning · A = afternoon · N = night · Wk = weekly. Take medicines only as prescribed by your doctor.</p></section></Reveal>
    <Reveal><section className="surface x-block"><div className="x-fhir-top"><div><h3>FHIR record preview</h3><p className="x-mini">Generated live from your extracted data — aligned to ABDM / NRCeS FHIR R4 profiles.</p></div>
      <button className="secondary-button compact" onClick={() => { navigator.clipboard?.writeText(json); notify('FHIR JSON copied.'); }}><Copy size={13} /> Copy</button><button className="secondary-button compact" onClick={exportBundle}>Export FHIR bundle</button></div>
      <div className="x-tabs">{Object.keys(fhir).map(k => <button key={k} className={rt === k ? 'on' : ''} onClick={() => setRt(k)}>{k} <em>{fhir[k].length}</em></button>)}</div>
      <pre className="x-json" key={rt} dangerouslySetInnerHTML={{ __html: hl(json) }} /></section></Reveal>
    <div className="disclaimer"><ShieldCheck size={16} /><p>Prototype data only. Real patient data needs consent, authentication, encryption and ABDM compliance review.</p></div>
  </div>;
}
