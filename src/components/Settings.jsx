import React from 'react';

export function Settings() {
  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your preferences.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <p className="text-slate-600 text-sm">Account & Security Preferences.</p>
      </div>
    </div>
  );
}
