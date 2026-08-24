import React, { useState } from 'react';
import {
  Settings,
  Building2,
  DollarSign,
  ShieldCheck,
  RotateCcw,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const SettingsPage: React.FC = () => {
  const {
    currency,
    setCurrency,
    refreshAllData,
    addToast,
    dashboard,
  } = useFinancial();

  const [companyName, setCompanyName] = useState('Apex Technologies Pvt Ltd');
  const [arr, setArr] = useState('14200000');
  const [headcount, setHeadcount] = useState('28');
  const [sensitivity, setSensitivity] = useState<'standard' | 'strict' | 'relaxed'>('standard');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Organization Settings Saved',
      message: 'Financial profile and currency rules updated.',
    });
  };

  const handleResetData = async () => {
    await refreshAllData();
    addToast({
      type: 'success',
      title: 'Demo Data Reset',
      message: 'All balances, anomalies, and department budgets restored to default baseline.',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Organization Settings */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl glass-panel space-y-5">
        <div className="flex items-center gap-2 border-b border-[#1f293d] pb-3">
          <Building2 className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white">Organization Profile & Capital Parameters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Annual Recurring Revenue (ARR in INR ₹)
            </label>
            <input
              type="number"
              value={arr}
              onChange={(e) => setArr(e.target.value)}
              className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Employee Headcount</label>
            <input
              type="number"
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
              className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Display Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — United States Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-glow transition-all"
          >
            Save Organization Profile
          </button>
        </div>
      </form>

      {/* AI Anomaly Engine Configuration */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1f293d] pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">AI Anomaly Detection Sensitivity</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'relaxed',
              title: 'Relaxed (3.0σ)',
              desc: 'Flags only severe outliers and critical policy breaches (>3.0 Z-Score).',
            },
            {
              id: 'standard',
              title: 'Balanced (2.2σ)',
              desc: 'Recommended. Evaluates Isolation Forest, IQR thresholds, and MoM pacing.',
            },
            {
              id: 'strict',
              title: 'Strict (1.5σ)',
              desc: 'Maximum protection. Flags minor deviations and unscheduled SaaS changes.',
            },
          ].map((mode) => (
            <div
              key={mode.id}
              onClick={() => {
                setSensitivity(mode.id as any);
                addToast({
                  type: 'info',
                  title: `Sensitivity Set to ${mode.title}`,
                });
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                sensitivity === mode.id
                  ? 'border-brand-500 bg-brand-950/20 text-white shadow-glow'
                  : 'border-[#1f293d] bg-[#111827] text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{mode.title}</span>
                {sensitivity === mode.id && (
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                )}
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture & Service Status */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between border-b border-[#1f293d] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">System Architecture & Service Health</h3>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b]">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Frontend Stack</span>
            <span className="font-bold text-slate-200 mt-1 block">React 18 + TypeScript + Vite</span>
            <span className="text-[11px] text-slate-400">Tailwind CSS + Recharts + Framer</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b]">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Backend Server</span>
            <span className="font-bold text-slate-200 mt-1 block">Node.js + Express.js API</span>
            <span className="text-[11px] text-slate-400">Port 5000 / RESTful JSON</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b]">
            <span className="text-slate-500 font-semibold block uppercase text-[10px]">AI / ML Analytics</span>
            <span className="font-bold text-slate-200 mt-1 block">Scikit-Learn IsolationForest</span>
            <span className="text-[11px] text-slate-400">Holt-Winters Cash Forecaster</span>
          </div>
        </div>
      </div>
    </div>
  );
};
