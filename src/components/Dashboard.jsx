import React from 'react';
import { FileText, Activity, Pill, Calendar as CalendarIcon, Upload, ArrowUpRight, ArrowRight, ShieldCheck } from 'lucide-react';

export function Dashboard({ setActiveTab }) {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-slate-500 text-sm font-medium">Good morning,</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patient Zero</h1>
          <p className="text-slate-500 text-sm mt-1">Your personal health records, made simple with AI.</p>
        </div>
        <button 
          onClick={() => setActiveTab('upload')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition flex items-center gap-3 cursor-pointer"
        >
          <Upload className="w-5 h-5" />
          <div className="text-left">
            <div className="text-sm font-semibold leading-none">Upload Medical Document</div>
            <div className="text-[11px] text-emerald-100 font-normal mt-1">PDF, PNG, JPG (Max 10MB)</div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900">5</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Reports & Test Results</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> 2 this week
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900">18</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Observations Extracted</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> 7 this week
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900">3</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Medications Found</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> 1 this week
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-900">4</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Timeline Events</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> 2 this week
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between bg-gradient-to-br from-emerald-50/60 to-teal-50/20 border-emerald-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-base font-bold text-slate-900 leading-snug">Try Demo Mode</div>
            <div className="text-[11px] text-slate-500 mt-1 leading-normal">Explore with sample medical records and see how MediMind AI works.</div>
            <button className="mt-3 w-full bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer">
              Load Demo Data <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-slate-700" />
                <h2 className="font-bold text-slate-900">Latest Reports</h2>
              </div>
              <button onClick={() => setActiveTab('timeline')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-6">Document</th>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-900 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-600" /> Blood_Report.pdf <span className="text-xs text-slate-400 font-normal">2.4 MB</span>
                    </td>
                    <td className="py-3.5 px-6"><span className="bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-full font-medium">Lab Report</span></td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs">Oct 10, 2025</td>
                    <td className="py-3.5 px-6"><span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Processed</span></td>
                    <td className="py-3.5 px-6 text-right"><ArrowRight className="w-4 h-4 text-slate-400 inline" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-900 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-purple-600" /> Prescription.jpg <span className="text-xs text-slate-400 font-normal">1.2 MB</span>
                    </td>
                    <td className="py-3.5 px-6"><span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">Prescription</span></td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs">Oct 8, 2025</td>
                    <td className="py-3.5 px-6"><span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Processed</span></td>
                    <td className="py-3.5 px-6 text-right"><ArrowRight className="w-4 h-4 text-slate-400 inline" /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-900 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-600" /> Discharge_Summary.pdf <span className="text-xs text-slate-400 font-normal">3.1 MB</span>
                    </td>
                    <td className="py-3.5 px-6"><span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">Discharge Summary</span></td>
                    <td className="py-3.5 px-6 text-slate-500 text-xs">Oct 5, 2025</td>
                    <td className="py-3.5 px-6"><span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Processed</span></td>
                    <td className="py-3.5 px-6 text-right"><ArrowRight className="w-4 h-4 text-slate-400 inline" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-5 h-5 text-slate-700" />
                <h2 className="font-bold text-slate-900">Health Timeline</h2>
              </div>
              <button onClick={() => setActiveTab('timeline')} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              <div className="relative">
                <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-50"></div>
                <div className="flex justify-between items-start bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-1">Oct 10, 2025</div>
                    <div className="font-bold text-slate-900 text-sm">Blood Test Report</div>
                    <div className="text-xs text-slate-500 mt-0.5">Lab Report • City Diagnostics Lab</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">3 observations</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-white ring-4 ring-purple-50"></div>
                <div className="flex justify-between items-start bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-1">Oct 8, 2025</div>
                    <div className="font-bold text-slate-900 text-sm">Prescription</div>
                    <div className="text-xs text-slate-500 mt-0.5">Prescription • Dr. Sharma Clinic</div>
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">2 medications</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-slate-900">AI Health Insights</h2>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md">EN</span>
                <span className="text-slate-500 px-2 py-0.5">हिंदी</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Key Findings
              </div>
              <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc">
                <li>Hemoglobin is within the normal range (12.4 g/dL).</li>
                <li>Vitamin D is below the normal range (12.8 ng/mL).</li>
                <li>Cholesterol is slightly high (210 mg/dL).</li>
              </ul>
            </div>

            <button onClick={() => setActiveTab('insights')} className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer">
              View Full Explanation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <Pill className="w-5 h-5 text-slate-700" />
                <h2 className="font-bold text-slate-900">Recent Medications</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer">View All</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Metformin 500mg</div>
                    <div className="text-[11px] text-slate-500">Twice daily • 30 days</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
