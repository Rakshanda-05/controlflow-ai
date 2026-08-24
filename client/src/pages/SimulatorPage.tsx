import React from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  ShieldAlert,
  RotateCcw,
  Zap,
  CheckCircle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useFinancial } from '../context/FinancialContext';

export const SimulatorPage: React.FC = () => {
  const {
    scenarioInputs,
    setScenarioInputs,
    scenarioResult,
    runScenario,
    applyPresetScenario,
    formatCurrency,
  } = useFinancial();

  const handleInputChange = (field: keyof typeof scenarioInputs, value: number) => {
    const updated = { ...scenarioInputs, [field]: value };
    setScenarioInputs(updated);
    runScenario(updated);
  };

  const handleReset = () => {
    const defaultInputs = {
      revenueGrowthPct: 0,
      expenseGrowthPct: 0,
      marketingSpendDelta: 0,
      newHiresCount: 0,
      avgHireSalary: 120000,
    };
    setScenarioInputs(defaultInputs);
    runScenario(defaultInputs);
  };

  if (!scenarioResult) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Running Financial Scenario Simulation...</p>
      </div>
    );
  }

  const { baseline, simulated, impact, aiAnalysis, timelineProjection } = scenarioResult;

  const verdictBadge = {
    'Accretive Growth': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Sustainable: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'Moderate Risk': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'High Risk': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  }[impact.verdict];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Preset Scenarios Bar */}
      <div className="p-4 rounded-2xl glass-panel flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            Quick Scenario Stress Presets:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPresetScenario('recession')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50 transition-colors"
          >
            📉 Bear Market / Revenue Slowdown (-25%)
          </button>
          <button
            onClick={() => applyPresetScenario('expansion')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors"
          >
            🚀 Hypergrowth Expansion (+40% Rev, +4 Hires)
          </button>
          <button
            onClick={() => applyPresetScenario('bootstrap')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/50 transition-colors"
          >
            🛡️ Conservative Bootstrap (-20% Exp)
          </button>
          <button
            onClick={() => applyPresetScenario('delayed_fundraise')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50 transition-colors"
          >
            ⏳ Runway Extension (+5.2 Mos)
          </button>
          <button
            onClick={handleReset}
            title="Reset to Baseline"
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Controls & Side-by-Side Impact (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl glass-panel space-y-5 border border-[#1f293d]">
          <div className="flex items-center justify-between border-b border-[#1f293d] pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-400" />
              <h3 className="text-sm font-bold text-white">Simulated Strategic Variables</h3>
            </div>
            <span className="text-[10px] text-slate-400">Real-time Recalculation</span>
          </div>

          {/* Slider 1: Revenue Growth */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Revenue Growth Rate</span>
              <span
                className={`font-mono font-bold ${
                  scenarioInputs.revenueGrowthPct > 0
                    ? 'text-emerald-400'
                    : scenarioInputs.revenueGrowthPct < 0
                    ? 'text-rose-400'
                    : 'text-white'
                }`}
              >
                {scenarioInputs.revenueGrowthPct > 0 ? '+' : ''}
                {scenarioInputs.revenueGrowthPct}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={scenarioInputs.revenueGrowthPct}
              onChange={(e) => handleInputChange('revenueGrowthPct', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50% (Downturn)</span>
              <span>0% Baseline</span>
              <span>+100% (2x Scale)</span>
            </div>
          </div>

          {/* Slider 2: Expense Growth */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">General Expense Inflation</span>
              <span
                className={`font-mono font-bold ${
                  scenarioInputs.expenseGrowthPct > 0
                    ? 'text-rose-400'
                    : scenarioInputs.expenseGrowthPct < 0
                    ? 'text-emerald-400'
                    : 'text-white'
                }`}
              >
                {scenarioInputs.expenseGrowthPct > 0 ? '+' : ''}
                {scenarioInputs.expenseGrowthPct}%
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="5"
              value={scenarioInputs.expenseGrowthPct}
              onChange={(e) => handleInputChange('expenseGrowthPct', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-30% (Austerity)</span>
              <span>0% Baseline</span>
              <span>+50% (Expansion)</span>
            </div>
          </div>

          {/* Slider 3: Marketing Spend Shift */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Marketing Budget Adjustment</span>
              <span
                className={`font-mono font-bold ${
                  scenarioInputs.marketingSpendDelta > 0
                    ? 'text-rose-400'
                    : scenarioInputs.marketingSpendDelta < 0
                    ? 'text-emerald-400'
                    : 'text-white'
                }`}
              >
                {scenarioInputs.marketingSpendDelta > 0 ? '+' : ''}
                {formatCurrency(scenarioInputs.marketingSpendDelta, true)}/mo
              </span>
            </div>
            <input
              type="range"
              min="-400000"
              max="500000"
              step="50000"
              value={scenarioInputs.marketingSpendDelta}
              onChange={(e) => handleInputChange('marketingSpendDelta', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-₹4.0L (Freeze Ads)</span>
              <span>₹0</span>
              <span>+₹5.0L (Aggressive)</span>
            </div>
          </div>

          {/* Slider 4: New Hires Headcount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">New Headcount Additions</span>
              <span className="font-mono font-bold text-white">
                +{scenarioInputs.newHiresCount} Team Members
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={scenarioInputs.newHiresCount}
              onChange={(e) => handleInputChange('newHiresCount', parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Hiring Freeze)</span>
              <span>5 Hires</span>
              <span>+10 Hires</span>
            </div>
          </div>

          {/* Average Salary Input */}
          {scenarioInputs.newHiresCount > 0 && (
            <div className="p-3 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold uppercase">
                Average Annual Base Salary per Hire
              </label>
              <input
                type="number"
                step="5000"
                value={scenarioInputs.avgHireSalary}
                onChange={(e) => handleInputChange('avgHireSalary', parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-1.5 bg-[#131c2e] border border-[#1f2d47] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
              <span className="text-[10px] text-slate-500 block">
                +15% added for payroll taxes, health benefits & SaaS tools.
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Real-Time Impact & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Scenario Synthesis Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b2e] to-[#121c33] border border-brand-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
                  Simulation Outcome Assessment
                </span>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${verdictBadge}`}>
                {impact.verdict}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
              "{aiAnalysis}"
            </p>
          </div>

          {/* Side-by-Side Comparative Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Runway */}
            <div className="p-3.5 rounded-xl glass-card space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Simulated Runway</span>
              <p className="text-xl font-bold text-white">
                {simulated.cashRunwayMonths >= 90 ? 'Breakeven' : `${simulated.cashRunwayMonths} mos`}
              </p>
              <div className="text-[11px] font-mono">
                <span
                  className={
                    impact.runwayDeltaMonths > 0
                      ? 'text-emerald-400 font-bold'
                      : impact.runwayDeltaMonths < 0
                      ? 'text-rose-400 font-bold'
                      : 'text-slate-400'
                  }
                >
                  {impact.runwayDeltaMonths > 0 ? `+${impact.runwayDeltaMonths}` : impact.runwayDeltaMonths} mos delta
                </span>
              </div>
            </div>

            {/* Monthly Net Burn */}
            <div className="p-3.5 rounded-xl glass-card space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Monthly Net Flow</span>
              <p
                className={`text-xl font-bold font-mono ${
                  simulated.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simulated.netCashFlow >= 0 ? '+' : '-'}
                {formatCurrency(Math.abs(simulated.netCashFlow), true)}
              </p>
              <div className="text-[11px] font-mono text-slate-400">
                <span>Base: -{formatCurrency(Math.abs(baseline.netCashFlow), true)}</span>
              </div>
            </div>

            {/* Risk Score */}
            <div className="p-3.5 rounded-xl glass-card space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Projected Risk</span>
              <p className="text-xl font-bold text-white">{simulated.riskScore}/100</p>
              <div className="text-[11px] font-mono">
                <span
                  className={
                    impact.riskScoreDelta > 0
                      ? 'text-rose-400 font-bold'
                      : impact.riskScoreDelta < 0
                      ? 'text-emerald-400 font-bold'
                      : 'text-slate-400'
                  }
                >
                  {impact.riskScoreDelta > 0 ? `+${impact.riskScoreDelta}` : impact.riskScoreDelta} pts
                </span>
              </div>
            </div>

            {/* Cash After 6 Mos Delta */}
            <div className="p-3.5 rounded-xl glass-card space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">6-Mo Reserve Delta</span>
              <p
                className={`text-xl font-bold font-mono ${
                  impact.projectedCashAfter6MonthsDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {impact.projectedCashAfter6MonthsDelta >= 0 ? '+' : ''}
                {formatCurrency(impact.projectedCashAfter6MonthsDelta, true)}
              </p>
              <span className="text-[10px] text-slate-500 block">vs baseline path</span>
            </div>
          </div>

          {/* 6-Month Projection Comparison Chart */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                6-Month Projected Cash Reserve Trajectory
              </h4>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded bg-slate-500 inline-block" />
                  <span className="text-slate-400">Baseline Plan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded bg-brand-400 inline-block" />
                  <span className="text-brand-300 font-semibold">Simulated Plan</span>
                </div>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineProjection} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => formatCurrency(v, true)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v: any, name: any) => [formatCurrency(Number(v)), name === 'baselineBalance' ? 'Baseline Cash' : 'Simulated Cash']}
                  />
                  <ReferenceLine y={4000000} stroke="#f59e0b" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="baselineBalance"
                    name="Baseline Plan"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="simulatedBalance"
                    name="Simulated Plan"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
