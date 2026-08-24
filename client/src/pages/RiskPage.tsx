import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  Activity,
  Flame,
  Zap,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const RiskPage: React.FC = () => {
  const { riskAssessment } = useFinancial();
  const overallScore = riskAssessment?.overallScore || 68;
  const riskLevel = riskAssessment?.riskLevel || 'elevated';
  const healthScore = riskAssessment?.healthScore || 64;
  const healthStatus = riskAssessment?.healthStatus || 'Stable';
  const pillars = riskAssessment?.pillars || { cashFlowRisk: 72, spendingRisk: 78, budgetRisk: 64, anomalyRisk: 58 };
  const topContributingFactors = riskAssessment?.topContributingFactors || [];
  const stressTestScenarios = riskAssessment?.stressTestScenarios || [];
  const aiRiskSummary = riskAssessment?.aiRiskSummary || 'Analyzing multi-pillar financial risk profile...';

  const pillarCards = [
    {
      title: 'Cash Flow & Runway Risk',
      score: pillars.cashFlowRisk,
      description: 'Runway of 7.2 months is below the 12-month enterprise safety benchmark.',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500 to-rose-500',
    },
    {
      title: 'Spending Velocity Risk',
      score: pillars.spendingRisk,
      description: 'Monthly operating expenses accelerated +18% MoM driven by AWS compute spikes.',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      color: 'from-rose-500 to-red-600',
    },
    {
      title: 'Budget Discipline Risk',
      score: pillars.budgetRisk,
      description: 'Engineering over budget (116.1%) and Marketing at 92.0% utilization.',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      color: 'from-yellow-500 to-amber-500',
    },
    {
      title: 'Anomaly & Fraud Risk',
      score: pillars.anomalyRisk,
      description: '7 active flagged transactions totaling ₹10.83L awaiting verification.',
      icon: <ShieldAlert className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500 to-brand-600',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* 1. Top Risk Score Overview */}
      <div className="p-4 md:p-5 rounded-xl bg-[#111726] border border-[#1e293b] flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Radial Score Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#f43f5e"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{overallScore}</span>
              <span className="text-[9px] uppercase font-semibold text-rose-400">
                {riskLevel}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-rose-400 bg-rose-500/10 border border-rose-500/20">
                Risk Score: {overallScore}/100
              </span>
              <span className="text-[11px] text-slate-400">Health Index: {healthScore}/100</span>
            </div>
            <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
              Risk & Capital Monitor
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              "{aiRiskSummary}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. 4 Risk Pillars Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillarCards.map((pillar, idx) => (
          <div key={idx} className="p-5 rounded-2xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                {pillar.icon}
              </div>
              <span className="text-xl font-mono font-bold text-white">{pillar.score}/100</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pillar.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${pillar.color}`}
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Safe</span>
                <span>Elevated Risk</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Top Contributing Risk Drivers */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Top Contributing Factors to Current Risk Score
            </h3>
            <p className="text-xs text-slate-400">
              Ranked root-cause drivers with actionable mitigation protocols
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topContributingFactors.map((factor, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      factor.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : factor.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {factor.severity}
                  </span>
                  <h4 className="text-xs font-bold text-white">{factor.factor}</h4>
                </div>
                <p className="text-xs text-slate-400 font-mono">{factor.impact}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#162035] border border-[#22314e] text-xs text-brand-300 md:max-w-md">
                <strong className="text-slate-400 uppercase text-[10px] block mb-0.5">Remediation:</strong>
                {factor.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Macroeconomic & Stress Test Scenarios */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Stress Test & Vulnerability Scenarios
          </h3>
          <p className="text-xs text-slate-400">Simulated downside risks and impact on runway depletion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stressTestScenarios.map((st, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{st.name}</h4>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {st.probability}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs font-bold text-rose-400 font-mono">
                {st.estimatedRunwayImpact}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{st.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
