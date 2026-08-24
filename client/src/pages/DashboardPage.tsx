import React from 'react';
import {
  ArrowUpRight,
  ChevronRight,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
  const aiExecutiveSummary =
    dashboard?.aiExecutiveSummary ||
    'Financial health is stable. Operating expenses and cash reserves monitored in real-time.';
  const revenueVsExpenses = dashboard?.revenueVsExpenses || [];
  const cashBalanceTrend = dashboard?.cashBalanceTrend || [];
  const expenseCategoryBreakdown = dashboard?.expenseCategoryBreakdown || [];
  const recentTransactions = dashboard?.recentTransactions || [];
  const activeAnomalies = dashboard?.activeAnomalies || [];

  if (!kpis) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium">Loading financial metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 w-full max-w-7xl mx-auto">
      {/* 1. Executive Briefing Card */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 text-slate-700">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Financial Overview & Briefing
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
            "{aiExecutiveSummary}"
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCurrentTab('insights')}
            className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>View Recommendations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Total Revenue</span>
          <p className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
            {formatCurrency(kpis.totalRevenue.value, true)}
          </p>
          <div className="mt-1 flex items-center gap-0.5 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3 h-3 shrink-0" />
            <span>+{kpis.totalRevenue.changePct}% vs prev mo</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Total Expenses</span>
          <p className="text-base md:text-lg font-bold text-rose-600 tracking-tight">
            {formatCurrency(kpis.totalExpenses.value, true)}
          </p>
          <div className="mt-1 flex items-center gap-0.5 text-[10px] text-rose-600 font-semibold">
            <ArrowUpRight className="w-3 h-3 shrink-0" />
            <span>+{kpis.totalExpenses.changePct}% MoM</span>
          </div>
        </div>

        {/* Net Cash Flow */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Net Cash Flow</span>
          <p className="text-base md:text-lg font-bold text-amber-600 tracking-tight">
            -{formatCurrency(Math.abs(kpis.netCashFlow.value), true)}
          </p>
          <div className="mt-1 text-[10px] text-slate-500 font-medium">
            <span>Net Monthly Outflow</span>
          </div>
        </div>

        {/* Cash Reserves */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Cash Reserves</span>
          <p className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
            {formatCurrency(kpis.cashBalance.value, true)}
          </p>
          <div className="mt-1 text-[10px] text-slate-500">
            <span>Liquid Reserves</span>
          </div>
        </div>

        {/* Monthly Burn Rate */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Monthly Burn</span>
          <p className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
            {formatCurrency(kpis.burnRate.value, true)}/mo
          </p>
          <div className="mt-1 text-[10px] text-slate-500">
            <span>Burn Rate</span>
          </div>
        </div>

        {/* Cash Runway */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 block mb-1">Cash Runway</span>
          <p className="text-base md:text-lg font-bold text-amber-600 tracking-tight">
            {kpis.cashRunway.months} Months
          </p>
          <div className="mt-1 text-[10px] text-slate-500">
            <span>Target: 12.0 mos</span>
          </div>
        </div>
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue vs Expenses Historical Chart */}
        <div className="lg:col-span-2 p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Revenue vs. Operating Expenses</h3>
              <p className="text-xs text-slate-500">Trailing 6-month financial performance</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                <span className="text-slate-600 font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
                <span className="text-slate-600 font-medium">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-60 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpenses} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(v, true)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value)), '']}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[3, 3, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[3, 3, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Health Score */}
        <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Financial Health Index</h3>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {kpis.healthScore.rating}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Composite index across runway and budget adherence</p>
          </div>

          {/* Health Score Circular Gauge Metric */}
          <div className="flex flex-col items-center justify-center my-auto py-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#0f172a"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * kpis.healthScore.score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{kpis.healthScore.score}</span>
                <span className="text-[9px] uppercase font-semibold text-slate-400">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2 max-w-[200px]">
              Stable liquidity with short-term cloud infrastructure overage flags.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('risk')}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Inspect Risk Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Cash Balance Trend + Expense Category Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cash Balance Trend */}
        <div className="lg:col-span-2 p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Cash Balance Trajectory</h3>
              <p className="text-xs text-slate-500">Liquid balance over trailing billing cycles</p>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Current: {formatCurrency(kpis.cashBalance.value, true)}
            </span>
          </div>

          <div className="h-56 md:h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashBalanceTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(v, true)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Cash Balance']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#balanceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Allocation */}
        <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Expense Distribution</h3>
            <p className="text-xs text-slate-500">Current monthly spend by category</p>
          </div>

          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoryBreakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                >
                  {expenseCategoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
            {expenseCategoryBreakdown.slice(0, 5).map((item) => (
              <div key={item.category} className="flex items-center justify-between text-xs py-0.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 truncate text-[11px]">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                  <span className="text-slate-400">{item.percentage}%</span>
                  <span className="text-slate-900 font-semibold">{formatCurrency(item.amount, true)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Flagged Outliers & Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Anomaly Watchlist */}
        <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-rose-50 text-rose-600">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-sm font-bold text-slate-900">Flagged Outliers</h3>
            </div>
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              {activeAnomalies.length} Flagged
            </span>
          </div>

          <div className="space-y-2">
            {activeAnomalies.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTransaction(item)}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">{item.merchant}</span>
                  <span className="font-mono font-bold text-rose-600">{formatCurrency(item.amount)}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{item.anomalyReason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Ledger */}
        <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
            <button
              onClick={() => setCurrentTab('transactions')}
              className="text-xs text-slate-900 hover:text-indigo-600 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {recentTransactions.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTransaction(item)}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-900 block">{item.merchant}</span>
                  <span className="text-[10px] text-slate-500">{item.category} • {item.date}</span>
                </div>
                <span
                  className={`font-mono font-semibold ${
                    item.type === 'revenue' ? 'text-emerald-600' : 'text-slate-800'
                  }`}
                >
                  {item.type === 'revenue' ? '+' : ''}
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
