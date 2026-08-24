import { Router, Request, Response } from 'express';
import { COMPANY_PROFILE, MONTHLY_HISTORICALS } from '../data/mockFinancials';
import { anomalyService } from '../services/anomalyService';
import { summaryService } from '../services/summaryService';
import { riskService } from '../services/riskService';
import { DashboardResponse, KPIValue } from '../types';

export const dashboardRouter = Router();

dashboardRouter.get('/', (req: Request, res: Response) => {
  try {
    const historicals = MONTHLY_HISTORICALS;
    const current = historicals[historicals.length - 1];
    const previous = historicals[historicals.length - 2];

    const revChange = ((current.revenue - previous.revenue) / previous.revenue) * 100;
    const expChange = ((current.expenses - previous.expenses) / previous.expenses) * 100;
    const netFlowChange = ((current.netCashFlow - previous.netCashFlow) / Math.abs(previous.netCashFlow)) * 100;
    const cashChange = ((current.cashBalance - previous.cashBalance) / previous.cashBalance) * 100;
    const burnChange = ((current.burnRate - previous.burnRate) / previous.burnRate) * 100;
    const runwayChange = current.runwayMonths - previous.runwayMonths;

    const riskAssessment = riskService.getRiskAssessment();
    const allTransactions = anomalyService.getAllTransactions();
    const activeAnomalies = anomalyService.getAnomalies();

    // Expense Category Breakdown for Current Month
    const categoryTotals: Record<string, { amount: number; count: number }> = {};
    allTransactions.forEach((tx) => {
      if (tx.type === 'expense') {
        if (!categoryTotals[tx.category]) {
          categoryTotals[tx.category] = { amount: 0, count: 0 };
        }
        categoryTotals[tx.category].amount += tx.amount;
        categoryTotals[tx.category].count += 1;
      }
    });

    const categoryColors: Record<string, string> = {
      'Payroll & Benefits': '#6366f1',
      'Marketing': '#ec4899',
      'Cloud Infrastructure': '#3b82f6',
      'Software & Subscriptions': '#8b5cf6',
      'Operations': '#10b981',
      'Executive & Legal': '#f59e0b',
      'Travel & Entertainment': '#14b8a6',
      'Office & Hardware': '#06b6d4',
    };

    const totalCalculatedExpense = Object.values(categoryTotals).reduce((a, b) => a + b.amount, 0);

    const expenseCategoryBreakdown = Object.entries(categoryTotals).map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: Number(((data.amount / (totalCalculatedExpense || 1)) * 100).toFixed(1)),
      color: categoryColors[category] || '#94a3b8',
      transactionCount: data.count,
    }));

    const createKPI = (
      val: number,
      prevVal: number,
      changePct: number,
      formatted: string,
      isExpenseMetric: boolean = false
    ): KPIValue => {
      const isUp = changePct >= 0;
      const isPositive = isExpenseMetric ? !isUp : isUp;
      return {
        value: val,
        previousValue: prevVal,
        changePct: Number(changePct.toFixed(1)),
        formatted,
        trend: isUp ? 'up' : 'down',
        isPositive,
      };
    };

    const response: DashboardResponse = {
      company: {
        name: COMPANY_PROFILE.name,
        tier: COMPANY_PROFILE.tier,
        arr: COMPANY_PROFILE.arr,
        employeeCount: COMPANY_PROFILE.employeeCount,
        currency: 'INR',
        fiscalYearEnd: COMPANY_PROFILE.fiscalYearEnd,
      },
      kpis: {
        totalRevenue: createKPI(
          current.revenue,
          previous.revenue,
          revChange,
          `₹${(current.revenue / 100000).toFixed(2)}L`
        ),
        totalExpenses: createKPI(
          current.expenses,
          previous.expenses,
          expChange,
          `₹${(current.expenses / 100000).toFixed(2)}L`,
          true
        ),
        netCashFlow: createKPI(
          current.netCashFlow,
          previous.netCashFlow,
          netFlowChange,
          `-₹${(Math.abs(current.netCashFlow) / 100000).toFixed(2)}L`
        ),
        cashBalance: createKPI(
          current.cashBalance,
          previous.cashBalance,
          cashChange,
          `₹${(current.cashBalance / 10000000).toFixed(2)} Cr`
        ),
        burnRate: createKPI(
          current.burnRate,
          previous.burnRate,
          burnChange,
          `₹${(current.burnRate / 100000).toFixed(2)}L/mo`,
          true
        ),
        cashRunway: {
          months: current.runwayMonths,
          changeMonths: Number(runwayChange.toFixed(1)),
          formatted: `${current.runwayMonths} mos`,
          status: current.runwayMonths >= 12 ? 'safe' : current.runwayMonths >= 6 ? 'warning' : 'danger',
        },
        healthScore: {
          score: riskAssessment.healthScore,
          rating:
            riskAssessment.healthScore >= 80
              ? 'Excellent'
              : riskAssessment.healthScore >= 60
              ? 'Good'
              : riskAssessment.healthScore >= 40
              ? 'Fair'
              : 'Poor',
          changePct: -3.5,
        },
      },
      aiExecutiveSummary: summaryService.generateExecutiveSummary(),
      revenueVsExpenses: historicals.map((h) => ({
        month: h.label,
        revenue: h.revenue,
        expenses: h.expenses,
        netCashFlow: h.netCashFlow,
      })),
      cashBalanceTrend: historicals.map((h) => ({
        month: h.label,
        balance: h.cashBalance,
        burnRate: h.burnRate,
      })),
      expenseCategoryBreakdown,
      recentTransactions: allTransactions.slice(0, 7),
      activeAnomalies: activeAnomalies.slice(0, 5),
      quickStats: {
        totalTransactionsCount: allTransactions.length,
        anomalyCount: activeAnomalies.length,
        criticalAlertsCount: activeAnomalies.filter((a) => a.riskLevel === 'critical').length,
        pendingInvoicesTotal: 312500,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating dashboard:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard metrics' });
  }
});
