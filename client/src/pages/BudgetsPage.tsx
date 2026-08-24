import React, { useState } from 'react';
import {
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Edit2,
  Check,
  X,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { DepartmentBudget } from '../types';

export const BudgetsPage: React.FC = () => {
  const { budgets, reallocateBudget, formatCurrency } = useFinancial();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAllocated, setEditAllocated] = useState<number>(0);

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.actualSpend || 0), 0);
  const overallUsedPct = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const monthElapsedPct = 74; // Standard billing cycle calendar progress

  const handleStartEdit = (b: DepartmentBudget) => {
    setEditingId(b.id);
    setEditAllocated(b.allocated);
  };

  const handleSaveEdit = async (id: string) => {
    await reallocateBudget(id, editAllocated);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Department Budget Summary Banner */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded bg-slate-100 text-slate-700">
            <PieChart className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
            Department Budget Overview & Burn Pacing
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
          "Department spending pacing is at <span className="font-bold text-amber-700">{overallUsedPct}%</span> while only <span className="font-bold text-slate-900">{monthElapsedPct}%</span> of the month has elapsed. <span className="text-rose-600 font-semibold">Engineering has exceeded its ceiling by ₹2.25L</span> due to AWS database overages, while Marketing has consumed 92% of its allocation. Reallocating unspent buffers from Operations & HR is advised."
        </p>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Total Monthly Budget</span>
          <p className="text-lg md:text-xl font-bold text-slate-900">{formatCurrency(totalAllocated, true)}</p>
          <p className="text-[10px] text-slate-500 mt-1">Across 6 operational departments</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Actual Spend to Date</span>
          <p className="text-lg md:text-xl font-bold text-rose-600">{formatCurrency(totalSpent, true)}</p>
          <p className="text-[10px] text-rose-600 mt-1">Pacing ahead of month elapsed</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Remaining Discretionary</span>
          <p className="text-lg md:text-xl font-bold text-amber-600">
            {formatCurrency(totalAllocated - totalSpent, true)}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Cycle cushion</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Month Elapsed</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg md:text-xl font-bold text-slate-900">{monthElapsedPct}%</span>
            <span className="text-[10px] text-slate-500">elapsed</span>
          </div>
          <p className="text-[10px] text-amber-600 mt-1">Burn pacing delta: +22.2%</p>
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
              className={`p-4 md:p-5 rounded-xl bg-white space-y-3.5 border transition-colors shadow-xs ${
                isOver
                  ? 'border-rose-200 bg-rose-50/20'
                  : isApproaching
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: dept.color }}
                    />
                    <h4 className="text-sm font-bold text-slate-900">{dept.department}</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 capitalize">{dept.id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      isOver
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isApproaching
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isOver ? 'Over Budget' : isApproaching ? 'Near Limit' : 'On Track'}
                  </span>

                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(dept)}
                      title="Adjust allocation"
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Monthly Allocation</span>
                  <span className="text-slate-900 font-mono font-bold">
                    {dept.percentageUsed}% Utilized
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : isApproaching ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(dept.percentageUsed, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Calendar: {monthElapsedPct}%</span>
                  <span className={dept.remaining < 0 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                    {dept.remaining < 0 ? `-${formatCurrency(Math.abs(dept.remaining), true)} Deficit` : `+${formatCurrency(dept.remaining, true)} Left`}
                  </span>
                </div>
              </div>

              {/* Spend vs Allocation Numbers */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium block">
                    Spent to Date
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(dept.actualSpend || 0)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium block">
                    Total Ceiling
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="number"
                        value={editAllocated}
                        onChange={(e) => setEditAllocated(Number(e.target.value))}
                        className="w-24 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-900"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(dept.id)}
                        className="p-1 rounded bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-mono font-semibold text-slate-700">
                      {formatCurrency(dept.allocated)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
