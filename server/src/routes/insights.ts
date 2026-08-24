import { Router, Request, Response } from 'express';
import { AI_INSIGHTS } from '../data/mockFinancials';

export const insightsRouter = Router();
let insights = [...AI_INSIGHTS];

insightsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { priority, status = 'all' } = req.query;
    let filtered = [...insights];

    if (priority && priority !== 'all') {
      filtered = filtered.filter((i) => i.priority === priority);
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((i) => i.status === status);
    }

    const priorityCounts = {
      critical: insights.filter((i) => i.priority === 'critical' && i.status === 'active').length,
      high: insights.filter((i) => i.priority === 'high' && i.status === 'active').length,
      medium: insights.filter((i) => i.priority === 'medium' && i.status === 'active').length,
      low: insights.filter((i) => i.priority === 'low' && i.status === 'active').length,
    };

    const totalPotentialSavings = insights
      .filter((i) => i.status === 'active' && i.potentialSavings)
      .reduce((sum, i) => sum + (i.potentialSavings || 0), 0);

    res.json({
      data: filtered,
      priorityCounts,
      totalPotentialSavings,
      totalActiveInsights: insights.filter((i) => i.status === 'active').length,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to retrieve insights' });
  }
});

insightsRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const idx = insights.findIndex((i) => i.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Insight not found' });
    }

    insights[idx].status = status;
    res.json(insights[idx]);
  } catch (error) {
    console.error('Error updating insight status:', error);
    res.status(500).json({ error: 'Failed to update insight status' });
  }
});
