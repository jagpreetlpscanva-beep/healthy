import { Microscope, Pill, FileText } from 'lucide-react';
import { TESTS, MEDS, statusOf } from './sampleData.js';
export * from './sampleData.js';

export const KIND = { Lab: { color: 'teal', icon: Microscope }, Prescription: { color: 'violet', icon: Pill }, Visit: { color: 'orange', icon: FileText } };
export const fmtDate = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(); };

export const EVENTS = [];
