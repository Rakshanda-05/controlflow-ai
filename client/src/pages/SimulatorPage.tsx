import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Clock,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  BarChart2,
  DollarSign,
  UserPlus,
  Zap,
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
import { ScenarioInput } from '../types';

export const SimulatorPage: React.FC = () => {
  const { scenarioResult, runScenario, formatCurrency } = useFinancial();

  // Slider State (Rupee defaults)
  const [scenarioInputs, setScenarioInputs] = useState<ScenarioInput>({
    revenueGrowthPct: 0,
    expenseGrowthPct: 0,
    newHiresCount: 0,
    avgHireSalary: 1200000, // ₹12L default
    marketingSpendDelta: 0,
  });

  // Debounced Scenario calculation
  useEffect(() => {
    const handler = setTimeout(() => {
      runScenario(scenarioInputs);
    }, 150);
    return () => clearTimeout(handler);
  }, [scenarioInputs]);

  const handleReset = () => {
    setScenarioInputs({
      revenueGrowthPct: 0,
      expenseGrowthPct: 0,
      newHiresCount: 0,
      avgHireSalary: 1200000,
      marketingSpendDelta: 0,
    });
  };

  const applyPresetScenario = (type: 'recession' | 'expansion' | 'bootstrap' | 'delayed_fundraise') => {
    switch (type) {
      case 'recession':
        setScenarioInputs({
          revenueGrowthPct: -25,
          expenseGrowthPct: 5,
          newHiresCount: 0,
          avgHireSalary: 1200000,
          marketingSpendDelta: -800000,
        });
        break;
      case 'expansion':
        setScenarioInputs({
          revenueGrowthPct: 40,
          expenseGrowthPct: 15,
          newHiresCount: 4,
          avgHireSalary: 1200000,
          marketingSpendDelta: 1600000,
        });
        break;
      case 'bootstrap':
        setScenarioInputs({
          revenueGrowthPct: 0,
          expenseGrowthPct: -20,
          newHiresCount: -2,
          avgHireSalary: 1200000,
          marketingSpendDelta: -1200000,
        });
        break;
      case 'delayed_fundraise':
        setScenarioInputs({
          revenueGrowthPct: 10,
          expenseGrowthPct: -15,
          newHiresCount: -1,
          avgHireSalary: 1200000,
          marketingSpendDelta: -800000,
        });
        break;
    }
  };

  if (!scenarioResult) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-medium">Initializing Scenario Simulator...</p>
      </div>
    );
  }

  const { baseline, simulated, impact, aiAnalysis, timelineProjection } = scenarioResult;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Top Preset Scenarios Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-slate-700" />
            Scenario Presets:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPresetScenario('recession')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            📉 Bear Market (-25%)
          </button>
          <button
            onClick={() => applyPresetScenario('expansion')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            🚀 Expansion (+40%)
          </button>
          <button
            onClick={() => applyPresetScenario('bootstrap')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            🛡️ Bootstrap (-20%)
          </button>
          <button
            onClick={() => applyPresetScenario('delayed_fundraise')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            ⏳ Runway Extension (+5M)
          </button>
          <button
            onClick={handleReset}
            title="Reset to Baseline"
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Controls & Side-by-Side Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 p-4 md:p-5 rounded-xl bg-white space-y-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Planning Variables</h3>
            </div>
            <span className="text-[10px] text-slate-500">Live Recalculation</span>
          </div>

          {/* Slider 1: Revenue Growth */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Revenue Growth Rate</span>
              <span
                className={`font-mono font-bold ${
                  scenarioInputs.revenueGrowthPct > 0
                    ? 'text-emerald-600'
                    : scenarioInputs.revenueGrowthPct < 0
                    ? 'text-rose-600'
                    : 'text-slate-600'
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
              onChange={(e) =>
                setScenarioInputs({ ...scenarioInputs, revenueGrowthPct: Number(e.target.value) })
              }
              className="w-full accent-slate-900 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-50%</span>
              <span>Baseline (0%)</span>
              <span>+100%</span>
            </div>
          </div>

          {/* Slider 2: Expense Inflation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">General Expense Inflation</span>
              <span
                className={`font-mono font-bold ${
                  scenarioInputs.expenseGrowthPct > 0
                    ? 'text-rose-600'
                    : scenarioInputs.expenseGrowthPct < 0
                    ? 'text-emerald-600'
                    : 'text-slate-600'
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
              onChange={(e) =>
                setScenarioInputs({ ...scenarioInputs, expenseGrowthPct: Number(e.target.value) })
              }
              className="w-full accent-slate-900 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-30%</span>
              <span>Baseline (0%)</span>
              <span>+50%</span>
            </div>
          </div>

          {/* Slider 3: Headcount Additions */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Headcount Additions</span>
              <span className="font-mono font-bold text-slate-900">
                {scenarioInputs.newHiresCount > 0 ? '+' : ''}
                {scenarioInputs.newHiresCount} Roles
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="15"
              step="1"
              value={scenarioInputs.newHiresCount}
              onChange={(e) =>
                setScenarioInputs({ ...scenarioInputs, newHiresCount: Number(e.target.value) })
              }
              className="w-full accent-slate-900 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-5 Freeze</span>
              <span>0 Roles</span>
              <span>+15 Hires</span>
            </div>
          </div>

          {/* Slider 4: Marketing Budget Delta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Marketing Budget Shift</span>
              <span
                className={`font-mono font-bold ${
                  scenarioInputs.marketingSpendDelta > 0
                    ? 'text-rose-600'
                    : scenarioInputs.marketingSpendDelta < 0
                    ? 'text-emerald-600'
                    : 'text-slate-600'
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
              onChange={(e) =>
                setScenarioInputs({
                  ...scenarioInputs,
                  marketingSpendDelta: Number(e.target.value),
                })
              }
              className="w-full accent-slate-900 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-₹4.0L/mo</span>
              <span>0</span>
              <span>+₹5.0L/mo</span>
            </div>
          </div>
        </div>

        {/* Right Column: Impact Analysis & Visual Projections (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Narrative Analysis Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-slate-100 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-semibold text-slate-900 uppercase">
                  Scenario Impact Synthesis
                </span>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                  impact.verdict === 'Accretive Growth' || impact.verdict === 'Sustainable'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {impact.verdict}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              "{aiAnalysis}"
            </p>
          </div>

          {/* Side-by-Side KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">Simulated Runway</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {simulated.cashRunwayMonths} <span className="text-xs text-slate-500 font-normal">mos</span>
              </p>
              <span
                className={`text-[10px] font-medium flex items-center gap-0.5 mt-0.5 ${
                  impact.runwayDeltaMonths >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {impact.runwayDeltaMonths >= 0 ? '+' : ''}
                {impact.runwayDeltaMonths} mos delta
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">Monthly Expenses</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {formatCurrency(simulated.monthlyExpenses, true)}
              </p>
              <span
                className={`text-[10px] font-medium mt-0.5 block ${
                  impact.monthlyBurnDelta <= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {impact.monthlyBurnDelta > 0 ? '+' : ''}
                {formatCurrency(impact.monthlyBurnDelta, true)}/mo
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">6-Month Delta</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {formatCurrency(simulated.monthlyRevenue, true)}
              </p>
              <span
                className={`text-[10px] font-medium mt-0.5 block ${
                  impact.projectedCashAfter6MonthsDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {impact.projectedCashAfter6MonthsDelta >= 0 ? '+' : ''}
                {formatCurrency(impact.projectedCashAfter6MonthsDelta, true)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-medium block">Projected Risk</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {simulated.riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
              </p>
              <span
                className={`text-[10px] font-medium mt-0.5 block ${
                  impact.riskScoreDelta <= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {impact.riskScoreDelta > 0 ? '+' : ''}
                {impact.riskScoreDelta} pts
              </span>
            </div>
          </div>

          {/* Simulated Trajectory Comparison Chart */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Baseline vs. Simulated Trajectory</h4>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-slate-400 inline-block" />
                  <span className="text-slate-500">Baseline</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-blue-600 inline-block" />
                  <span className="text-blue-600 font-semibold">Simulated</span>
                </div>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineProjection} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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
                    }}
                    formatter={(val: any, name: any) => [formatCurrency(Number(val)), name]}
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineBalance"
                    name="Baseline Balance"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="simulatedBalance"
                    name="Simulated Balance"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
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
