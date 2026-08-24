import { Router, Request, Response } from 'express';
import { DEPARTMENT_BUDGETS } from '../data/mockFinancials';

export const budgetsRouter = Router();
let budgets = [...DEPARTMENT_BUDGETS];

budgetsRouter.get('/', (req: Request, res: Response) => {
  try {
    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.actualSpend, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const overallPctUsed = Number(((totalSpent / totalAllocated) * 100).toFixed(1));

    const overBudgetCount = budgets.filter((b) => b.status === 'over_budget').length;
    const approachingCount = budgets.filter((b) => b.status === 'approaching_limit').length;

    res.json({
      departments: budgets,
      summary: {
        totalAllocated,
        totalSpent,
        totalRemaining,
        overallPctUsed,
        overBudgetCount,
        approachingCount,
        monthElapsedPct: 74,
      },
      aiBudgetSummary: `Overall departmental budget utilization stands at ${overallPctUsed}% with 74% of the current month elapsed. Engineering is currently ${Math.abs(
        budgets[0].percentageUsed - 100
      ).toFixed(1)}% over budget due to unbudgeted AWS compute overages ($28.4k). Marketing is approaching its ceiling at 92.0% utilization. Reallocating $15,000 from Operations and HR reserves can temporarily absorb the variance.`,
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to retrieve budgets' });
  }
});

budgetsRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const { allocated } = req.body;
    const idx = budgets.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    const b = budgets[idx];
    const newAllocated = Number(allocated);
    const newPct = Number(((b.actualSpend / newAllocated) * 100).toFixed(1));
    const newRemaining = newAllocated - b.actualSpend;
    let newStatus = b.status;
    if (newPct > 100) newStatus = 'over_budget';
    else if (newPct >= 85) newStatus = 'approaching_limit';
    else newStatus = 'on_track';

    budgets[idx] = {
      ...b,
      allocated: newAllocated,
      remaining: newRemaining,
      percentageUsed: newPct,
      status: newStatus,
    };

    res.json(budgets[idx]);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});
