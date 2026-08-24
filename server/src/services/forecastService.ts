import { ForecastPoint, ForecastResponse, MonthlyMetric } from '../types';
import { MONTHLY_HISTORICALS, COMPANY_PROFILE } from '../data/mockFinancials';

export class ForecastService {
  private historicals: MonthlyMetric[] = [...MONTHLY_HISTORICALS];

  public getForecast(horizonMonths: number = 3): ForecastResponse {
    const historical = this.historicals;
    const lastHistorical = historical[historical.length - 1];

    const n = historical.length;
    let revSumX = 0, revSumY = 0, revSumXY = 0, revSumX2 = 0;
    let expSumX = 0, expSumY = 0, expSumXY = 0, expSumX2 = 0;

    historical.forEach((m, idx) => {
      const x = idx + 1;
      revSumX += x;
      revSumY += m.revenue;
      revSumXY += x * m.revenue;
      revSumX2 += x * x;

      expSumX += x;
      expSumY += m.expenses;
      expSumXY += x * m.expenses;
      expSumX2 += x * x;
    });

    const revSlope = (n * revSumXY - revSumX * revSumY) / (n * revSumX2 - revSumX * revSumX);
    const revIntercept = (revSumY - revSlope * revSumX) / n;

    const expSlope = (n * expSumXY - expSumX * expSumY) / (n * expSumX2 - expSumX * expSumX);
    const expIntercept = (expSumY - expSlope * expSumX) / n;

    const forecast: ForecastPoint[] = [];
    let currentBalance = lastHistorical.cashBalance;
    const monthNames = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const startYear = 2026;
    let startMonthIdx = 2;

    for (let i = 1; i <= horizonMonths; i++) {
      const step = n + i;
      const rawRevenue = Math.round(revIntercept + revSlope * step);
      const rawExpenses = Math.round(expIntercept + expSlope * step);

      const predictedRevenue = Math.max(1200000, rawRevenue);
      const predictedExpenses = Math.max(2600000, rawExpenses);
      const predictedNetCashFlow = predictedRevenue - predictedExpenses;
      currentBalance += predictedNetCashFlow;

      const mIdx = (startMonthIdx + i - 1) % 12;
      const yr = startYear + Math.floor((startMonthIdx + i - 1) / 12);
      const monthLabel = `${monthNames[mIdx]} '${String(yr).slice(2)}`;
      const monthKey = `${yr}-${String(mIdx + 1).padStart(2, '0')}`;

      const varianceFactor = 0.04 + i * 0.035;
      const confidenceUpper = Math.round(currentBalance * (1 + varianceFactor));
      const confidenceLower = Math.max(0, Math.round(currentBalance * (1 - varianceFactor)));

      forecast.push({
        month: monthKey,
        label: monthLabel,
        predictedRevenue,
        predictedExpenses,
        predictedNetCashFlow,
        projectedCashBalance: currentBalance,
        confidenceUpper,
        confidenceLower,
        isForecast: true,
      });
    }

    const currentBurn = Math.abs(lastHistorical.netCashFlow);
    const runwayMonthsCurrent = Number((lastHistorical.cashBalance / currentBurn).toFixed(1));

    const avgForecastBurn =
      forecast.reduce((acc, f) => acc + Math.abs(f.predictedNetCashFlow), 0) / forecast.length;
    const projectedRunwayMonths = Number((lastHistorical.cashBalance / avgForecastBurn).toFixed(1));

    const safetyThreshold = 4000000; // ₹40 Lakhs minimum safety reserve
    const monthsUntilBreach = (lastHistorical.cashBalance - safetyThreshold) / avgForecastBurn;
    const depletionDate = new Date();
    depletionDate.setMonth(depletionDate.getMonth() + Math.round(monthsUntilBreach));
    const depletionDateFormatted = depletionDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    const aiExplanation = `Based on historical 6-month spending trajectory and current monthly burn of ₹${(
      currentBurn / 100000
    ).toFixed(2)}L, cash reserves are projected to contract from ₹${(
      lastHistorical.cashBalance / 10000000
    ).toFixed(2)} Cr to ₹${(forecast[forecast.length - 1].projectedCashBalance / 10000000).toFixed(
      2
    )} Cr over the next ${horizonMonths} months. At the predicted burn rate, liquidity will approach the corporate safety threshold (₹40.0L) by approximately ${depletionDateFormatted} (in ~${monthsUntilBreach.toFixed(
      1
    )} months). Corrective containment on cloud overages and marketing spend is recommended to safeguard runway beyond Q3.`;

    const combinedSeries = [
      ...historical.map((h) => ({
        month: h.month,
        label: h.label,
        actualRevenue: h.revenue,
        actualExpenses: h.expenses,
        actualNetCashFlow: h.netCashFlow,
        actualCashBalance: h.cashBalance,
        isForecast: false,
      })),
      ...forecast.map((f) => ({
        month: f.month,
        label: f.label,
        predictedRevenue: f.predictedRevenue,
        predictedExpenses: f.predictedExpenses,
        predictedNetCashFlow: f.predictedNetCashFlow,
        projectedCashBalance: f.projectedCashBalance,
        confidenceUpper: f.confidenceUpper,
        confidenceLower: f.confidenceLower,
        isForecast: true,
      })),
    ];

    return {
      historical,
      forecast,
      combinedSeries,
      aiExplanation,
      runwayMonthsCurrent,
      projectedRunwayMonths,
      safetyThreshold,
      projectedDepletionDate: depletionDateFormatted,
    };
  }
}

export const forecastService = new ForecastService();
