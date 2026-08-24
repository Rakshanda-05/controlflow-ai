import { FinancialRiskAssessment, RiskFactor, RiskLevel } from '../types';
import { MONTHLY_HISTORICALS, DEPARTMENT_BUDGETS, FINANCIAL_RISK_DATA } from '../data/mockFinancials';
import { anomalyService } from './anomalyService';

export class RiskService {
  public getRiskAssessment(): FinancialRiskAssessment {
    const historicals = MONTHLY_HISTORICALS;
    const lastMonth = historicals[historicals.length - 1];
    const prevMonth = historicals[historicals.length - 2];
    const activeAnomalies = anomalyService.getAnomalies();
    const budgets = DEPARTMENT_BUDGETS;

    const runway = lastMonth.runwayMonths;
    let cashFlowRisk = 0;
    if (runway >= 12) {
      cashFlowRisk = Math.max(10, Math.round(30 - (runway - 12) * 2));
    } else if (runway >= 9) {
      cashFlowRisk = Math.round(40 + (12 - runway) * 10);
    } else if (runway >= 6) {
      cashFlowRisk = Math.round(70 + (9 - runway) * 6.5);
    } else {
      cashFlowRisk = Math.min(100, Math.round(90 + (6 - runway) * 5));
    }

    const expenseGrowthPct = ((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100;
    let spendingRisk = 40;
    if (expenseGrowthPct > 15) {
      spendingRisk = Math.min(95, Math.round(65 + expenseGrowthPct * 0.8));
    } else if (expenseGrowthPct > 5) {
      spendingRisk = Math.round(45 + expenseGrowthPct * 1.5);
    } else {
      spendingRisk = Math.max(20, Math.round(35 + expenseGrowthPct));
    }

    const overBudgetCount = budgets.filter((b) => b.status === 'over_budget').length;
    const approachingLimitCount = budgets.filter((b) => b.status === 'approaching_limit').length;
    let budgetRisk = Math.min(
      95,
      Math.round(25 + overBudgetCount * 25 + approachingLimitCount * 12)
    );

    const criticalAnomalies = activeAnomalies.filter((a) => a.riskLevel === 'critical').length;
    const highAnomalies = activeAnomalies.filter((a) => a.riskLevel === 'high').length;
    let anomalyRisk = Math.min(
      95,
      Math.round(20 + criticalAnomalies * 22 + highAnomalies * 10)
    );

    const overallScore = Math.round(
      cashFlowRisk * 0.35 + spendingRisk * 0.25 + budgetRisk * 0.2 + anomalyRisk * 0.2
    );

    let riskLevel: 'low' | 'moderate' | 'elevated' | 'critical' = 'moderate';
    if (overallScore >= 80) riskLevel = 'critical';
    else if (overallScore >= 65) riskLevel = 'elevated';
    else if (overallScore >= 40) riskLevel = 'moderate';
    else riskLevel = 'low';

    const healthScore = Math.max(15, Math.min(98, 100 - Math.round(overallScore * 0.55)));
    let healthStatus: 'Optimal' | 'Stable' | 'At Risk' | 'Critical' = 'Stable';
    if (healthScore >= 80) healthStatus = 'Optimal';
    else if (healthScore >= 60) healthStatus = 'Stable';
    else if (healthScore >= 40) healthStatus = 'At Risk';
    else healthStatus = 'Critical';

    const topContributingFactors: RiskFactor[] = [
      {
        factor: 'Cloud Infrastructure Overspend (+178% surge)',
        impact: `Drains an excess ₹1,48,000/mo above budgeted AWS baseline`,
        severity: 'critical',
        recommendation:
          'Audit AWS RDS query indexes and spin down 14 idle compute instances immediately.',
        pillar: 'spending',
      },
      {
        factor: 'Compressed Cash Runway (7.2 Months)',
        impact: `Cash balance of ₹1.25 Cr will breach safety reserves in ~4.5 months without intervention`,
        severity: 'high',
        recommendation:
          'Execute proactive ₹3.0L/mo expense containment to extend runway back to 9.2+ months.',
        pillar: 'cashflow',
      },
      {
        factor: 'Marketing Budget Burn Rate Acceleration',
        impact: `Marketing department utilized 92% of monthly budget with 26% of period remaining`,
        severity: 'high',
        recommendation:
          'Pause underperforming Meta Ads lookalike audiences to stabilize blended CAC at ₹10,300.',
        pillar: 'budget',
      },
      {
        factor: 'Unverified Overseas Wire & Duplicate Charges',
        impact: `₹1,62,500 in pending high-risk flagged transactions requiring compliance review`,
        severity: 'medium',
        recommendation:
          'Maintain compliance hold on Apex Global Logistics wire until GSTIN / tax verification is completed.',
        pillar: 'anomaly',
      },
    ];

    const aiRiskSummary = `Apex Technologies exhibits an ${riskLevel.toUpperCase()} composite financial risk score of ${overallScore}/100. Primary vulnerability stems from the recent 18% expansion in monthly operating expenses (₹31.09L), driven by AWS compute overages and accelerated paid acquisition spend. Current cash runway stands at ${runway} months, which sits below the recommended 12-month enterprise liquidity corridor. Resolving flagged anomalies and reigning in department overruns will recover up to 2.2 months of runway buffer.`;

    return {
      overallScore,
      riskLevel,
      healthScore,
      healthStatus,
      pillars: {
        cashFlowRisk,
        spendingRisk,
        budgetRisk,
        anomalyRisk,
      },
      topContributingFactors,
      stressTestScenarios: FINANCIAL_RISK_DATA.stressTestScenarios,
      aiRiskSummary,
    };
  }
}

export const riskService = new RiskService();
