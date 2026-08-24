import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Filter,
  Layers,
  Zap,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { AIInsight, InsightPriority } from '../types';

export const InsightsPage: React.FC = () => {
  const { insights, resolveInsight, dismissInsight, formatCurrency } = useFinancial();
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');

  const insightList = insights || [];
  const filteredInsights = insightList.filter((item) => {
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const activeInsights = insightList.filter((i) => i.status === 'active');
  const totalPotentialSavings = activeInsights.reduce((sum, i) => sum + (i.potentialSavings || 0), 0);

  const priorityStyles: Record<
    InsightPriority,
    { badge: string; border: string; bg: string; icon: React.ReactNode }
  > = {
    critical: {
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
      border: 'border-rose-500/30 hover:border-rose-500/50',
      bg: 'bg-[#111726]',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    },
    high: {
      badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
      border: 'border-amber-500/30 hover:border-amber-500/50',
      bg: 'bg-[#111726]',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    },
    medium: {
      badge: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30',
      border: 'border-indigo-500/30 hover:border-indigo-500/50',
      bg: 'bg-[#111726]',
      icon: <Zap className="w-4 h-4 text-indigo-400" />,
    },
    low: {
      badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      bg: 'bg-[#111726]',
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    },
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* 1. Header Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-[#1e293b] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Identified Savings</span>
            <p className="text-lg font-bold text-white tracking-tight">{formatCurrency(totalPotentialSavings, true)}/mo</p>
            <p className="text-[10px] text-emerald-400 font-medium">Annualized: {formatCurrency(totalPotentialSavings * 12, true)}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1e293b] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Active Insights</span>
            <p className="text-lg font-bold text-white tracking-tight">{activeInsights.length} Recommendations</p>
            <p className="text-[10px] text-slate-400">Ranked by risk and impact</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-[#1e293b] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Critical Alerts</span>
            <p className="text-lg font-bold text-rose-400 tracking-tight">
              {insights.filter((i) => i.priority === 'critical' && i.status === 'active').length} Immediate Alerts
            </p>
            <p className="text-[10px] text-slate-400">Requires review</p>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#111726] border border-[#1e293b]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Priority:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                priorityFilter === p
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'bg-[#141c2e] text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-[#1e293b] text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({activeInsights.length})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'resolved'
                ? 'bg-[#1e293b] text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolved ({insights.filter((i) => i.status === 'resolved').length})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#1e293b] text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* 3. Prioritized Insights Feed */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-2xl">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <h4 className="text-base font-bold text-white">All Clear in this Category</h4>
            <p className="text-xs text-slate-400 mt-1">No pending recommendations match your current filter.</p>
          </div>
        ) : (
          filteredInsights.map((item) => {
            const style = priorityStyles[item.priority];
            const isResolved = item.status === 'resolved';
            const isDismissed = item.status === 'dismissed';

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-all ${style.bg} ${style.border} ${
                  isResolved ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    {/* Header line */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${style.badge}`}>
                        {style.icon}
                        {item.priority} Priority
                      </span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {item.category.replace('_', ' ')}
                      </span>
                      {item.department && (
                        <span className="text-[11px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">
                          {item.department}
                        </span>
                      )}
                      {isResolved && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Resolved ✓
                        </span>
                      )}
                    </div>

                    {/* Title & Narrative */}
                    <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                      {item.insight}
                    </p>

                    {/* Supporting Evidence Data */}
                    <div className="p-3 rounded-xl bg-[#0b0f19]/80 border border-[#1e293b] text-xs font-mono text-slate-400">
                      <strong className="text-slate-300 font-sans uppercase text-[10px] block mb-1">
                        Supporting Evidence:
                      </strong>
                      {item.supportingData}
                    </div>

                    {/* Recommended Action & Impact Estimate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-brand-200">
                        <strong className="text-brand-300 uppercase text-[10px] block mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-brand-400" /> Recommended Action
                        </strong>
                        {item.recommendedAction}
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                        <strong className="text-emerald-400 uppercase text-[10px] block mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-emerald-400" /> Estimated Financial Impact
                        </strong>
                        {item.impactEstimate}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex md:flex-col items-center gap-2 shrink-0 pt-2 md:pt-0">
                    {!isResolved && !isDismissed ? (
                      <>
                        <button
                          onClick={() => resolveInsight(item.id)}
                          className="w-full px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-glowEmerald flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Execute Action</span>
                        </button>
                        <button
                          onClick={() => dismissInsight(item.id)}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => resolveInsight(item.id)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Re-open
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
