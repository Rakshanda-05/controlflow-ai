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
      title: 'Financial Overview',
      subtitle: 'Real-time cash balance, burn rate, and financial health',
    },
    transactions: {
      title: 'Transactions & Ledger',
      subtitle: 'Transaction history, anomaly flags, and departmental spend',
    },
    cashflow: {
      title: 'Cash Flow Forecast',
      subtitle: 'Projections, runway analysis, and minimum safety reserves',
    },
    budgets: {
      title: 'Spending Analysis',
      subtitle: 'Departmental budget allocations and monthly burn pacing',
    },
    insights: {
      title: 'Cost Recommendations',
      subtitle: 'Actionable opportunities to reduce burn rate and optimize software spend',
    },
    risk: {
      title: 'Risk Alerts',
      subtitle: 'Key risk indicators across runway, burn rate, and outlier spend',
    },
    assistant: {
      title: 'Financial Assistant',
      subtitle: 'Inquire on financial metrics, runway calculations, and unit economics',
    },
    simulator: {
      title: 'Scenario Planning',
      subtitle: 'Model the impact of hiring plans, revenue changes, and budget shifts',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Organization profile, currency preferences, and alerting thresholds',
    },
  };

  const currentMeta = titles[currentTab] || titles.dashboard;

  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 sticky top-0 z-20 flex items-center justify-between gap-3">
      {/* Left: Mobile Menu Button + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 lg:hidden shrink-0"
          title="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0 truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight truncate">
              {currentMeta.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate hidden md:block">{currentMeta.subtitle}</p>
        </div>
      </div>

      {/* Right: Actions Toolbar */}
      <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
          {(['INR', 'USD', 'EUR'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                currency === curr
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
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
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-900' : ''}`} />
        </button>

        {/* Log Transaction Button */}
        <button
          onClick={onOpenNewTxModal}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 md:py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log Transaction</span>
          <span className="sm:hidden">Log</span>
        </button>
      </div>
    </header>
  );
};
