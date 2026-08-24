import { Router, Request, Response } from 'express';
import { assistantService } from '../services/assistantService';

export const assistantRouter = Router();

assistantRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const response = await assistantService.handleQuery(message);
    res.json(response);
  } catch (error) {
    console.error('Error in AI Assistant:', error);
    res.status(500).json({ error: 'AI Assistant processing failed' });
  }
});
