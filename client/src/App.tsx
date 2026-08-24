import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/ToastContainer';
import { AnomalyDetailModal } from './components/modals/AnomalyDetailModal';
import { NewTransactionModal } from './components/modals/NewTransactionModal';

import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CashFlowPage } from './pages/CashFlowPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { InsightsPage } from './pages/InsightsPage';
import { RiskPage } from './pages/RiskPage';
import { AssistantPage } from './pages/AssistantPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { SettingsPage } from './pages/SettingsPage';
import { AlertTriangle, RotateCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ControlFlow AI UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0d14] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 max-w-lg space-y-3">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <h2 className="text-lg font-bold">ControlFlow AI Interface Loaded with Fallback</h2>
            <p className="text-xs text-slate-300">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-glow inline-flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reload Controller Dashboard</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { currentTab, selectedTransaction, setSelectedTransaction } = useFinancial();
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'cashflow':
        return <CashFlowPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'risk':
        return <RiskPage />;
      case 'assistant':
        return <AssistantPage />;
      case 'simulator':
        return <SimulatorPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0d14] text-slate-100 selection:bg-brand-500 selection:text-white font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header onOpenNewTxModal={() => setIsNewTxModalOpen(true)} />
        <main className="flex-1 pb-12">{renderCurrentPage()}</main>
      </div>

      {/* Global Modals */}
      <AnomalyDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      <NewTransactionModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FinancialProvider>
        <AppContent />
      </FinancialProvider>
    </ErrorBoundary>
  );
};

export default App;
