import React from 'react';
import { FileText, Activity, AlertCircle } from 'lucide-react';

export function ReportsInsights() {
  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Insights</h1>
        <p className="text-slate-500 text-sm mt-0.5">Understand your health trends and medical records.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <p className="text-slate-600 text-sm">Analytics and AI Insights loaded.</p>
      </div>
    </div>
  );
}
