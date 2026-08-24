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
  isOpen?: boolean;
  onClose?: () => void;
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
      badgeColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
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
      badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <Lightbulb className="w-4 h-4" />,
      badge: (insightCounts?.critical || 0) + (insightCounts?.high || 0),
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'risk',
      label: 'Risk Monitor',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: `${riskAssessment?.overallScore || 68}`,
      badgeColor: 'bg-slate-800 text-slate-300 border border-slate-700',
    },
    {
      id: 'assistant',
      label: 'Finance Assistant',
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'simulator',
      label: 'Scenario Simulator',
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
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0e1422] border-r border-[#1e293b] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-base">ControlFlow</span>
              <p className="text-[11px] text-slate-400">Finance Controller</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2336] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Summary Card */}
        <div className="p-3 border-b border-[#1e293b]/70 bg-[#090d17]">
          <div className="p-2.5 rounded-lg bg-[#121929] border border-[#1e293b] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {dashboard?.company?.name || 'Apex Technologies'}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>{formatCurrency(dashboard?.company?.arr || 14200000, true)} ARR</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Series A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
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
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#151d2e]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
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
        <div className="p-3 border-t border-[#1e293b] bg-[#090d17]">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-slate-400 font-medium">System Monitoring Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};
