import React, { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Zap,
  ArrowRight,
  Filter,
  Check,
  Building,
  Sparkles,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { FinancialInsight, InsightPriority } from '../types';

export const InsightsPage: React.FC = () => {
  const { insights, resolveInsight, dismissInsight, formatCurrency } = useFinancial();
  const [selectedFilter, setSelectedFilter] = useState<'all' | InsightPriority>('all');

  const insightList: FinancialInsight[] = insights || [];
  const filteredInsights = insightList.filter((insight) => {
    if (selectedFilter === 'all') return true;
    return insight.priority === selectedFilter;
  });

  const activeInsights = insightList.filter((i) => i.status === 'active');
  const totalPotentialSavings = activeInsights.reduce((sum, i) => sum + (i.potentialSavings || 0), 0);

  const priorityStyles: Record<
    InsightPriority,
    { badge: string; border: string; bg: string; icon: React.ReactNode }
  > = {
    critical: {
      badge: 'bg-rose-50 text-rose-700 border border-rose-200',
      border: 'border-slate-200 hover:border-rose-300',
      bg: 'bg-white',
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
    },
    high: {
      badge: 'bg-amber-50 text-amber-700 border border-amber-200',
      border: 'border-slate-200 hover:border-amber-300',
      bg: 'bg-white',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    },
    medium: {
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
      border: 'border-slate-200 hover:border-blue-300',
      bg: 'bg-white',
      icon: <Zap className="w-4 h-4 text-blue-600" />,
    },
    low: {
      badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      border: 'border-slate-200 hover:border-emerald-300',
      bg: 'bg-white',
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    },
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Header Metrics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Identified Monthly Savings</span>
            <p className="text-lg font-bold text-slate-900 tracking-tight">{formatCurrency(totalPotentialSavings, true)}/mo</p>
            <p className="text-[10px] text-emerald-700 font-medium">Annualized: {formatCurrency(totalPotentialSavings * 12, true)}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Active Recommendations</span>
            <p className="text-lg font-bold text-slate-900 tracking-tight">{activeInsights.length} Opportunities</p>
            <p className="text-[10px] text-slate-500">Ranked by risk and financial impact</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">High Priority Alerts</span>
            <p className="text-lg font-bold text-rose-600 tracking-tight">
              {insights.filter((i) => i.priority === 'critical' && i.status === 'active').length} Immediate Actions
            </p>
            <p className="text-[10px] text-slate-500">Requires review</p>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Priority:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors font-medium ${
                selectedFilter === p
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredInsights.length} recommendations
        </span>
      </div>

      {/* 3. Insights Feed List */}
      <div className="space-y-3.5">
        {filteredInsights.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900">All Clear</h4>
            <p className="text-xs text-slate-500 mt-1">No recommendations in this priority tier.</p>
          </div>
        ) : (
          filteredInsights.map((item) => {
            const style = priorityStyles[item.priority];
            const isResolved = item.status === 'resolved';
            const isDismissed = item.status === 'dismissed';

            return (
              <div
                key={item.id}
                className={`p-4 md:p-5 rounded-xl border transition-colors shadow-xs ${style.bg} ${style.border} ${
                  isResolved || isDismissed ? 'opacity-60 bg-slate-50' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{style.icon}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                          {item.priority}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                        {item.department && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {item.department}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 tracking-tight">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{item.description}</p>
                    </div>
                  </div>

                  {/* Estimated Savings & Actions */}
                  <div className="flex md:flex-col items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {item.potentialSavings && item.potentialSavings > 0 && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-medium block">
                          Potential Savings
                        </span>
                        <span className="font-mono text-sm font-bold text-emerald-700">
                          +{formatCurrency(item.potentialSavings, true)}/mo
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      {!isResolved && !isDismissed && (
                        <>
                          <button
                            onClick={() => resolveInsight(item.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Apply</span>
                          </button>
                          <button
                            onClick={() => dismissInsight(item.id)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                            title="Dismiss"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {isResolved && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          Resolved
                        </span>
                      )}

                      {isDismissed && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          Dismissed
                        </span>
                      )}
                    </div>
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
