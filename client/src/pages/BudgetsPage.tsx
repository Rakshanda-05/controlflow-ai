import React, { useState } from 'react';
import {
  Sparkles,
  PieChart,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Edit2,
  Check,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { DepartmentBudget } from '../types';

export const BudgetsPage: React.FC = () => {
  const { budgets, reallocateBudget, formatCurrency } = useFinancial();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const budgetList = budgets || [];
  const totalAllocated = budgetList.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgetList.reduce((sum, b) => sum + b.actualSpend, 0);
  const overallUsedPct = totalAllocated > 0 ? Number(((totalSpent / totalAllocated) * 100).toFixed(1)) : 0;
  const monthElapsedPct = 74;

  const handleStartEdit = (b: DepartmentBudget) => {
    setEditingId(b.id);
    setEditAmount(String(b.allocated));
  };

  const handleSaveEdit = async (id: string) => {
    const val = parseFloat(editAmount);
    if (!isNaN(val) && val > 0) {
      await reallocateBudget(id, val);
    }
    setEditingId(null);
  };

  const statusBadge = (status: DepartmentBudget['status']) => {
    if (status === 'over_budget') {
      return (
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Over Budget
        </span>
      );
    }
    if (status === 'approaching_limit') {
      return (
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Approaching Limit
        </span>
      );
    }
    return (
      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        On Track
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* 1. Department Budget Summary Banner */}
      <div className="p-4 md:p-5 rounded-xl bg-[#111726] border border-[#1e293b]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded bg-indigo-500/10 text-indigo-400">
            <PieChart className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
            Budget Pacing Overview
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
          "Department spending pacing is at <span className="font-bold text-amber-300">{overallUsedPct}%</span> while only <span className="font-bold text-white">{monthElapsedPct}%</span> of the month has elapsed. <span className="text-rose-400 font-semibold">Engineering has exceeded its ceiling by ₹2.25L</span> due to AWS database overages, while Marketing has consumed 92% of its allocation. Reallocating unspent buffers from Operations & HR is advised."
        </p>
      </div>

      {/* 2. Top Summary KPI Cards (Responsive Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-3.5 md:p-4 rounded-xl bg-[#111726] border border-[#1e293b]">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">Total Budget</span>
          <p className="text-lg md:text-xl font-bold text-white">{formatCurrency(totalAllocated, true)}</p>
          <p className="text-[10px] text-slate-500 mt-1">6 departments</p>
        </div>

        <div className="p-3.5 md:p-4 rounded-xl bg-[#111726] border border-[#1e293b]">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">Actual Spend</span>
          <p className="text-lg md:text-xl font-bold text-rose-400">{formatCurrency(totalSpent, true)}</p>
          <p className="text-[10px] text-rose-400/80 mt-1">Ahead of pacing</p>
        </div>

        <div className="p-3.5 md:p-4 rounded-xl bg-[#111726] border border-[#1e293b]">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">Remaining Buffer</span>
          <p className="text-lg md:text-xl font-bold text-amber-400">
            {formatCurrency(totalAllocated - totalSpent, true)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Cycle cushion</p>
        </div>

        <div className="p-3.5 md:p-4 rounded-xl bg-[#111726] border border-[#1e293b]">
          <span className="text-[11px] text-slate-400 font-medium block mb-1">Month Progress</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg md:text-xl font-bold text-amber-400">{monthElapsedPct}%</span>
            <span className="text-[10px] text-slate-400">elapsed</span>
          </div>
          <p className="text-[10px] text-amber-400/80 mt-1">+22.2% burn pacing</p>
        </div>
      </div>

      {/* 3. Department Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((dept) => {
          const isOver = dept.status === 'over_budget';
          const isApproaching = dept.status === 'approaching_limit';
          const isEditing = editingId === dept.id;

          return (
            <div
              key={dept.id}
              className={`p-4 md:p-5 rounded-xl bg-[#111726] space-y-3.5 border transition-colors ${
                isOver
                  ? 'border-rose-500/30 bg-rose-950/5'
                  : isApproaching
                  ? 'border-amber-500/30 bg-amber-950/5'
                  : 'border-[#1e293b]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: dept.color }}
                    />
                    <h3 className="text-base font-bold text-white">{dept.department}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dept.headcount} Team Members</span>
                  </div>
                </div>
                {statusBadge(dept.status)}
              </div>

              {/* Spend Metrics & Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">
                    Spent: <strong className="text-white font-mono">{formatCurrency(dept.actualSpend, true)}</strong>
                  </span>
                  <span className="text-slate-400">
                    Budget: <strong className="text-white font-mono">{formatCurrency(dept.allocated, true)}</strong>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : isApproaching ? 'bg-amber-500' : 'bg-brand-500'
                    }`}
                    style={{ width: `${Math.min(100, dept.percentageUsed)}%` }}
                  />
                  {/* Calendar Progress Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow"
                    style={{ left: `${monthElapsedPct}%` }}
                    title={`Current Month Elapsed: ${monthElapsedPct}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    className={`font-bold ${
                      isOver ? 'text-rose-400' : isApproaching ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {dept.percentageUsed}% Utilized
                  </span>
                  <span className={dept.remaining < 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {dept.remaining < 0 ? `-${formatCurrency(Math.abs(dept.remaining), true)} Deficit` : `+${formatCurrency(dept.remaining, true)} Left`}
                  </span>
                </div>
              </div>

              {/* AI Department Recommendation */}
              <div className="p-3 rounded-xl bg-[#0f172a] border border-[#1e293b] text-xs text-slate-300 leading-relaxed">
                <div className="flex items-center gap-1.5 text-brand-300 font-semibold text-[11px] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>Controller Recommendation</span>
                </div>
                <p>{dept.aiRecommendation}</p>
              </div>

              {/* Budget Reallocation Action */}
              <div className="pt-2 border-t border-[#1e293b] flex items-center justify-between">
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-full px-2 py-1 bg-[#131c2e] border border-brand-500 rounded text-xs text-white font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(dept.id)}
                      className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(dept)}
                    className="text-xs font-semibold text-slate-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Adjust Department Ceiling</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
