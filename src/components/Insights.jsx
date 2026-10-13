import React, { useEffect, useState } from 'react';
import { Copy, Languages, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { LANGS, UI, QUESTIONS, statusOf, toneOf } from '../data';
import { Chip, CountUp, Head, Reveal } from './ui.jsx';

function Gauge({ t }) {
  const span = t.hi - t.lo, min = t.lo - span * 0.8, max = t.hi + span * 0.8;
  const pct = v => Math.max(3, Math.min(97, ((v - min) / (max - min)) * 100));
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setOn(true), 250); return () => clearTimeout(id); }, []);
  return <div className="gauge-wrap">
    <div className="gauge"><div className="gauge-zone" style={{ left: pct(t.lo) + '%', width: pct(t.hi) - pct(t.lo) + '%' }} />
      <div className={`gauge-pin ${statusOf(t)}`} style={{ left: on ? pct(t.value) + '%' : '3%' }} /></div>
    <div className="gauge-lbl"><span>Low</span><span>Ref {t.lo}–{t.hi}</span><span>High</span></div>
  </div>;
}

export function Insights({ tests, language, setLanguage, notify }) {
  const L = language, ok = tests.filter(t => statusOf(t) === 'normal').length, flagged = tests.filter(t => ['low', 'high'].includes(statusOf(t))).length;
  const C = 2 * Math.PI * 38;
  if (!tests.length) return <div><Head eyebrow="MAKE SENSE OF YOUR RECORDS" title="AI health insights" desc="Plain-language context for every value extracted from your records." /><div className="surface x-empty"><Sparkles size={26} /><strong>No test results yet</strong><p>Upload a lab report to see animated range charts and plain-language explanations.</p></div></div>;
  return <div>
    <Head eyebrow="MAKE SENSE OF YOUR RECORDS" title="AI health insights" desc="Plain-language context for every value extracted from your records.">
      <div className="x-langs">{Object.entries(LANGS).map(([k, v]) => <button key={k} className={L === k ? 'on' : ''} onClick={() => setLanguage(k)}><Languages size={13} /> {v}</button>)}</div>
    </Head>
    <section className="x-insight-hero">
      <svg viewBox="0 0 100 100" className="x-ring"><circle cx="50" cy="50" r="38" className="bg" /><circle cx="50" cy="50" r="38" className="fg" style={{ '--c': C, '--o': C * (1 - ok / (tests.length || 1)) }} /></svg>
      <div className="x-ring-num"><b><CountUp to={ok} /></b><small>/ {tests.length}</small></div>
      <div className="x-hero-copy"><Chip tone="violet"><Sparkles size={11} /> AI SUMMARY PREVIEW</Chip>
        <h2 key={L}>{UI.headline[L]}</h2><p key={L + 's'}>{ok} {UI.inRange[L]} · {flagged} {{ EN: 'need a closer look', HI: 'पर ध्यान दें', TE: 'శ్రద్ధ అవసరం' }[L]}. {UI.sub[L]}</p></div>
    </section>
    <div className="x-cards">{tests.map((t, i) => { const s = statusOf(t); return <Reveal key={t.id} delay={i * 90}>
      <article className={`surface x-test ${s}`}>
        <div className="x-test-top"><h3>{t.name}</h3><Chip tone={toneOf(s)}>{UI[s][L]}</Chip></div>
        <div className="x-big"><CountUp to={t.value} dec={t.value % 1 ? 1 : 0} /><small>{t.unit}</small></div>
        {t.lo != null && t.hi != null && <Gauge t={t} />}
        <p key={L} className="x-say">{t.say?.[L] || t.say?.EN || ''}</p>
      </article></Reveal>; })}</div>
    <Reveal><section className="surface x-ask"><div><h3><MessageCircle size={17} /> {UI.ask[L]}</h3>
      <ol>{QUESTIONS[L].map(q => <li key={q}>{q}</li>)}</ol></div>
      <button className="secondary-button" onClick={() => { navigator.clipboard?.writeText(QUESTIONS[L].join('\n')); notify('Questions copied.'); }}><Copy size={14} /> Copy list</button></section></Reveal>
    <div className="disclaimer"><ShieldCheck size={16} /><p><strong>{UI.safe[L]}</strong> AI can misread reports or miss context. Reference ranges vary by lab, age and sex. Seek urgent care for emergencies.</p></div>
  </div>;
}
