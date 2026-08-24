import { Router, Request, Response } from 'express';
import { anomalyService } from '../services/anomalyService';
import { RiskLevel, TransactionStatus, TransactionType } from '../types';

export const transactionsRouter = Router();

transactionsRouter.get('/', (req: Request, res: Response) => {
  try {
    let transactions = anomalyService.getAllTransactions();

    const {
      search,
      category,
      department,
      riskLevel,
      status,
      type,
      sortField = 'date',
      sortDirection = 'desc',
      page = '1',
      limit = '15',
    } = req.query;

    // Filter by search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      transactions = transactions.filter(
        (tx) =>
          tx.merchant.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.department.toLowerCase().includes(q) ||
          tx.notes?.toLowerCase().includes(q) ||
          tx.id.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category && typeof category === 'string' && category !== 'all') {
      transactions = transactions.filter(
        (tx) => tx.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by department
    if (department && typeof department === 'string' && department !== 'all') {
      transactions = transactions.filter(
        (tx) => tx.department.toLowerCase() === department.toLowerCase()
      );
    }

    // Filter by riskLevel
    if (riskLevel && typeof riskLevel === 'string' && riskLevel !== 'all') {
      transactions = transactions.filter((tx) => tx.riskLevel === riskLevel);
    }

    // Filter by status
    if (status && typeof status === 'string' && status !== 'all') {
      transactions = transactions.filter((tx) => tx.status === status);
    }

    // Filter by type
    if (type && typeof type === 'string' && type !== 'all') {
      transactions = transactions.filter((tx) => tx.type === type);
    }

    // Sort
    const isAsc = sortDirection === 'asc';
    transactions.sort((a, b) => {
      if (sortField === 'amount') {
        return isAsc ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'merchant') {
        return isAsc ? a.merchant.localeCompare(b.merchant) : b.merchant.localeCompare(a.merchant);
      }
      if (sortField === 'riskLevel') {
        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return isAsc
          ? riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
          : riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      }
      // default sort by date
      return isAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 15;
    const totalCount = transactions.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const paginated = transactions.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      data: paginated,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

transactionsRouter.get('/anomalies', (req: Request, res: Response) => {
  try {
    const anomalies = anomalyService.getAnomalies();
    res.json({
      count: anomalies.length,
      anomalies,
    });
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    res.status(500).json({ error: 'Failed to retrieve anomalies' });
  }
});

transactionsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const tx = anomalyService.getTransactionById(req.params.id);
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transaction' });
  }
});

transactionsRouter.post('/', (req: Request, res: Response) => {
  try {
    const { merchant, category, department, amount, type, isRecurring, paymentMethod, notes } =
      req.body;

    if (!merchant || !category || !amount || !type) {
      return res.status(400).json({ error: 'Missing required transaction fields' });
    }

    const today = new Date().toISOString().split('T')[0];
    const newTx = anomalyService.addTransaction({
      date: today,
      merchant,
      category,
      department: department || 'Operations',
      amount: Number(amount),
      type: type as TransactionType,
      status: 'cleared',
      isRecurring: Boolean(isRecurring),
      paymentMethod: paymentMethod || 'Corporate Brex Card',
      notes,
    });

    res.status(201).json(newTx);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

transactionsRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status, riskLevel } = req.body;
    const updated = anomalyService.updateTransactionStatus(
      req.params.id,
      status as TransactionStatus,
      riskLevel as RiskLevel
    );

    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update transaction status' });
  }
});
