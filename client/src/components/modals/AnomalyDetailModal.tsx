import React from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Layers,
  DollarSign,
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

  const isAnomalous =
    transaction.riskLevel === 'critical' ||
    transaction.riskLevel === 'high' ||
    transaction.status === 'flagged';

  const riskColors = {
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-[#22314e] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#1f293d] flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#121c33]">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl border ${
                transaction.riskLevel === 'critical'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Anomaly Investigation & Diagnostic
                </h2>
                <span
                  className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    riskColors[transaction.riskLevel]
                  }`}
                >
                  {transaction.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs text-slate-400">Transaction ID: {transaction.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Transaction Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141d30] border border-[#1f2d47]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Merchant</span>
              <p className="text-sm font-bold text-white mt-1 truncate">{transaction.merchant}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141d30] border border-[#1f2d47]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Amount</span>
              <p className="text-sm font-bold text-rose-400 mt-1">
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141d30] border border-[#1f2d47]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Category</span>
              <p className="text-sm font-bold text-slate-200 mt-1 truncate">
                {transaction.category}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141d30] border border-[#1f2d47]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Date</span>
              <p className="text-sm font-bold text-slate-200 mt-1">{transaction.date}</p>
            </div>
          </div>

          {/* AI Diagnostic Reasoning Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold text-brand-300">
                AI Detection Engine Explanation
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {transaction.anomalyReason ||
                'Spend deviation exceeds 2.5 standard deviations from the 90-day moving average. Statistical pattern matches abnormal billing spikes.'}
            </p>
          </div>

          {/* Expected vs Actual Comparison Corridor */}
          {transaction.expectedRange && (
            <div className="p-4 rounded-xl bg-[#131b2e] border border-[#1f2d47] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">
                  Statistical Corridor vs Actual Spend
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Baseline Mean: {formatCurrency(transaction.expectedRange.benchmarkMean)}
                </span>
              </div>

              {/* Progress Comparison Visual */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Expected: {formatCurrency(transaction.expectedRange.min)}</span>
                  <span>Cap: {formatCurrency(transaction.expectedRange.max)}</span>
                  <span className="text-rose-400 font-bold">
                    Actual: {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
                  <div
                    style={{ width: '45%' }}
                    className="bg-emerald-500/40 h-full rounded-l-full"
                    title="Normal expected range"
                  />
                  <div
                    style={{ width: '55%' }}
                    className="bg-rose-500 h-full rounded-r-full animate-pulse"
                    title="Anomalous excess spend"
                  />
                </div>
              </div>
              <p className="text-[11px] text-rose-300/90 font-medium">
                ⚠️ Outflow is{' '}
                {(transaction.amount / (transaction.expectedRange.benchmarkMean || 1)).toFixed(1)}x
                above typical vendor baseline.
              </p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Department:</span>
              <span className="ml-2 font-semibold text-slate-200">{transaction.department}</span>
            </div>
            <div>
              <span className="text-slate-400">Payment Method:</span>
              <span className="ml-2 font-semibold text-slate-200">
                {transaction.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Billing Type:</span>
              <span className="ml-2 font-semibold text-slate-200">
                {transaction.isRecurring ? 'Recurring Subscription' : 'One-Time Outflow'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Anomaly Score:</span>
              <span className="ml-2 font-bold text-rose-400 font-mono">
                {transaction.anomalyScore ?? 0.88} / 1.00
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-[#1f293d] bg-[#0c121e] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleHold}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Place Payment on Hold</span>
            </button>

            <button
              onClick={handleResolve}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-glowEmerald"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Clear Transaction</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
