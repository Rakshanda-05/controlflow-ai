import React from 'react';
import {
  Sparkles,
  TrendingUp,
  Clock,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useFinancial } from '../context/FinancialContext';

export const CashFlowPage: React.FC = () => {
  const { forecast, forecastHorizon, setForecastHorizon, formatCurrency } = useFinancial();
  const combinedSeries = forecast?.combinedSeries || [];
  const aiExplanation = forecast?.aiExplanation || 'Analyzing cash burn trajectory...';
  const runwayMonthsCurrent = forecast?.runwayMonthsCurrent || 7.2;
  const projectedRunwayMonths = forecast?.projectedRunwayMonths || 6.8;
  const projectedDepletionDate = forecast?.projectedDepletionDate || 'Jul 2026';
  const safetyThreshold = forecast?.safetyThreshold || 4000000;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. AI Forecasting Diagnostic Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b2e] to-[#121c33] border border-brand-500/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-300 animate-pulse" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-300">
                AI Predictive Cash Flow & Runway Forecast
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                Safety Threshold Alert
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              "{aiExplanation}"
            </p>
          </div>

          {/* Horizon Selector Buttons */}
          <div className="flex items-center bg-[#0d1424] p-1 rounded-xl border border-[#1f2d47] shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase">Horizon:</span>
            {[3, 6, 12].map((h) => (
              <button
                key={h}
                onClick={() => setForecastHorizon(h)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  forecastHorizon === h
                    ? 'bg-brand-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h} Months
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top Forecast Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Runway */}
        <div className="p-4 rounded-xl glass-card">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Current Runway</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{runwayMonthsCurrent}</span>
            <span className="text-xs text-slate-400">months</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Trailing burn rate basis ($172.9k/mo)</p>
        </div>

        {/* Projected Runway */}
        <div className="p-4 rounded-xl glass-card">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Projected Forecast Runway</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400">{projectedRunwayMonths}</span>
            <span className="text-xs text-slate-400">months</span>
          </div>
          <p className="text-[11px] text-rose-400/80 mt-2">Accelerating burn trajectory</p>
        </div>

        {/* Safety Reserve Threshold */}
        <div className="p-4 rounded-xl glass-card">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Safety Reserve Boundary</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{formatCurrency(safetyThreshold, true)}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Minimum required enterprise buffer</p>
        </div>

        {/* Projected Breach Date */}
        <div className="p-4 rounded-xl glass-card border-amber-500/30 bg-amber-950/10">
          <span className="text-xs text-amber-300 font-semibold block mb-1">Estimated Reserve Depletion</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">{projectedDepletionDate}</span>
          </div>
          <p className="text-[11px] text-amber-300/80 mt-2">Without proactive cost containment</p>
        </div>
      </div>

      {/* 3. Predictive Cash Flow Chart (Historical vs Predicted with Confidence Corridor) */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Cash Balance & Burn Trajectory Projection
            </h3>
            <p className="text-xs text-slate-400">
              Historical actuals (solid) vs {forecastHorizon}-Month AI econometric forecast (dashed with confidence corridor)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span className="text-slate-300">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
              <span className="text-slate-300">Expenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded bg-brand-400 inline-block" />
              <span className="text-slate-300">Cash Balance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border border-dashed border-amber-400 bg-amber-500/20 inline-block" />
              <span className="text-amber-300">Confidence Band</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedSeries} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => formatCurrency(v, true)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any, name: any) => [formatCurrency(Number(val)), name]}
              />

              {/* Safety Reserve Boundary Line */}
              <ReferenceLine
                y={safetyThreshold}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: `Safety Floor (${formatCurrency(safetyThreshold, true)})`, fill: '#f59e0b', fontSize: 10, position: 'insideBottomRight' }}
              />

              {/* Historical Revenue */}
              <Bar dataKey="actualRevenue" name="Actual Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              {/* Historical Expenses */}
              <Bar dataKey="actualExpenses" name="Actual Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />

              {/* Forecasted Revenue (Striped/Lighter) */}
              <Bar dataKey="predictedRevenue" name="Forecast Revenue" fill="#34d399" opacity={0.65} radius={[4, 4, 0, 0]} />
              {/* Forecasted Expenses (Striped/Lighter) */}
              <Bar dataKey="predictedExpenses" name="Forecast Expenses" fill="#fb7185" opacity={0.65} radius={[4, 4, 0, 0]} />

              {/* Cash Balance Line */}
              <Line
                type="monotone"
                dataKey="actualCashBalance"
                name="Actual Cash Balance"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1' }}
              />
              <Line
                type="monotone"
                dataKey="projectedCashBalance"
                name="Projected Cash Balance"
                stroke="#818cf8"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#818cf8' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Detailed Monthly Predictive Breakdown Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-[#1f293d] space-y-2">
        <div className="p-4 border-b border-[#1f293d] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Cash Flow Trajectory Ledger</h3>
            <p className="text-xs text-slate-400">Full period metrics with historical vs forecast demarcation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-semibold text-[11px] border-b border-[#1f293d]">
              <tr>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Operating Expenses</th>
                <th className="py-3 px-4 text-right">Net Cash Burn</th>
                <th className="py-3 px-4 text-right">Closing Cash Reserves</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {combinedSeries.map((row, idx) => {
                const rev = row.actualRevenue ?? row.predictedRevenue ?? 0;
                const exp = row.actualExpenses ?? row.predictedExpenses ?? 0;
                const net = row.actualNetCashFlow ?? row.predictedNetCashFlow ?? (rev - exp);
                const bal = row.actualCashBalance ?? row.projectedCashBalance ?? 0;

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-[#151f33] transition-colors ${
                      row.isForecast ? 'bg-[#121c33]/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          row.isForecast
                            ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {row.isForecast ? 'AI Forecast' : 'Historical Actual'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-semibold whitespace-nowrap">
                      +{formatCurrency(rev)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-400 font-semibold whitespace-nowrap">
                      -{formatCurrency(exp)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-400 font-bold whitespace-nowrap">
                      {net >= 0 ? `+${formatCurrency(net)}` : `-${formatCurrency(Math.abs(net))}`}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-white font-bold whitespace-nowrap">
                      {formatCurrency(bal)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          bal < safetyThreshold
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {bal < safetyThreshold ? 'Under Safety Floor' : 'Safe Corridor'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
