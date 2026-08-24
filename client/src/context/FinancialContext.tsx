import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DashboardResponse,
  Transaction,
  ForecastResponse,
  DepartmentBudget,
  AIInsight,
  FinancialRiskAssessment,
  ScenarioResult,
  ScenarioInput,
  AssistantMessage,
} from '../types';
import { api } from '../services/api';
import {
  FALLBACK_DASHBOARD,
  FALLBACK_TRANSACTIONS,
  FALLBACK_FORECAST,
  FALLBACK_BUDGETS,
  FALLBACK_INSIGHTS,
  FALLBACK_RISK,
} from '../services/fallbackData';

export type NavTab =
  | 'dashboard'
  | 'transactions'
  | 'cashflow'
  | 'budgets'
  | 'insights'
  | 'risk'
  | 'assistant'
  | 'simulator'
  | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
}

interface FinancialContextType {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  dashboard: DashboardResponse;
  loading: boolean;
  refreshAllData: () => Promise<void>;
  
  // Transactions
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  updateTxStatus: (id: string, status: Transaction['status'], riskLevel?: Transaction['riskLevel']) => Promise<void>;
  addNewTransaction: (data: Partial<Transaction>) => Promise<void>;
  
  // Forecast
  forecast: ForecastResponse;
  forecastHorizon: number;
  setForecastHorizon: (horizon: number) => void;

  // Budgets
  budgets: DepartmentBudget[];
  reallocateBudget: (id: string, newAllocated: number) => Promise<void>;

  // Insights
  insights: AIInsight[];
  insightCounts: { critical: number; high: number; medium: number; low: number };
  resolveInsight: (id: string) => Promise<void>;
  dismissInsight: (id: string) => Promise<void>;

  // Risk
  riskAssessment: FinancialRiskAssessment;

  // Assistant
  assistantMessages: AssistantMessage[];
  isAssistantThinking: boolean;
  sendAssistantQuery: (prompt: string) => Promise<void>;

  // Simulator
  scenarioInputs: ScenarioInput;
  setScenarioInputs: (inputs: ScenarioInput) => void;
  scenarioResult: ScenarioResult | null;
  runScenario: (inputs?: ScenarioInput) => Promise<void>;
  applyPresetScenario: (preset: 'recession' | 'expansion' | 'bootstrap' | 'delayed_fundraise') => void;

  // Currency & Formatter
  currency: string;
  setCurrency: (c: string) => void;
  formatCurrency: (amount: number, compact?: boolean) => string;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);

  const [dashboard, setDashboard] = useState<DashboardResponse>(FALLBACK_DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [forecast, setForecast] = useState<ForecastResponse>(FALLBACK_FORECAST);
  const [forecastHorizon, setForecastHorizon] = useState<number>(3);

  const [budgets, setBudgets] = useState<DepartmentBudget[]>(FALLBACK_BUDGETS);
  const [insights, setInsights] = useState<AIInsight[]>(FALLBACK_INSIGHTS);
  const [insightCounts, setInsightCounts] = useState({ critical: 2, high: 2, medium: 1, low: 0 });

  const [riskAssessment, setRiskAssessment] = useState<FinancialRiskAssessment>(FALLBACK_RISK);

  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `👋 **Namaste! I am your AI Finance Controller.**\n\nI continuously monitor and analyze **Apex Technologies Pvt Ltd** financial data (₹1.42 Cr ARR). Here are key highlights:\n\n- **Operating Runway**: 7.2 months (₹1.25 Cr balance)\n- **Active Anomaly Flags**: AWS Infrastructure spike (+₹1.82L) and overseas wire (₹1.28L)\n- **Department Budget Alert**: Engineering is 16.1% over monthly allocation\n\nAsk me any question below or select a quick query to explore data-backed recommendations!`,
      metrics: [
        { label: 'Runway', value: '7.2 Mos', delta: '-1.1 mos MoM' },
        { label: 'Health Score', value: '64/100', delta: 'Stable' },
        { label: 'Active Flags', value: '7 Flagged', delta: '₹10.83L volume' },
      ],
      suggestedFollowUps: [
        'Why did expenses increase this month?',
        'What is our biggest financial risk?',
        'Which category is overspending?',
        'What happens if expenses increase by 20%?',
      ],
    },
  ]);
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  const [scenarioInputs, setScenarioInputs] = useState<ScenarioInput>({
    revenueGrowthPct: 0,
    expenseGrowthPct: 0,
    marketingSpendDelta: 0,
    newHiresCount: 0,
    avgHireSalary: 1200000,
  });
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);

  // Set default currency to INR
  const [currency, setCurrency] = useState<string>('INR');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatCurrency = (amount: number, compact: boolean = false): string => {
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';
    const abs = Math.abs(amount);

    if (compact) {
      if (currency === 'INR') {
        if (abs >= 10000000) {
          return `${symbol}${(amount / 10000000).toFixed(2)} Cr`;
        }
        if (abs >= 100000) {
          return `${symbol}${(amount / 100000).toFixed(2)}L`;
        }
        if (abs >= 1000) {
          return `${symbol}${(amount / 1000).toFixed(1)}k`;
        }
        return `${symbol}${amount.toLocaleString('en-IN')}`;
      } else {
        if (abs >= 1000000) {
          return `${symbol}${(amount / 1000000).toFixed(2)}M`;
        }
        if (abs >= 1000) {
          return `${symbol}${(amount / 1000).toFixed(1)}k`;
        }
        return `${symbol}${amount.toLocaleString()}`;
      }
    }

    if (currency === 'INR') {
      return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [dash, txRes, fc, bgRes, insRes, rk] = await Promise.all([
        api.getDashboard(),
        api.getTransactions({ limit: 50 }),
        api.getCashFlow(forecastHorizon),
        api.getBudgets(),
        api.getInsights(),
        api.getRisks(),
      ]);

      setDashboard(dash);
      setTransactions(txRes.data);
      setForecast(fc);
      setBudgets(bgRes.departments);
      setInsights(insRes.data);
      setInsightCounts(insRes.priorityCounts);
      setRiskAssessment(rk);
    } catch (e) {
      console.error('Error refreshing financial data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
    runScenario(scenarioInputs);
  }, []);

  useEffect(() => {
    api.getCashFlow(forecastHorizon).then((fc) => setForecast(fc));
  }, [forecastHorizon]);

  const updateTxStatus = async (
    id: string,
    status: Transaction['status'],
    riskLevel?: Transaction['riskLevel']
  ) => {
    const updated = await api.updateTransactionStatus(id, status, riskLevel);
    if (updated) {
      setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
      addToast({
        type: 'success',
        title: 'Transaction Updated',
        message: `Status marked as "${status}"`,
      });
    }
  };

  const addNewTransaction = async (data: Partial<Transaction>) => {
    const newTx = await api.addTransaction(data);
    setTransactions((prev) => [newTx, ...prev]);
    addToast({
      type: 'success',
      title: 'Transaction Created',
      message: `Recorded ${newTx.merchant} (${formatCurrency(newTx.amount, true)})`,
    });
  };

  const reallocateBudget = async (id: string, newAllocated: number) => {
    const updated = await api.updateBudget(id, newAllocated);
    if (updated) {
      setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
      addToast({
        type: 'success',
        title: 'Budget Reallocated',
        message: `${updated.department} allocated budget adjusted to ${formatCurrency(newAllocated, true)}`,
      });
    }
  };

  const resolveInsight = async (id: string) => {
    const updated = await api.updateInsightStatus(id, 'resolved');
    if (updated) {
      setInsights((prev) => prev.map((i) => (i.id === id ? updated : i)));
      addToast({
        type: 'success',
        title: 'Recommendation Executed',
        message: 'Action completed and marked as resolved.',
      });
    }
  };

  const dismissInsight = async (id: string) => {
    const updated = await api.updateInsightStatus(id, 'dismissed');
    if (updated) {
      setInsights((prev) => prev.map((i) => (i.id === id ? updated : i)));
      addToast({
        type: 'info',
        title: 'Insight Dismissed',
      });
    }
  };

  const sendAssistantQuery = async (prompt: string) => {
    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: prompt,
    };

    setAssistantMessages((prev) => [...prev, userMsg]);
    setIsAssistantThinking(true);

    try {
      const response = await api.askAssistant(prompt);
      setAssistantMessages((prev) => [...prev, response]);
    } catch (e) {
      console.error('Assistant error:', e);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  const runScenario = async (inputs: ScenarioInput = scenarioInputs) => {
    setScenarioInputs(inputs);
    const res = await api.simulateScenario(inputs);
    setScenarioResult(res);
  };

  const applyPresetScenario = (preset: 'recession' | 'expansion' | 'bootstrap' | 'delayed_fundraise') => {
    let presetInput: ScenarioInput;
    if (preset === 'recession') {
      presetInput = {
        revenueGrowthPct: -25,
        expenseGrowthPct: -10,
        marketingSpendDelta: -250000,
        newHiresCount: 0,
        avgHireSalary: 1200000,
      };
      addToast({ type: 'warning', title: 'Preset: Bear Market / Downturn Loaded' });
    } else if (preset === 'expansion') {
      presetInput = {
        revenueGrowthPct: 40,
        expenseGrowthPct: 15,
        marketingSpendDelta: 300000,
        newHiresCount: 4,
        avgHireSalary: 1500000,
      };
      addToast({ type: 'success', title: 'Preset: Aggressive Expansion Loaded' });
    } else if (preset === 'bootstrap') {
      presetInput = {
        revenueGrowthPct: 10,
        expenseGrowthPct: -20,
        marketingSpendDelta: -350000,
        newHiresCount: 0,
        avgHireSalary: 1200000,
      };
      addToast({ type: 'success', title: 'Preset: Conservative Bootstrap Loaded' });
    } else {
      presetInput = {
        revenueGrowthPct: 5,
        expenseGrowthPct: -15,
        marketingSpendDelta: -150000,
        newHiresCount: 1,
        avgHireSalary: 1100000,
      };
      addToast({ type: 'info', title: 'Preset: Runway Extension Mode Loaded' });
    }
    runScenario(presetInput);
  };

  return (
    <FinancialContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        dashboard,
        loading,
        refreshAllData,
        transactions,
        selectedTransaction,
        setSelectedTransaction,
        updateTxStatus,
        addNewTransaction,
        forecast,
        forecastHorizon,
        setForecastHorizon,
        budgets,
        reallocateBudget,
        insights,
        insightCounts,
        resolveInsight,
        dismissInsight,
        riskAssessment,
        assistantMessages,
        isAssistantThinking,
        sendAssistantQuery,
        scenarioInputs,
        setScenarioInputs,
        scenarioResult,
        runScenario,
        applyPresetScenario,
        currency,
        setCurrency,
        formatCurrency,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
