import React from 'react';
import { Upload, FileText, Pill, Stethoscope, Image, ArrowRight, ShieldCheck, MoreVertical, Sparkles } from 'lucide-react';

export function UploadDocuments() {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-6">
        <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 mb-2 flex items-center gap-1 cursor-pointer">
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Upload Medical Documents</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Upload your prescriptions, lab reports, discharge summaries or diagnostic records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-300/80 p-10 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Drag & drop your files here</h3>
            <p className="text-xs text-slate-500 mb-6">or click to browse • Supports PDF, PNG, JPG (Max 10MB)</p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl text-sm shadow-sm transition cursor-pointer">
              Choose Files
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h3 className="font-bold text-slate-900 mb-4">Supported Document Types</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Lab Reports</div>
                  <div className="text-[11px] text-slate-500">Blood tests, pathology</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
