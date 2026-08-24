import { MONTHLY_HISTORICALS, DEPARTMENT_BUDGETS } from '../data/mockFinancials';
import { anomalyService } from './anomalyService';

export class SummaryService {
  public generateExecutiveSummary(): string {
    const historicals = MONTHLY_HISTORICALS;
    const current = historicals[historicals.length - 1];
    const previous = historicals[historicals.length - 2];

    const revGrowth = Number((((current.revenue - previous.revenue) / previous.revenue) * 100).toFixed(1));
    const expGrowth = Number((((current.expenses - previous.expenses) / previous.expenses) * 100).toFixed(1));
    const runway = current.runwayMonths;
    const activeAnomalies = anomalyService.getAnomalies();
    const overBudgetDepts = DEPARTMENT_BUDGETS.filter((b) => b.status === 'over_budget');

    let healthAssessment = 'Financial health is stable';
    if (runway < 6 || activeAnomalies.length > 5) {
      healthAssessment = 'Financial health is in an elevated risk zone';
    } else if (runway < 9) {
      healthAssessment = 'Financial health is stable but requires operational discipline';
    }

    const expDirection = expGrowth >= 0 ? `increased ${expGrowth}%` : `decreased ${Math.abs(expGrowth)}%`;
    const revDirection = revGrowth >= 0 ? `revenue grew ${revGrowth}%` : `revenue contracted ${Math.abs(revGrowth)}%`;

    let primaryDriver = 'Marketing acquisition spend and AWS infrastructure spikes appear to be the primary contributors.';
    if (overBudgetDepts.length > 0) {
      const deptNames = overBudgetDepts.map((d) => d.department).join(', ');
      primaryDriver = `${deptNames} exceeded monthly budget limits, primarily driven by AWS compute scaling (₹2.84L) and paid campaign volume.`;
    }

    return `${healthAssessment}. Operating expenses ${expDirection} this month to ₹${(current.expenses / 100000).toFixed(2)}L, while ${revDirection} to ₹${(current.revenue / 100000).toFixed(2)}L. At the current monthly burn rate of ₹${(current.burnRate / 100000).toFixed(2)}L, projected cash runway is approximately ${runway} months (₹${(current.cashBalance / 10000000).toFixed(2)} Cr reserve). ${primaryDriver}`;
  }
}

export const summaryService = new SummaryService();
