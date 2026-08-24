import { Transaction, RiskLevel } from '../types';
import { INITIAL_TRANSACTIONS } from '../data/mockFinancials';

interface CategoryBenchmark {
  mean: number;
  stdDev: number;
  q1: number;
  q3: number;
  iqr: number;
  count: number;
}

export class AnomalyService {
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  private categoryBenchmarks: Map<string, CategoryBenchmark> = new Map();

  constructor() {
    this.calculateBenchmarks();
  }

  public getAllTransactions(): Transaction[] {
    return this.transactions;
  }

  public getTransactionById(id: string): Transaction | undefined {
    return this.transactions.find((tx) => tx.id === id);
  }

  public getAnomalies(): Transaction[] {
    return this.transactions.filter(
      (tx) => tx.riskLevel === 'high' || tx.riskLevel === 'critical' || tx.status === 'flagged'
    );
  }

  public addTransaction(newTx: Omit<Transaction, 'id' | 'riskLevel' | 'anomalyScore'>): Transaction {
    const id = `tx-${String(this.transactions.length + 1).padStart(3, '0')}`;
    const analyzed = this.analyzeTransaction({ ...newTx, id, riskLevel: 'low' });
    this.transactions.unshift(analyzed);
    this.calculateBenchmarks();
    return analyzed;
  }

  public updateTransactionStatus(
    id: string,
    status: Transaction['status'],
    riskLevel?: RiskLevel
  ): Transaction | null {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.transactions[index].status = status;
    if (riskLevel) {
      this.transactions[index].riskLevel = riskLevel;
    }
    return this.transactions[index];
  }

  /**
   * Statistical & Rule-Based Multi-Dimensional Anomaly Detection (in Rupees ₹)
   */
  public analyzeTransaction(tx: Transaction): Transaction {
    if (tx.type === 'revenue') {
      return {
        ...tx,
        riskLevel: 'low',
        anomalyScore: 0.05,
      };
    }

    const benchmark = this.categoryBenchmarks.get(tx.category) || {
      mean: 50000,
      stdDev: 25000,
      q1: 20000,
      q3: 80000,
      iqr: 60000,
      count: 10,
    };

    const zScore = benchmark.stdDev > 0 ? (tx.amount - benchmark.mean) / benchmark.stdDev : 0;
    const iqrUpper = benchmark.q3 + 1.5 * benchmark.iqr;
    const isIQROutlier = tx.amount > iqrUpper;

    let riskLevel: RiskLevel = 'low';
    let anomalyScore = 0.1;
    let anomalyReason: string | undefined = undefined;

    // Rule 1: High AWS / Cloud Compute Anomaly
    if (tx.category === 'Cloud Infrastructure' && tx.amount > benchmark.mean * 2.2) {
      riskLevel = 'critical';
      anomalyScore = 0.96;
      anomalyReason = `Cloud spending is ${(tx.amount / benchmark.mean).toFixed(1)}x higher than monthly baseline (₹${benchmark.mean.toLocaleString('en-IN')}). Abnormal RDS/Compute scale detected.`;
    }
    // Rule 2: Unrecognized Vendor or Offshore Entity
    else if (
      tx.merchant.toLowerCase().includes('logistics') ||
      tx.merchant.toLowerCase().includes('unverified') ||
      (tx.amount > 100000 && !tx.isRecurring && (tx.paymentMethod.includes('Wire') || tx.paymentMethod.includes('RTGS')))
    ) {
      riskLevel = 'critical';
      anomalyScore = 0.94;
      anomalyReason =
        'High-value non-recurring wire transfer to an unverified vendor without matching PO or GSTIN record.';
    }
    // Rule 3: Marketing Ad Spend Spikes
    else if (tx.category === 'Marketing' && (zScore > 2.2 || isIQROutlier)) {
      riskLevel = 'high';
      anomalyScore = Math.min(0.92, 0.5 + zScore * 0.15);
      anomalyReason = `Ad spend velocity is ${(tx.amount / benchmark.mean).toFixed(1)}x typical campaign bounds. CAC deviation alert.`;
    }
    // Rule 4: Duplicate Travel & Flight Billing
    else if (tx.category === 'Travel & Entertainment' && tx.amount > 30000) {
      riskLevel = 'high';
      anomalyScore = 0.82;
      anomalyReason = 'Out-of-policy corporate travel expense with potential duplicate billing flag.';
    }
    // Rule 5: Software & SaaS Subscription Sprawl
    else if (tx.category === 'Software & Subscriptions' && tx.amount > 80000 && !tx.isRecurring) {
      riskLevel = 'high';
      anomalyScore = 0.84;
      anomalyReason = 'High-value annual SaaS license purchased outside standard procurement cycle.';
    }
    // Rule 6: General Statistical Z-Score Thresholds
    else if (zScore >= 3.0) {
      riskLevel = 'critical';
      anomalyScore = Math.min(0.99, 0.7 + zScore * 0.08);
      anomalyReason = `Extreme statistical outlier: transaction amount is ${zScore.toFixed(1)} standard deviations from category mean.`;
    } else if (zScore >= 2.0 || isIQROutlier) {
      riskLevel = 'medium';
      anomalyScore = 0.65;
      anomalyReason = `Spend exceeds 75th percentile upper threshold (₹${iqrUpper.toLocaleString('en-IN')}).`;
    }

    const minExpected = Math.max(1000, Math.round(benchmark.mean - benchmark.stdDev));
    const maxExpected = Math.round(benchmark.mean + benchmark.stdDev * 1.5);

    return {
      ...tx,
      riskLevel,
      anomalyScore: Number(anomalyScore.toFixed(2)),
      anomalyReason: anomalyReason || tx.anomalyReason,
      expectedRange: {
        min: minExpected,
        max: maxExpected,
        benchmarkMean: Math.round(benchmark.mean),
      },
      status: riskLevel === 'critical' || riskLevel === 'high' ? 'flagged' : tx.status,
    };
  }

  private calculateBenchmarks(): void {
    const expensesByCategory: Record<string, number[]> = {};

    this.transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        if (!expensesByCategory[tx.category]) {
          expensesByCategory[tx.category] = [];
        }
        expensesByCategory[tx.category].push(tx.amount);
      }
    });

    Object.entries(expensesByCategory).forEach(([category, amounts]) => {
      if (amounts.length === 0) return;

      const sorted = [...amounts].sort((a, b) => a - b);
      const sum = sorted.reduce((acc, val) => acc + val, 0);
      const mean = sum / sorted.length;

      const variance =
        sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
      const stdDev = Math.sqrt(variance);

      const q1Index = Math.floor(sorted.length * 0.25);
      const q3Index = Math.floor(sorted.length * 0.75);
      const q1 = sorted[q1Index] || sorted[0];
      const q3 = sorted[q3Index] || sorted[sorted.length - 1];
      const iqr = q3 - q1;

      this.categoryBenchmarks.set(category, {
        mean,
        stdDev,
        q1,
        q3,
        iqr,
        count: sorted.length,
      });
    });
  }
}

export const anomalyService = new AnomalyService();
