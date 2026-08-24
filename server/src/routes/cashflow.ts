import { Router, Request, Response } from 'express';
import { forecastService } from '../services/forecastService';

export const cashflowRouter = Router();

cashflowRouter.get('/', (req: Request, res: Response) => {
  try {
    const horizon = parseInt(req.query.horizon as string, 10) || 3;
    const forecastData = forecastService.getForecast(horizon);
    res.json(forecastData);
  } catch (error) {
    console.error('Error fetching cash flow forecast:', error);
    res.status(500).json({ error: 'Failed to retrieve cash flow forecast' });
  }
});
