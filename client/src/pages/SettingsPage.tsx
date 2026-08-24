import React, { useState } from 'react';
import {
  Building2,
  Sliders,
  DollarSign,
  ShieldCheck,
  BellRing,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const SettingsPage: React.FC = () => {
  const { dashboard, currency, setCurrency, refreshAllData, addToast, formatCurrency } =
    useFinancial();

  const [companyName, setCompanyName] = useState(dashboard?.company?.name || 'Apex Technologies Pvt Ltd');
  const [arr, setArr] = useState(dashboard?.company?.arr || 14200000);
  const [headcount, setHeadcount] = useState(dashboard?.company?.employeeCount || 28);
  const [zScoreThreshold, setZScoreThreshold] = useState(2.2);
  const [safetyReserveFloor, setSafetyReserveFloor] = useState(4000000); // ₹40L
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Financial profile and alert preferences updated.',
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
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto w-full">
      {/* Organization Settings */}
      <form onSubmit={handleSaveProfile} className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Building2 className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">Organization Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Annual Recurring Revenue (ARR in ₹)
            </label>
            <input
              type="number"
              value={arr}
              onChange={(e) => setArr(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Employee Headcount</label>
            <input
              type="number"
              value={headcount}
              onChange={(e) => setHeadcount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Display Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
            >
              <option value="INR">INR (₹) — Indian Rupee</option>
              <option value="USD">USD ($) — United States Dollar</option>
              <option value="EUR">EUR (€) — Euro</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
          >
            Save Organization Profile
          </button>
        </div>
      </form>

      {/* Anomaly Detection Sensitivity */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Anomaly Detection Sensitivity</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-900 block">Z-Score Outlier Distance</span>
            <p className="text-[11px] text-slate-500">Z ≥ {zScoreThreshold} flags statistical anomalies</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-900 block">IQR Spread Multiplier</span>
            <p className="text-[11px] text-slate-500">1.5 × IQR standard category ceiling</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-900 block">Reserve Policy Floor</span>
            <p className="text-[11px] text-slate-500">{formatCurrency(safetyReserveFloor, true)} safety reserve floor</p>
          </div>
        </div>
      </div>

      {/* Notifications & System Maintenance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Alerts */}
        <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <BellRing className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">Alert Notifications</h3>
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Email Alerts for High Risk Outflows</span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Department Budget Overrun Triggers</span>
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* System Reset */}
        <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <RotateCcw className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Demo Reset</h3>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Reset all transaction modifications, status flags, and budget ceiling adjustments back to the default demo baseline.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
          >
            Restore Default Baseline
          </button>
        </div>
      </div>
    </div>
  );
};
