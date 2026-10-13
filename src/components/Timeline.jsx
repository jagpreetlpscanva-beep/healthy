import React, { useState } from 'react';
import { ChevronDown, FileText, CalendarDays } from 'lucide-react';
import { Chip, Head } from './ui.jsx';

export function Timeline({ events, goRecords }) {
  const [f, setF] = useState('All');
  const [open, setOpen] = useState(events[0]?.id);
  const kinds = ['All', 'Lab', 'Prescription', 'Visit'];
  const list = events.filter(e => f === 'All' || e.kind === f);
  return <div>
    <Head eyebrow="A CLEARER VIEW OF YOUR CARE" title="Health timeline" desc="Every report, prescription and visit, in one chronological story.">
      <button className="secondary-button" onClick={goRecords}><FileText size={15} /> Browse records</button></Head>
    <div className="x-filters">{kinds.map(k => <button key={k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{k}<em>{k === 'All' ? events.length : events.filter(e => e.kind === k).length}</em></button>)}</div>
    {!list.length && <div className="surface x-empty"><CalendarDays size={26} /><strong>Nothing on your timeline yet</strong><p>Upload and confirm a record to start building it.</p></div>}
    <div className="x-tl" key={f}>{list.map((e, i) => <div className="x-tl-item" style={{ '--i': i }} key={e.id}>
      <div className="x-tl-date">{e.date.split(',')[0]}<small>{e.date.split(',')[1]}</small></div>
      <div className="x-rail"><div className={`x-node x-${e.color}`}><e.icon size={16} /></div></div>
      <div className={`surface x-tl-card ${open === e.id ? 'open' : ''}`}>
        <button className="x-tl-top" onClick={() => setOpen(open === e.id ? null : e.id)}>
          <div><h3>{e.title}</h3><p>{e.sub}</p></div><Chip tone={e.color}>{e.tag}</Chip><ChevronDown size={17} className="chev" /></button>
        <div className="x-tl-body"><div>{e.details.map(d => <div className="x-detail" key={d.k}><span>{d.k}</span><b className={d.flag ? 'flag' : ''}>{d.v}</b>{d.flag && <Chip tone="orange">Review</Chip>}</div>)}</div></div>
      </div>
    </div>)}</div>
  </div>;
}
