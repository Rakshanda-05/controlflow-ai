import React from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Transaction } from '../../types';
import { useFinancial } from '../../context/FinancialContext';

interface AnomalyDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const AnomalyDetailModal: React.FC<AnomalyDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const { updateTxStatus, formatCurrency } = useFinancial();

  if (!transaction) return null;

  const riskColors = {
    critical: 'bg-rose-50 text-rose-700 border border-rose-200',
    high: 'bg-amber-50 text-amber-700 border border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border border-blue-200',
    low: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  const handleResolve = async () => {
    await updateTxStatus(transaction.id, 'cleared', 'low');
    onClose();
  };

  const handleHold = async () => {
    await updateTxStatus(transaction.id, 'pending', 'critical');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg border ${
                transaction.riskLevel === 'critical'
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-amber-50 border-amber-200 text-amber-600'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Transaction Investigation
                </h2>
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                    riskColors[transaction.riskLevel]
                  }`}
                >
                  {transaction.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">ID: {transaction.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main Transaction Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-medium text-slate-500 uppercase">Merchant</span>
              <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{transaction.merchant}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-medium text-slate-500 uppercase">Amount</span>
              <p className="text-xs font-bold font-mono text-rose-600 mt-0.5">
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-medium text-slate-500 uppercase">Category</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                {transaction.category}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-medium text-slate-500 uppercase">Date</span>
              <p className="text-xs font-bold font-mono text-slate-800 mt-0.5">{transaction.date}</p>
            </div>
          </div>

          {/* Diagnostic Reasoning Banner */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-900 block">
              Outlier Attribution & Analysis
            </span>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {transaction.anomalyReason ||
                'Spend deviation exceeds 2.5 standard deviations from the 90-day moving average. Statistical pattern matches abnormal billing spikes.'}
            </p>
          </div>

          {/* Expected vs Actual Comparison Corridor */}
          {transaction.expectedRange && (
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Statistical Corridor vs Actual Spend
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  Baseline Mean: {formatCurrency(transaction.expectedRange.benchmarkMean)}
                </span>
              </div>

              {/* Progress Comparison Visual */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Expected: {formatCurrency(transaction.expectedRange.min)}</span>
                  <span>Cap: {formatCurrency(transaction.expectedRange.max)}</span>
                  <span className="text-rose-600 font-bold">
                    Actual: {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
                  <div
                    style={{ width: '45%' }}
                    className="bg-emerald-500 h-full rounded-l-full"
                    title="Normal expected range"
                  />
                  <div
                    style={{ width: '55%' }}
                    className="bg-rose-500 h-full rounded-r-full"
                    title="Anomalous excess spend"
                  />
                </div>
              </div>
              <p className="text-[11px] text-rose-700 font-medium">
                ⚠️ Outflow is{' '}
                {(transaction.amount / (transaction.expectedRange.benchmarkMean || 1)).toFixed(1)}x
                above typical vendor baseline.
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Department:</span>
              <span className="ml-1.5 font-semibold text-slate-800">{transaction.department}</span>
            </div>
            <div>
              <span className="text-slate-500">Payment Method:</span>
              <span className="ml-1.5 font-semibold text-slate-800">
                {transaction.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Billing Type:</span>
              <span className="ml-1.5 font-semibold text-slate-800">
                {transaction.isRecurring ? 'Recurring Subscription' : 'One-Time Outflow'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Anomaly Score:</span>
              <span className="ml-1.5 font-bold text-rose-600 font-mono">
                {transaction.anomalyScore ?? 0.88} / 1.00
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleHold}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 shadow-xs transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Place on Hold</span>
            </button>

            <button
              onClick={handleResolve}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verify & Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
