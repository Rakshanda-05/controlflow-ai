import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { dashboardRouter } from './routes/dashboard';
import { transactionsRouter } from './routes/transactions';
import { cashflowRouter } from './routes/cashflow';
import { budgetsRouter } from './routes/budgets';
import { insightsRouter } from './routes/insights';
import { risksRouter } from './routes/risks';
import { assistantRouter } from './routes/assistant';
import { simulatorRouter } from './routes/simulator';
import { exportRouter } from './routes/export';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount Core Fintech API Routes
app.use('/api/dashboard', dashboardRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/anomalies', (req, res, next) => {
  req.url = '/anomalies';
  transactionsRouter(req, res, next);
});
app.use('/api/cashflow', cashflowRouter);
app.use('/api/forecast', cashflowRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/risks', risksRouter);
app.use('/api/assistant', assistantRouter);
app.use('/api/simulator', simulatorRouter);
app.use('/api/export', exportRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'ControlFlow AI — Intelligent Finance Controller',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Production Client Static Serving (Check multiple candidate locations)
const candidatePaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
];
const clientDist = candidatePaths.find((p) => fs.existsSync(p));

if (clientDist) {
  console.log(`[Static] Serving frontend bundle from: ${clientDist}`);
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ControlFlow AI — Intelligent Finance Controller`);
  console.log(`📡 Server listening on http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  if (clientDist) {
    console.log(`💻 Web Application: http://localhost:${PORT}`);
  }
  console.log(`======================================================\n`);
});
