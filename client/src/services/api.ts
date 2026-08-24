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
import {
  FALLBACK_DASHBOARD,
  FALLBACK_TRANSACTIONS,
  FALLBACK_FORECAST,
  FALLBACK_BUDGETS,
  FALLBACK_INSIGHTS,
  FALLBACK_RISK,
} from './fallbackData';

const API_BASE = '/api';

async function fetchWithFallback<T>(url: string, fallbackValue: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
      console.warn(`API request failed: ${url} (status: ${res.status}). Using offline data.`);
      return fallbackValue;
    }
    return await res.json();
  } catch (err) {
    console.warn(`API network error on ${url}. Using offline data:`, err);
    return fallbackValue;
  }
}

export const api = {
  getDashboard: async (): Promise<DashboardResponse> => {
    return fetchWithFallback('/dashboard', FALLBACK_DASHBOARD);
  },

  getTransactions: async (params?: {
    search?: string;
    category?: string;
    department?: string;
    riskLevel?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Transaction[]; pagination: { total: number; page: number; totalPages: number } }> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.department) query.append('department', params.department);
    if (params?.riskLevel) query.append('riskLevel', params.riskLevel);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const fallback = {
      data: FALLBACK_TRANSACTIONS,
      pagination: {
        total: FALLBACK_TRANSACTIONS.length,
        page: 1,
        totalPages: 1,
      },
    };

    return fetchWithFallback(`/transactions?${query.toString()}`, fallback);
  },

  getAnomalies: async (): Promise<{ count: number; anomalies: Transaction[] }> => {
    const flagged = FALLBACK_TRANSACTIONS.filter((t) => t.status === 'flagged');
    return fetchWithFallback('/anomalies', { count: flagged.length, anomalies: flagged });
  },

  updateTransactionStatus: async (
    id: string,
    status: Transaction['status'],
    riskLevel?: Transaction['riskLevel']
  ): Promise<Transaction | null> => {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, riskLevel }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback status update');
    }
    const found = FALLBACK_TRANSACTIONS.find((t) => t.id === id);
    if (found) {
      found.status = status;
      if (riskLevel) found.riskLevel = riskLevel;
      return { ...found };
    }
    return null;
  },

  addTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback add transaction');
    }
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      merchant: data.merchant || 'New Vendor',
      category: data.category || 'Operations',
      department: data.department || 'Operations',
      amount: Number(data.amount) || 100,
      type: data.type || 'expense',
      status: 'cleared',
      riskLevel: 'low',
      anomalyScore: 0.1,
      isRecurring: Boolean(data.isRecurring),
      paymentMethod: data.paymentMethod || 'Corporate Brex Card',
    };
    return newTx;
  },

  getCashFlow: async (horizon: number = 3): Promise<ForecastResponse> => {
    return fetchWithFallback(`/cashflow?horizon=${horizon}`, FALLBACK_FORECAST);
  },

  getBudgets: async (): Promise<{
    departments: DepartmentBudget[];
    summary: {
      totalAllocated: number;
      totalSpent: number;
      totalRemaining: number;
      overallPctUsed: number;
      overBudgetCount: number;
      approachingCount: number;
      monthElapsedPct: number;
    };
    aiBudgetSummary: string;
  }> => {
    const totalAllocated = FALLBACK_BUDGETS.reduce((a, b) => a + b.allocated, 0);
    const totalSpent = FALLBACK_BUDGETS.reduce((a, b) => a + b.actualSpend, 0);
    const fallback = {
      departments: FALLBACK_BUDGETS,
      summary: {
        totalAllocated,
        totalSpent,
        totalRemaining: totalAllocated - totalSpent,
        overallPctUsed: 96.2,
        overBudgetCount: 1,
        approachingCount: 2,
        monthElapsedPct: 74,
      },
      aiBudgetSummary:
        'Overall departmental budget utilization stands at 96.2% with 74% of the current month elapsed. Engineering is currently 16.1% over budget ($162.5k spent vs $140.0k allocated) due to AWS compute overages ($28.4k). Marketing is approaching its ceiling at 92.0% utilization.',
    };
    return fetchWithFallback('/budgets', fallback);
  },

  updateBudget: async (id: string, allocated: number): Promise<DepartmentBudget | null> => {
    try {
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocated }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback budget update');
    }
    const b = FALLBACK_BUDGETS.find((item) => item.id === id);
    if (b) {
      b.allocated = allocated;
      b.remaining = allocated - b.actualSpend;
      b.percentageUsed = Number(((b.actualSpend / allocated) * 100).toFixed(1));
      return { ...b };
    }
    return null;
  },

  getInsights: async (priority?: string): Promise<{
    data: AIInsight[];
    priorityCounts: { critical: number; high: number; medium: number; low: number };
    totalPotentialSavings: number;
    totalActiveInsights: number;
  }> => {
    const fallback = {
      data: FALLBACK_INSIGHTS,
      priorityCounts: { critical: 2, high: 2, medium: 1, low: 0 },
      totalPotentialSavings: 79958,
      totalActiveInsights: 5,
    };
    const query = priority && priority !== 'all' ? `?priority=${priority}` : '';
    return fetchWithFallback(`/insights${query}`, fallback);
  },

  updateInsightStatus: async (id: string, status: 'active' | 'resolved' | 'dismissed'): Promise<AIInsight | null> => {
    try {
      const res = await fetch(`${API_BASE}/insights/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback insight update');
    }
    const i = FALLBACK_INSIGHTS.find((item) => item.id === id);
    if (i) {
      i.status = status;
      return { ...i };
    }
    return null;
  },

  getRisks: async (): Promise<FinancialRiskAssessment> => {
    return fetchWithFallback('/risks', FALLBACK_RISK);
  },

  askAssistant: async (message: string): Promise<AssistantMessage> => {
    const fallbackMessage: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Based on current financial data for Apex Technologies:\n\n- **Operating Runway**: 7.2 months ($1.25M balance, $172.9k/mo burn rate).\n- **Recent Spike**: Expenses grew 18% MoM driven by AWS compute (+178% surge to $28.4k) and Meta Ads.\n- **Engineering Budget**: 116.1% utilized.\n\nRecommended action is to cap AWS autoscaling and pause low-ROI Meta lookalikes to recover $27.3k/mo.`,
      metrics: [
        { label: 'Runway', value: '7.2 Mos', delta: '-1.1 mos' },
        { label: 'Health Score', value: '64/100', delta: 'Stable' },
      ],
      suggestedFollowUps: [
        'Why did expenses increase this month?',
        'What is our biggest financial risk?',
        'Which category is overspending?',
      ],
    };

    return fetchWithFallback(
      '/assistant',
      fallbackMessage,
      {
        method: 'POST',
        body: JSON.stringify({ message }),
      }
    );
  },

  simulateScenario: async (input: ScenarioInput): Promise<ScenarioResult> => {
    const currentRev = 138000;
    const currentExp = 310900;
    const currentBal = 1245800;
    const baselineBurn = currentExp - currentRev;
    const baselineRunway = Number((currentBal / baselineBurn).toFixed(1));

    const simRev = currentRev * (1 + (input.revenueGrowthPct || 0) / 100);
    const hireOverhead = (input.newHiresCount || 0) * ((input.avgHireSalary || 120000) / 12) * 1.15;
    const simExp =
      currentExp * (1 + (input.expenseGrowthPct || 0) / 100) +
      (input.marketingSpendDelta || 0) +
      hireOverhead;

    const simNet = simRev - simExp;
    const simBurn = simNet < 0 ? Math.abs(simNet) : 0;
    const simRunway = simBurn > 0 ? Number((currentBal / simBurn).toFixed(1)) : 99.9;
    const runwayDelta = Number((simRunway - baselineRunway).toFixed(1));

    const timeline = [];
    let b = currentBal;
    let s = currentBal;
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    for (let i = 0; i < 6; i++) {
      b -= baselineBurn;
      s += simNet;
      timeline.push({
        monthNumber: i + 1,
        label: `${months[i]} '26`,
        baselineBalance: Math.max(0, Math.round(b)),
        simulatedBalance: Math.max(0, Math.round(s)),
      });
    }

    const fallbackResult: ScenarioResult = {
      inputs: input,
      baseline: {
        monthlyRevenue: currentRev,
        monthlyExpenses: currentExp,
        netCashFlow: -baselineBurn,
        cashRunwayMonths: baselineRunway,
        cashDepletionMonths: baselineRunway,
        riskScore: 68,
      },
      simulated: {
        monthlyRevenue: Math.round(simRev),
        monthlyExpenses: Math.round(simExp),
        netCashFlow: Math.round(simNet),
        cashRunwayMonths: simRunway,
        cashDepletionMonths: simRunway,
        riskScore: simRunway < 6 ? 85 : simRunway > 12 ? 40 : 65,
      },
      impact: {
        runwayDeltaMonths: runwayDelta,
        monthlyBurnDelta: simBurn - baselineBurn,
        projectedCashAfter6MonthsDelta: s - b,
        riskScoreDelta: simRunway < 6 ? 17 : simRunway > 12 ? -28 : -3,
        verdict: simNet >= 0 ? 'Accretive Growth' : simRunway >= 9 ? 'Sustainable' : 'High Risk',
      },
      aiAnalysis: `Under this simulated scenario, monthly burn shifts to $${(
        simBurn / 1000
      ).toFixed(1)}k, giving an adjusted runway of ${simRunway} months (${
        runwayDelta >= 0 ? `+${runwayDelta}` : runwayDelta
      } months vs baseline).`,
      timelineProjection: timeline,
    };

    return fetchWithFallback(
      '/simulator/calculate',
      fallbackResult,
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    );
  },
};
