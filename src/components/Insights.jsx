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
        <section className="x-medical-advice" aria-label={L === 'HI' ? 'चिकित्सकीय सलाह' : L === 'TE' ? 'వైద్య సలహా' : 'Medical advice'}>
          <h4>{({ EN: 'Medical Advice / What you can do', HI: 'चिकित्सकीय सलाह / आप क्या कर सकते हैं', TE: 'వైద్య సలహా / మీరు ఏమి చేయవచ్చు' })[L]}</h4>
          <p>{s === 'normal'
            ? ({ EN: 'This value is within the reference range shown on the report. Keep following your usual health plan and discuss any symptoms or concerns with your healthcare professional.', HI: 'यह मान रिपोर्ट में दी गई संदर्भ सीमा के भीतर है। अपनी सामान्य स्वास्थ्य योजना जारी रखें और किसी भी लक्षण या चिंता पर स्वास्थ्य विशेषज्ञ से बात करें।', TE: 'ఈ విలువ నివేదికలోని సూచించిన పరిధిలో ఉంది. మీ సాధారణ ఆరోగ్య ప్రణాళికను కొనసాగించి, లక్షణాలు లేదా ఆందోళనల గురించి వైద్య నిపుణుడితో చర్చించండి।' })[L]
            : ({ EN: 'This value is outside the reference range shown on the report. A single result cannot diagnose a condition; interpretation depends on your symptoms, age, medical history and the lab range. Arrange a discussion with a qualified healthcare professional, especially if you have symptoms or an existing condition. Do not start or stop medicines based on this result alone.', HI: 'यह मान रिपोर्ट में दी गई संदर्भ सीमा से बाहर है। केवल एक जाँच से बीमारी का निदान नहीं किया जा सकता; अर्थ आपके लक्षणों, उम्र, चिकित्सा इतिहास और प्रयोगशाला की सीमा पर निर्भर करता है। योग्य स्वास्थ्य विशेषज्ञ से चर्चा करें, विशेषकर लक्षण या पहले से कोई बीमारी होने पर। केवल इस परिणाम के आधार पर दवा शुरू या बंद न करें।', TE: 'ఈ విలువ నివేదికలోని సూచించిన పరిధికి వెలుపల ఉంది. ఒక్క ఫలితం ఆధారంగా వ్యాధిని నిర్ధారించలేము; అర్థం లక్షణాలు, వయస్సు, వైద్య చరిత్ర మరియు ల్యాబ్ పరిధిపై ఆధారపడి ఉంటుంది. ముఖ్యంగా లక్షణాలు లేదా ఇప్పటికే ఉన్న ఆరోగ్య సమస్యలుంటే అర్హత కలిగిన వైద్య నిపుణుడిని సంప్రదించండి. ఈ ఫలితం ఆధారంగా మాత్రమే మందులు ప్రారంభించకండి లేదా ఆపకండి.' })[L]}</p>
          <small>{({ EN: 'General educational information only — not a diagnosis or a substitute for professional medical care.', HI: 'यह केवल सामान्य शैक्षिक जानकारी है—निदान या पेशेवर चिकित्सा देखभाल का विकल्प नहीं।', TE: 'ఇది సాధారణ విద్యా సమాచారం మాత్రమే—నిర్ధారణకు లేదా వైద్య సంరక్షణకు ప్రత్యామ్నాయం కాదు.' })[L]}</small>
        </section>
      </article></Reveal>; })}</div>
    <Reveal><section className="surface x-ask"><div><h3><MessageCircle size={17} /> {UI.ask[L]}</h3>
      <ol>{QUESTIONS[L].map(q => <li key={q}>{q}</li>)}</ol></div>
      <button className="secondary-button" onClick={() => { navigator.clipboard?.writeText(QUESTIONS[L].join('\n')); notify('Questions copied.'); }}><Copy size={14} /> Copy list</button></section></Reveal>
    <div className="disclaimer"><ShieldCheck size={16} /><p><strong>{UI.safe[L]}</strong> AI can misread reports or miss context. Reference ranges vary by lab, age and sex. Seek urgent care for emergencies.</p></div>
  </div>;
}
