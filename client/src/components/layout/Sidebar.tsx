import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Sparkles,
  ShieldAlert,
  Bot,
  SlidersHorizontal,
  Settings,
  Cpu,
  Building2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useFinancial, NavTab } from '../../context/FinancialContext';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, dashboard, insightCounts, riskAssessment, formatCurrency } = useFinancial();

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
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <Receipt className="w-5 h-5" />,
      badge: dashboard.quickStats?.anomalyCount || 7,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    },
    {
      id: 'cashflow',
      label: 'Cash Flow',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'budgets',
      label: 'Budgets',
      icon: <PieChart className="w-5 h-5" />,
      badge: '1 Over',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: <Sparkles className="w-5 h-5" />,
      badge: insightCounts.critical + insightCounts.high,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'risk',
      label: 'Risk Monitor',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: `${riskAssessment.overallScore}`,
      badgeColor:
        riskAssessment.overallScore > 65
          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    },
    {
      id: 'assistant',
      label: 'AI Finance Assistant',
      icon: <Bot className="w-5 h-5" />,
    },
    {
      id: 'simulator',
      label: 'Scenario Simulator',
      icon: <SlidersHorizontal className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-[#0d131f] border-r border-[#1f293d] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1f293d] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 flex items-center justify-center shadow-glow border border-brand-400/30">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-tight text-lg">ControlFlow</span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30 tracking-wider">
              AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Finance Controller</p>
        </div>
      </div>

      {/* Company Selector Profile Card */}
      <div className="px-4 py-3 border-b border-[#1f293d]/60 bg-[#0a0f1a]/50">
        <div className="p-2.5 rounded-lg bg-[#141c2e] border border-[#23324d] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{dashboard.company.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>{formatCurrency(dashboard.company.arr || 14200000, true)} ARR</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Series A</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Financial Intelligence
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-brand-600 text-white shadow-glow border border-brand-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151e30]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'
                  } transition-colors`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

      {/* Controller Live Status Banner */}
      <div className="p-4 border-t border-[#1f293d] bg-[#090d16]">
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-300">Autonomous Controller</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Real-time anomaly monitoring & forecast engine active.
          </p>
          <div className="mt-2.5 pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              ML Isolation Forest
            </span>
            <span className="text-emerald-400 font-medium">99.4% Sync</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
