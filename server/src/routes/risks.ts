import { Router, Request, Response } from 'express';
import { riskService } from '../services/riskService';

export const risksRouter = Router();

risksRouter.get('/', (req: Request, res: Response) => {
  try {
    const riskAssessment = riskService.getRiskAssessment();
    res.json(riskAssessment);
  } catch (error) {
    console.error('Error fetching risk assessment:', error);
    res.status(500).json({ error: 'Failed to retrieve financial risk metrics' });
  }
});
