import React from 'react';
import {
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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
    <div className="p-4 md:p-6 space-y-5 w-full max-w-7xl mx-auto">
      {/* 1. Cash Flow Summary Banner */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 text-slate-700">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Cash Flow Forecast & Runway Analysis
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
            "{aiExplanation}"
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          <span className="text-[11px] font-medium text-slate-500 px-2">Horizon:</span>
          {[3, 6, 12].map((h) => (
            <button
              key={h}
              onClick={() => setForecastHorizon(h)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                forecastHorizon === h
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {h}M
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Forecast Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Current Runway */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Current Runway</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg md:text-xl font-bold text-amber-600">{runwayMonthsCurrent}</span>
            <span className="text-[10px] text-slate-500">months</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">₹17.29L/mo burn basis</p>
        </div>

        {/* Projected Runway */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Projected Runway</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg md:text-xl font-bold text-rose-600">{projectedRunwayMonths}</span>
            <span className="text-[10px] text-slate-500">months</span>
          </div>
          <p className="text-[10px] text-rose-600/80 mt-1">Current trajectory</p>
        </div>

        {/* Safety Reserve Threshold */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Safety Floor</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg md:text-xl font-bold text-slate-900">{formatCurrency(safetyThreshold, true)}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Policy threshold</p>
        </div>

        {/* Projected Breach Date */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium block mb-1">Estimated Depletion</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg md:text-xl font-bold text-amber-600">{projectedDepletionDate}</span>
          </div>
          <p className="text-[10px] text-amber-600/80 mt-1">At current burn</p>
        </div>
      </div>

      {/* 3. Predictive Cash Flow Chart */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Cash Balance & Outflow Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Historical actuals vs {forecastHorizon}-Month econometric projection
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
              <span className="text-slate-600 font-medium">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" />
              <span className="text-slate-600 font-medium">Expenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" />
              <span className="text-slate-600 font-medium">Cash Balance</span>
            </div>
          </div>
        </div>

        <div className="h-72 md:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedSeries} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                formatter={(val: any, name: any) => [formatCurrency(Number(val)), name]}
              />

              {/* Safety Reserve Boundary Line */}
              <ReferenceLine
                y={safetyThreshold}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{ value: `Safety Floor (${formatCurrency(safetyThreshold, true)})`, fill: '#d97706', fontSize: 10, position: 'insideBottomRight' }}
              />

              {/* Historical Revenue */}
              <Bar dataKey="actualRevenue" name="Actual Revenue" fill="#10b981" radius={[3, 3, 0, 0]} />
              {/* Historical Expenses */}
              <Bar dataKey="actualExpenses" name="Actual Expenses" fill="#f43f5e" radius={[3, 3, 0, 0]} />

              {/* Forecasted Revenue */}
              <Bar dataKey="predictedRevenue" name="Forecast Revenue" fill="#6ee7b7" radius={[3, 3, 0, 0]} />
              {/* Forecasted Expenses */}
              <Bar dataKey="predictedExpenses" name="Forecast Expenses" fill="#fda4af" radius={[3, 3, 0, 0]} />

              {/* Cash Balance Line */}
              <Line
                type="monotone"
                dataKey="actualCashBalance"
                name="Actual Cash Balance"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#2563eb' }}
              />
              <Line
                type="monotone"
                dataKey="projectedCashBalance"
                name="Projected Cash Balance"
                stroke="#3b82f6"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#3b82f6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Detailed Monthly Predictive Breakdown Table */}
      <div className="rounded-xl bg-white overflow-hidden border border-slate-200 shadow-xs space-y-2">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Monthly Cash Flow Trajectory Ledger</h3>
            <p className="text-xs text-slate-500">Historical records vs forecast horizon demarcation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {combinedSeries.map((row, idx) => {
                const rev = row.actualRevenue ?? row.predictedRevenue ?? 0;
                const exp = row.actualExpenses ?? row.predictedExpenses ?? 0;
                const net = row.actualNetCashFlow ?? row.predictedNetCashFlow ?? (rev - exp);
                const bal = row.actualCashBalance ?? row.projectedCashBalance ?? 0;

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      row.isForecast ? 'bg-slate-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {row.label}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          row.isForecast
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {row.isForecast ? 'Forecast' : 'Historical'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold whitespace-nowrap">
                      +{formatCurrency(rev)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600 font-semibold whitespace-nowrap">
                      -{formatCurrency(exp)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 font-bold whitespace-nowrap">
                      {net >= 0 ? `+${formatCurrency(net)}` : `-${formatCurrency(Math.abs(net))}`}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900 font-bold whitespace-nowrap">
                      {formatCurrency(bal)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          bal < safetyThreshold
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
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
