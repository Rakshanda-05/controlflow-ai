import React from 'react';
import {
  PlusCircle,
  RotateCw,
  Sparkles,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { useFinancial, NavTab } from '../../context/FinancialContext';

interface HeaderProps {
  onOpenNewTxModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTxModal }) => {
  const { currentTab, refreshAllData, loading, currency, setCurrency } =
    useFinancial();

  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Executive Financial Dashboard',
      subtitle: 'Real-time overview of cash reserves, burn trajectory, and core unit economics',
    },
    transactions: {
      title: 'Transaction Intelligence & Ledger',
      subtitle: 'Automated ML anomaly detection, categorical spend benchmarks, and risk scoring',
    },
    cashflow: {
      title: 'Cash Flow Forecasting & Runway',
      subtitle: 'Predictive 3-to-12 month cash burn forecasting and safety reserve depletion milestones',
    },
    budgets: {
      title: 'Department Budget Intelligence',
      subtitle: 'Departmental spend allocation vs actual variance with burn velocity alerts',
    },
    insights: {
      title: 'Prioritized AI Recommendations',
      subtitle: 'Autonomous controller insights to optimize burn, recover dormant SaaS, and mitigate risk',
    },
    risk: {
      title: 'Financial Risk & Vulnerability Matrix',
      subtitle: 'Multi-factor composite scoring across runway, burn velocity, and anomaly exposure',
    },
    assistant: {
      title: 'AI Finance Assistant',
      subtitle: 'Interactive controller conversation for financial analytics, root causes, and scenarios',
    },
    simulator: {
      title: 'What-If Scenario Simulator',
      subtitle: 'Interactive stress testing of revenue shifts, headcount expansion, and marketing spend',
    },
    settings: {
      title: 'System Settings & Preferences',
      subtitle: 'Configure organization profile, currency formatting, and anomaly detection rules',
    },
  };

  const currentMeta = titles[currentTab] || titles.dashboard;

  return (
    <header className="bg-[#0d131f]/80 backdrop-blur-md border-b border-[#1f293d] px-6 py-4 sticky top-0 z-20 flex items-center justify-between">
      {/* View Title */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-white tracking-tight">{currentMeta.title}</h1>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Controller Active
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{currentMeta.subtitle}</p>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-3">
        {/* Currency Switcher */}
        <div className="flex items-center bg-[#141c2e] border border-[#23324d] rounded-lg p-0.5">
          {(['INR', 'USD', 'EUR'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currency === curr
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : '€ EUR'}
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshAllData}
          disabled={loading}
          title="Refresh live financial data"
          className="p-2 rounded-lg bg-[#141c2e] border border-[#23324d] text-slate-400 hover:text-slate-200 hover:bg-[#1a253d] transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
        </button>

        {/* Log Transaction Button */}
        <button
          onClick={onOpenNewTxModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500 transition-all shadow-glow border border-brand-400/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Transaction</span>
        </button>
      </div>
    </header>
  );
};
