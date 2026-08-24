import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Lightbulb,
  ShieldCheck,
  MessageSquare,
  SlidersHorizontal,
  Settings,
  Building2,
  X,
  Wallet,
} from 'lucide-react';
import { useFinancial, NavTab } from '../../context/FinancialContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, dashboard, insightCounts, riskAssessment, formatCurrency } =
    useFinancial();

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <Receipt className="w-4 h-4" />,
      badge: dashboard.quickStats?.anomalyCount || 7,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
    },
    {
      id: 'cashflow',
      label: 'Cash Flow',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'budgets',
      label: 'Budgets',
      icon: <PieChart className="w-4 h-4" />,
      badge: '1 Over',
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    {
      id: 'insights',
      label: 'Recommendations',
      icon: <Lightbulb className="w-4 h-4" />,
      badge: (insightCounts?.critical || 0) + (insightCounts?.high || 0),
      badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    {
      id: 'risk',
      label: 'Risk Alerts',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: `${riskAssessment?.overallScore || 68}`,
      badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200',
    },
    {
      id: 'assistant',
      label: 'Financial Assistant',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'simulator',
      label: 'Scenario Planning',
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const handleTabClick = (tab: NavTab) => {
    setCurrentTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 z-50 lg:hidden backdrop-blur-xs transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out shadow-lg lg:shadow-none lg:static lg:w-64 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base">ControlFlow</span>
              <p className="text-[11px] text-slate-500 font-medium">Finance Controller</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Summary Card */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/70">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {dashboard?.company?.name || 'Apex Technologies'}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span>{formatCurrency(dashboard?.company?.arr || 14200000, true)} ARR</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Series A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Controller Status Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-slate-600 font-medium">Live Ledger Sync</span>
          </div>
        </div>
      </aside>
    </>
  );
};
