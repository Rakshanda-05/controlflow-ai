import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingDown,
  Activity,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';

export const RiskPage: React.FC = () => {
  const { riskAssessment, dashboard, formatCurrency } = useFinancial();

  const overallScore = riskAssessment?.overallScore || 68;
  const riskLevel = riskAssessment?.riskLevel || 'Elevated Risk';
  const pillars = riskAssessment?.pillars || {
    runwayRisk: 75,
    burnRateRisk: 80,
    budgetRisk: 65,
    anomalyRisk: 52,
  };
  const primaryDrivers = riskAssessment?.primaryDrivers || [];
  const stressTests = riskAssessment?.stressTests || [];
  const aiRiskSummary = riskAssessment?.aiRiskSummary || 'Evaluating enterprise capital exposure...';

  const healthScore = dashboard?.kpis?.healthScore?.score || 74;

  const pillarCards = [
    {
      title: 'Cash Runway & Depletion Risk',
      score: pillars.runwayRisk,
      desc: 'Based on 7.2-month reserve buffer vs 12-month policy corridor.',
      color: pillars.runwayRisk > 70 ? 'text-rose-600' : 'text-amber-600',
      bg: pillars.runwayRisk > 70 ? 'bg-rose-500' : 'bg-amber-500',
    },
    {
      title: 'Spending Velocity Risk',
      score: pillars.burnRateRisk,
      desc: '+13.1% MoM expansion in operating burn velocity.',
      color: pillars.burnRateRisk > 70 ? 'text-rose-600' : 'text-amber-600',
      bg: pillars.burnRateRisk > 70 ? 'bg-rose-500' : 'bg-amber-500',
    },
    {
      title: 'Budget Adherence Risk',
      score: pillars.budgetRisk,
      desc: 'Engineering is 116.1% utilized with 26% of cycle remaining.',
      color: pillars.budgetRisk > 70 ? 'text-rose-600' : 'text-amber-600',
      bg: pillars.budgetRisk > 70 ? 'bg-rose-500' : 'bg-amber-500',
    },
    {
      title: 'Outlier & Anomaly Exposure',
      score: pillars.anomalyRisk,
      desc: '7 flagged transactions under active controller review.',
      color: pillars.anomalyRisk > 70 ? 'text-rose-600' : 'text-amber-600',
      bg: pillars.anomalyRisk > 70 ? 'bg-rose-500' : 'bg-amber-500',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Top Risk Score Overview */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Radial Score Gauge */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
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
                stroke="#e11d48"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-900">{overallScore}</span>
              <span className="text-[9px] uppercase font-semibold text-rose-600">
                {riskLevel}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-rose-700 bg-rose-50 border border-rose-200">
                Risk Score: {overallScore}/100
              </span>
              <span className="text-[11px] text-slate-500">Health Index: {healthScore}/100</span>
            </div>
            <h2 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Financial Risk & Exposure Monitor
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              "{aiRiskSummary}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Four Risk Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillarCards.map((pillar, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{pillar.title}</span>
              <span className={`text-sm font-bold font-mono ${pillar.color}`}>{pillar.score}/100</span>
            </div>

            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pillar.bg}`}
                style={{ width: `${pillar.score}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* 3. Primary Root Cause Drivers */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">Key Risk Drivers & Attribution</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {primaryDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{driver.category}</span>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    driver.severity === 'critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {driver.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{driver.description}</p>
              <div className="pt-1 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Mitigation: </span>
                {driver.suggestedAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Stress Testing Matrix */}
      <div className="p-4 md:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Macroeconomic Stress Testing</h3>
            <p className="text-xs text-slate-500">Simulated downside scenarios and capital resilience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {stressTests.map((test, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{test.name}</h4>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    test.resilienceRating === 'High Resilience'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {test.resilienceRating}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{test.description}</p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Simulated Runway</span>
                  <span className="font-bold text-slate-900">{test.projectedRunwayMonths} mos</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Capital Impact</span>
                  <span className="font-bold text-rose-600">
                    -{formatCurrency(test.capitalImpact, true)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
