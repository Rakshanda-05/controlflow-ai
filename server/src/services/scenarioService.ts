import { ScenarioInput, ScenarioResult } from '../types';
import { MONTHLY_HISTORICALS, COMPANY_PROFILE } from '../data/mockFinancials';

export class ScenarioService {
  public simulateScenario(input: ScenarioInput): ScenarioResult {
    const historicals = MONTHLY_HISTORICALS;
    const current = historicals[historicals.length - 1];

    const baselineRevenue = current.revenue;
    const baselineExpenses = current.expenses;
    const baselineNetCashFlow = current.netCashFlow;
    const baselineBurn = Math.abs(baselineNetCashFlow);
    const currentCashBalance = current.cashBalance;
    const baselineRunwayMonths = Number((currentCashBalance / baselineBurn).toFixed(1));
    const baselineRiskScore = 68;

    const revMultiplier = 1 + (input.revenueGrowthPct || 0) / 100;
    const expMultiplier = 1 + (input.expenseGrowthPct || 0) / 100;

    const simulatedRevenue = Math.max(0, Math.round(baselineRevenue * revMultiplier));

    // Annual salary default in INR: ₹12,00,000 (12L) + 15% overhead
    const annualSalary = input.avgHireSalary || 1200000;
    const monthlyHireOverhead = (input.newHiresCount || 0) * (annualSalary / 12) * 1.15;
    const marketingDelta = input.marketingSpendDelta || 0;

    const adjustedBaseExpenses = baselineExpenses * expMultiplier;
    const simulatedExpenses = Math.max(
      200000,
      Math.round(adjustedBaseExpenses + marketingDelta + monthlyHireOverhead)
    );

    const simulatedNetCashFlow = simulatedRevenue - simulatedExpenses;
    const simulatedBurn = simulatedNetCashFlow < 0 ? Math.abs(simulatedNetCashFlow) : 0;

    const simulatedRunwayMonths =
      simulatedBurn > 0
        ? Number((currentCashBalance / simulatedBurn).toFixed(1))
        : 99.9;

    const runwayDeltaMonths = Number((simulatedRunwayMonths - baselineRunwayMonths).toFixed(1));
    const monthlyBurnDelta = simulatedBurn - baselineBurn;

    const timelineProjection = [];
    let baseBal = currentCashBalance;
    let simBal = currentCashBalance;
    const monthNames = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

    for (let m = 1; m <= 6; m++) {
      baseBal += baselineNetCashFlow;
      simBal += simulatedNetCashFlow;
      timelineProjection.push({
        monthNumber: m,
        label: `${monthNames[m - 1]} '26`,
        baselineBalance: Math.max(0, Math.round(baseBal)),
        simulatedBalance: Math.max(0, Math.round(simBal)),
      });
    }

    const projectedCashAfter6MonthsDelta = simBal - baseBal;

    let simRiskScore = baselineRiskScore;
    if (simulatedRunwayMonths < 4) {
      simRiskScore = Math.min(98, baselineRiskScore + 25);
    } else if (simulatedRunwayMonths < 6) {
      simRiskScore = Math.min(90, baselineRiskScore + 15);
    } else if (simulatedRunwayMonths > 14 || simulatedNetCashFlow >= 0) {
      simRiskScore = Math.max(15, baselineRiskScore - 35);
    } else if (simulatedRunwayMonths > 10) {
      simRiskScore = Math.max(25, baselineRiskScore - 20);
    } else {
      const burnRatio = simulatedBurn / (baselineBurn || 1);
      simRiskScore = Math.min(95, Math.max(20, Math.round(baselineRiskScore * burnRatio)));
    }

    let verdict: 'High Risk' | 'Moderate Risk' | 'Sustainable' | 'Accretive Growth' = 'Moderate Risk';
    if (simulatedNetCashFlow >= 0 || (simulatedRunwayMonths >= 12 && simulatedRevenue > baselineRevenue)) {
      verdict = 'Accretive Growth';
    } else if (simulatedRunwayMonths >= 9) {
      verdict = 'Sustainable';
    } else if (simulatedRunwayMonths >= 5) {
      verdict = 'Moderate Risk';
    } else {
      verdict = 'High Risk';
    }

    let aiAnalysis = '';
    if (simulatedNetCashFlow >= 0) {
      aiAnalysis = `Under this scenario, the business reaches immediate cash-flow breakeven with a net positive monthly surplus of +₹${(
        simulatedNetCashFlow / 100000
      ).toFixed(2)}L. Cash depletion risk is eliminated, providing indefinite runway and reducing financial risk to ${simRiskScore}/100.`;
    } else if (runwayDeltaMonths > 0) {
      aiAnalysis = `This strategy successfully extends cash runway by +${runwayDeltaMonths} months (from ${baselineRunwayMonths} to ${simulatedRunwayMonths} months). Monthly net burn is reduced by ₹${Math.abs(
        monthlyBurnDelta / 100000
      ).toFixed(2)}L. At month 6, the company retains ₹${(
        simBal / 10000000
      ).toFixed(2)} Cr in cash reserves (+₹${(Math.abs(projectedCashAfter6MonthsDelta) / 100000).toFixed(
        2
      )}L better than baseline).`;
    } else if (runwayDeltaMonths < 0) {
      aiAnalysis = `Caution: This scenario accelerates cash burn by +₹${(
        monthlyBurnDelta / 100000
      ).toFixed(2)}L/month, contracting runway from ${baselineRunwayMonths} months down to ${simulatedRunwayMonths} months. At this trajectory, cash reserves will dip below safety threshold in ${Math.max(
        1,
        Math.round((currentCashBalance - 4000000) / simulatedBurn)
      )} months. Additional revenue conversion is required to fund this expansion.`;
    } else {
      aiAnalysis = `Financial variables remain aligned with the baseline plan. Monthly burn rate is ₹${(
        simulatedBurn / 100000
      ).toFixed(2)}L with ${simulatedRunwayMonths} months of operational runway.`;
    }

    return {
      inputs: input,
      baseline: {
        monthlyRevenue: baselineRevenue,
        monthlyExpenses: baselineExpenses,
        netCashFlow: baselineNetCashFlow,
        cashRunwayMonths: baselineRunwayMonths,
        cashDepletionMonths: baselineRunwayMonths,
        riskScore: baselineRiskScore,
      },
      simulated: {
        monthlyRevenue: simulatedRevenue,
        monthlyExpenses: simulatedExpenses,
        netCashFlow: simulatedNetCashFlow,
        cashRunwayMonths: simulatedRunwayMonths,
        cashDepletionMonths: simulatedRunwayMonths,
        riskScore: simRiskScore,
      },
      impact: {
        runwayDeltaMonths,
        monthlyBurnDelta,
        projectedCashAfter6MonthsDelta,
        riskScoreDelta: simRiskScore - baselineRiskScore,
        verdict,
      },
      aiAnalysis,
      timelineProjection,
    };
  }
}

export const scenarioService = new ScenarioService();
