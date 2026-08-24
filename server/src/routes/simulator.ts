import { Router, Request, Response } from 'express';
import { scenarioService } from '../services/scenarioService';
import { ScenarioInput } from '../types';

export const simulatorRouter = Router();

simulatorRouter.post('/calculate', (req: Request, res: Response) => {
  try {
    const input: ScenarioInput = {
      revenueGrowthPct: Number(req.body.revenueGrowthPct || 0),
      expenseGrowthPct: Number(req.body.expenseGrowthPct || 0),
      marketingSpendDelta: Number(req.body.marketingSpendDelta || 0),
      newHiresCount: Number(req.body.newHiresCount || 0),
      avgHireSalary: Number(req.body.avgHireSalary || 120000),
    };

    const result = scenarioService.simulateScenario(input);
    res.json(result);
  } catch (error) {
    console.error('Error calculating scenario:', error);
    res.status(500).json({ error: 'Failed to calculate scenario simulation' });
  }
});
