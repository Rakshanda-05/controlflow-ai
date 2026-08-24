import React from 'react';
import { PlusCircle, RotateCw, Menu } from 'lucide-react';
import { useFinancial, NavTab } from '../../context/FinancialContext';

interface HeaderProps {
  onOpenNewTxModal: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTxModal, onToggleMobileSidebar }) => {
  const { currentTab, refreshAllData, loading, currency, setCurrency } = useFinancial();

  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Real-time overview of cash reserves, burn rate, and runway',
    },
    transactions: {
      title: 'Transactions & Ledger',
      subtitle: 'Automated anomaly detection, spend benchmarks, and risk flags',
    },
    cashflow: {
      title: 'Cash Flow Forecasting',
      subtitle: '3 to 12-month projections and safety reserve milestones',
    },
    budgets: {
      title: 'Department Budgets',
      subtitle: 'Allocated vs actual spending with burn pacing alerts',
    },
    insights: {
      title: 'Financial Recommendations',
      subtitle: 'Optimizations to reduce burn rate and recover unused software seats',
    },
    risk: {
      title: 'Risk Monitor',
      subtitle: 'Multi-factor risk evaluation across runway, burn, and anomalies',
    },
    assistant: {
      title: 'Finance Assistant',
      subtitle: 'Interactive analytics and natural language Q&A',
    },
    simulator: {
      title: 'Scenario Simulator',
      subtitle: 'Stress-test hiring plans, revenue shifts, and budget adjustments',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage organization profile and sensitivity rules',
    },
  };

  const currentMeta = titles[currentTab] || titles.dashboard;

  return (
    <header className="bg-[#0e1422] border-b border-[#1e293b] px-4 md:px-6 py-3.5 sticky top-0 z-20 flex items-center justify-between gap-3">
      {/* Left: Mobile Menu Button + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#151d2e] border border-[#1e293b] lg:hidden shrink-0"
          title="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0 truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight truncate">
              {currentMeta.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate hidden md:block">{currentMeta.subtitle}</p>
        </div>
      </div>

      {/* Right: Actions Toolbar */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Currency Switcher */}
        <div className="flex items-center bg-[#121929] border border-[#1e293b] rounded-lg p-0.5">
          {(['INR', 'USD', 'EUR'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                currency === curr ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {curr === 'INR' ? '₹' : curr === 'USD' ? '$' : '€'}
              <span className="hidden sm:inline ml-1">{curr}</span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshAllData}
          disabled={loading}
          title="Refresh data"
          className="p-2 rounded-lg bg-[#121929] border border-[#1e293b] text-slate-400 hover:text-white hover:bg-[#1a2336] transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Log Transaction Button */}
        <button
          onClick={onOpenNewTxModal}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log Transaction</span>
          <span className="sm:hidden">Log</span>
        </button>
      </div>
    </header>
  );
};
