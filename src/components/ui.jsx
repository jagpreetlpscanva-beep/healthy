import React, { useEffect, useRef, useState } from 'react';

export function useCountUp(to, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, s;
    const f = t => { s = s ?? t; const p = Math.min((t - s) / ms, 1); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}
export function CountUp({ to, dec = 0, pad = 0 }) {
  const v = useCountUp(to);
  return <>{pad ? String(Math.round(v)).padStart(pad, '0') : v.toFixed(dec)}</>;
}
export function Reveal({ children, delay = 0, className = '' }) {
  const r = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); o.disconnect(); } }, { threshold: 0.1 });
    o.observe(r.current);
    return () => o.disconnect();
  }, []);
  return <div ref={r} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: delay + 'ms' }}>{children}</div>;
}
export function Head({ eyebrow, title, desc, children }) {
  return <div className="section-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{children}</div>;
}
export const Chip = ({ tone = 'teal', children }) => <span className={`x-chip x-${tone}`}>{children}</span>;
export const Conf = ({ v }) => <span className={`x-conf ${v < 90 ? 'warn' : ''}`}><i style={{ '--w': v + '%' }} /><b>{v}%</b></span>;
