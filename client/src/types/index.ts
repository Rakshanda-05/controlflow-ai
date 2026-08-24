export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TransactionStatus = 'cleared' | 'pending' | 'flagged';
export type TransactionType = 'expense' | 'revenue';

export interface ExpectedRange {
  min: number;
  max: number;
  benchmarkMean: number;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  department: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  riskLevel: RiskLevel;
  anomalyScore?: number;
  anomalyReason?: string;
  expectedRange?: ExpectedRange;
  isRecurring: boolean;
  paymentMethod: string;
  notes?: string;
  invoiceUrl?: string;
}

export interface MonthlyMetric {
  month: string;
  label: string;
  revenue: number;
  expenses: number;
  netCashFlow: number;
  cashBalance: number;
  burnRate: number;
  runwayMonths: number;
}

export type BudgetStatus = 'on_track' | 'approaching_limit' | 'over_budget';

export interface DepartmentBudget {
  id: string;
  department: string;
  allocated: number;
  actualSpend: number;
  remaining: number;
  percentageUsed: number;
  status: BudgetStatus;
  monthElapsedPct: number;
  projectedOverrun: number;
  aiRecommendation: string;
  headcount: number;
  color: string;
}

export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';
export type InsightCategory =
  | 'cash_flow'
  | 'cloud_infrastructure'
  | 'saas_subscriptions'
  | 'payroll'
  | 'marketing'
  | 'operations'
  | 'tax_compliance'
  | 'vendor_risk';

export interface AIInsight {
  id: string;
  priority: InsightPriority;
  category: InsightCategory;
  title: string;
  insight: string;
  supportingData: string;
  recommendedAction: string;
  impactEstimate: string;
  status: 'active' | 'resolved' | 'dismissed';
  createdAt: string;
  department?: string;
  potentialSavings?: number;
}

export interface RiskFactor {
  factor: string;
  impact: string;
  severity: RiskLevel;
  recommendation: string;
  pillar: 'cashflow' | 'spending' | 'budget' | 'anomaly';
}

export interface StressScenario {
  name: string;
  probability: string;
  estimatedRunwayImpact: string;
  description: string;
}

export interface FinancialRiskAssessment {
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'elevated' | 'critical';
  healthScore: number;
  healthStatus: 'Optimal' | 'Stable' | 'At Risk' | 'Critical';
  pillars: {
    cashFlowRisk: number;
    spendingRisk: number;
    budgetRisk: number;
    anomalyRisk: number;
  };
  topContributingFactors: RiskFactor[];
  stressTestScenarios: StressScenario[];
  aiRiskSummary: string;
}

export interface ForecastPoint {
  month: string;
  label: string;
  predictedRevenue: number;
  predictedExpenses: number;
  predictedNetCashFlow: number;
  projectedCashBalance: number;
  confidenceUpper: number;
  confidenceLower: number;
  isForecast: boolean;
}

export interface ForecastResponse {
  historical: MonthlyMetric[];
  forecast: ForecastPoint[];
  combinedSeries: Array<{
    month: string;
    label: string;
    actualRevenue?: number;
    actualExpenses?: number;
    actualNetCashFlow?: number;
    actualCashBalance?: number;
    predictedRevenue?: number;
    predictedExpenses?: number;
    predictedNetCashFlow?: number;
    projectedCashBalance?: number;
    confidenceUpper?: number;
    confidenceLower?: number;
    isForecast: boolean;
  }>;
  aiExplanation: string;
  runwayMonthsCurrent: number;
  projectedRunwayMonths: number;
  safetyThreshold: number;
  projectedDepletionDate: string;
}

export interface KPIValue {
  value: number;
  previousValue: number;
  changePct: number;
  formatted: string;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean;
}

export interface DashboardResponse {
  company: {
    name: string;
    tier: string;
    arr: number;
    employeeCount: number;
    currency: string;
    fiscalYearEnd: string;
  };
  kpis: {
    totalRevenue: KPIValue;
    totalExpenses: KPIValue;
    netCashFlow: KPIValue;
    cashBalance: KPIValue;
    burnRate: KPIValue;
    cashRunway: {
      months: number;
      changeMonths: number;
      formatted: string;
      status: 'safe' | 'warning' | 'danger';
    };
    healthScore: {
      score: number;
      rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
      changePct: number;
    };
  };
  aiExecutiveSummary: string;
  revenueVsExpenses: Array<{
    month: string;
    revenue: number;
    expenses: number;
    netCashFlow: number;
  }>;
  cashBalanceTrend: Array<{
    month: string;
    balance: number;
    burnRate: number;
  }>;
  expenseCategoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
    transactionCount: number;
  }>;
  recentTransactions: Transaction[];
  activeAnomalies: Transaction[];
  quickStats: {
    totalTransactionsCount: number;
    anomalyCount: number;
    criticalAlertsCount: number;
    pendingInvoicesTotal: number;
  };
}

export interface ScenarioInput {
  revenueGrowthPct: number;
  expenseGrowthPct: number;
  marketingSpendDelta: number;
  newHiresCount: number;
  avgHireSalary: number;
}

export interface ScenarioResult {
  inputs: ScenarioInput;
  baseline: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    netCashFlow: number;
    cashRunwayMonths: number;
    cashDepletionMonths: number;
    riskScore: number;
  };
  simulated: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    netCashFlow: number;
    cashRunwayMonths: number;
    cashDepletionMonths: number;
    riskScore: number;
  };
  impact: {
    runwayDeltaMonths: number;
    monthlyBurnDelta: number;
    projectedCashAfter6MonthsDelta: number;
    riskScoreDelta: number;
    verdict: 'High Risk' | 'Moderate Risk' | 'Sustainable' | 'Accretive Growth';
  };
  aiAnalysis: string;
  timelineProjection: Array<{
    monthNumber: number;
    label: string;
    baselineBalance: number;
    simulatedBalance: number;
  }>;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  metrics?: Array<{ label: string; value: string; delta?: string }>;
  suggestedFollowUps?: string[];
  chartData?: any;
  chartType?: 'bar' | 'line' | 'pie';
}
