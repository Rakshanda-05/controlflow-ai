import React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFinancial } from '../context/FinancialContext';

export const DashboardPage: React.FC = () => {
  const { dashboard, setCurrentTab, setSelectedTransaction, formatCurrency } = useFinancial();
  const kpis = dashboard?.kpis;
  const aiExecutiveSummary = dashboard?.aiExecutiveSummary || 'Financial health is stable. Operating expenses and cash reserves monitored in real-time.';
  const revenueVsExpenses = dashboard?.revenueVsExpenses || [];
  const cashBalanceTrend = dashboard?.cashBalanceTrend || [];
  const expenseCategoryBreakdown = dashboard?.expenseCategoryBreakdown || [];
  const recentTransactions = dashboard?.recentTransactions || [];
  const activeAnomalies = dashboard?.activeAnomalies || [];

  if (!kpis) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading Financial Controller Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Dynamic AI Finance Summary Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-brand-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-300 animate-pulse" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-300">
                AI Finance Controller Executive Summary
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                Real-time Synthesis
              </span>
            </div>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
              "{aiExecutiveSummary}"
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentTab('insights')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-glow flex items-center gap-1.5"
            >
              <span>View AI Recommendations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Cards Grid (6 Metrics + Health Score) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-xl glass-card relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Total Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-white tracking-tight">{formatCurrency(kpis.totalRevenue.value, true)}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{kpis.totalRevenue.changePct}%
            </span>
            <span className="text-slate-500">vs prev mo</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-xl glass-card relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Total Expenses</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-rose-400 tracking-tight">{formatCurrency(kpis.totalExpenses.value, true)}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <span className="text-rose-400 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +{kpis.totalExpenses.changePct}%
            </span>
            <span className="text-slate-500">MoM spend</span>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="p-4 rounded-xl glass-card relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Net Cash Flow</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-amber-400 tracking-tight">-{formatCurrency(Math.abs(kpis.netCashFlow.value), true)}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <span className="text-amber-400 font-bold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {kpis.netCashFlow.changePct >= 0 ? `+${kpis.netCashFlow.changePct}` : kpis.netCashFlow.changePct}%
            </span>
            <span className="text-slate-500">net burn</span>
          </div>
        </div>

        {/* Current Cash Balance */}
        <div className="p-4 rounded-xl glass-card relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Cash Reserves</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-brand-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-white tracking-tight">{formatCurrency(kpis.cashBalance.value, true)}</p>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 font-medium">
              -{formatCurrency(kpis.burnRate.value, true)} outflow this month
            </span>
          </div>
        </div>

        {/* Monthly Burn Rate */}
        <div className="p-4 rounded-xl glass-card relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Monthly Burn Rate</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-200 tracking-tight">{formatCurrency(kpis.burnRate.value, true)}/mo</p>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <span className="text-rose-400 font-bold flex items-center">
              +{kpis.burnRate.changePct}%
            </span>
            <span className="text-slate-500">expansion</span>
          </div>
        </div>

        {/* Cash Runway */}
        <div className="p-4 rounded-xl glass-card relative overflow-hidden border border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-transparent">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Cash Runway</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-amber-400 tracking-tight">{kpis.cashRunway.months} Months</p>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <span className="text-amber-400 font-bold">Safety corridor: 12 mos</span>
          </div>
        </div>
      </div>

      {/* 3. Charts Section (Grid: 2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Historical Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Revenue vs. Operating Expenses</h3>
              <p className="text-xs text-slate-400">Trailing 6-month actual performance comparison</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span className="text-slate-300">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
                <span className="text-slate-300">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpenses} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(v, true)}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health Score & Risk Distribution */}
        <div className="p-5 rounded-2xl glass-panel space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Financial Health Score</h3>
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {kpis.healthScore.rating}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Composite index based on runway & anomaly density</p>
          </div>

          {/* Health Score Circular Gauge Metric */}
          <div className="flex flex-col items-center justify-center my-auto py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#1e293b"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#6366f1"
                  strokeWidth="10"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * kpis.healthScore.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">{kpis.healthScore.score}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Out of 100</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center mt-3 max-w-[200px]">
              Stable liquidity with elevated short-term cloud infrastructure overage risk.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('risk')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#141d30] border border-[#23324d] text-slate-200 hover:text-white hover:bg-[#1a263f] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Inspect Risk Matrix Pillars</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Cash Balance Trend + Expense Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Balance Trend Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Cash Balance Trajectory</h3>
              <p className="text-xs text-slate-400">Total liquid reserves over the past 6 billing cycles</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Current: {formatCurrency(kpis.cashBalance.value, true)}
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashBalanceTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(v, true)}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Cash Balance']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#balanceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Donut */}
        <div className="p-5 rounded-2xl glass-panel space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Expense Category Allocation</h3>
            <p className="text-xs text-slate-400">Current monthly expenditure distribution</p>
          </div>

          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {expenseCategoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
            {expenseCategoryBreakdown.slice(0, 5).map((item) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="text-slate-400">{item.percentage}%</span>
                  <span className="text-white font-bold">{formatCurrency(item.amount, true)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Active Anomalies Banner + Recent Transactions Ledger Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Active Financial Anomalies & Outliers</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
              {activeAnomalies.length} Flagged
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('transactions')}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>View All Transactions Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeAnomalies.slice(0, 3).map((anomaly) => (
            <div
              key={anomaly.id}
              onClick={() => setSelectedTransaction(anomaly)}
              className="p-4 rounded-xl bg-[#111827] border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                      {anomaly.merchant}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {anomaly.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{anomaly.category} • {anomaly.department}</p>
                </div>
                <span className="text-sm font-bold text-rose-400 font-mono">
                  {formatCurrency(anomaly.amount)}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed bg-[#162035]/60 p-2 rounded-lg border border-[#1f2d47]">
                {anomaly.anomalyReason}
              </p>
              <div className="mt-2 pt-2 border-t border-[#1f293d] flex items-center justify-between text-[11px] text-slate-400">
                <span>Date: {anomaly.date}</span>
                <span className="text-brand-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Inspect Diagnostic <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
