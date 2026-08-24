import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShieldAlert,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Receipt,
  Download,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { Transaction, RiskLevel, TransactionStatus } from '../types';

export const TransactionsPage: React.FC = () => {
  const { transactions, setSelectedTransaction, formatCurrency } = useFinancial();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'merchant' | 'riskLevel'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          tx.merchant.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          tx.department.toLowerCase().includes(q) ||
          (tx.anomalyReason && tx.anomalyReason.toLowerCase().includes(q)) ||
          tx.id.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Category
      if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
        return false;
      }

      // Risk
      if (selectedRisk !== 'all' && tx.riskLevel !== selectedRisk) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && tx.status !== selectedStatus) {
        return false;
      }

      // Type
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [transactions, searchQuery, selectedCategory, selectedRisk, selectedStatus, selectedType]);

  // Sort
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortField === 'amount') {
        return sortAsc ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'merchant') {
        return sortAsc ? a.merchant.localeCompare(b.merchant) : b.merchant.localeCompare(a.merchant);
      }
      if (sortField === 'riskLevel') {
        const weight = { critical: 4, high: 3, medium: 2, low: 1 };
        return sortAsc
          ? weight[a.riskLevel] - weight[b.riskLevel]
          : weight[b.riskLevel] - weight[a.riskLevel];
      }
      // default date
      return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    });
  }, [filteredTransactions, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / itemsPerPage));
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: 'date' | 'amount' | 'merchant' | 'riskLevel') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const categories = [
    'all',
    'Cloud Infrastructure',
    'Marketing',
    'Software & Subscriptions',
    'Payroll & Benefits',
    'Operations',
    'Executive & Legal',
    'Travel & Entertainment',
    'Office & Hardware',
    'Sales Revenue',
  ];

  const riskBadgeStyles: Record<RiskLevel, string> = {
    critical: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
    high: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
    low: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  };

  const statusBadgeStyles: Record<TransactionStatus, string> = {
    cleared: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    flagged: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  };

  const anomaliesCount = transactions.filter((t) => t.status === 'flagged').length;
  const criticalCount = transactions.filter((t) => t.riskLevel === 'critical').length;
  const flaggedVolume = transactions
    .filter((t) => t.status === 'flagged')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Anomaly Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-card flex items-center gap-3.5 border-rose-500/20 bg-rose-950/10">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Critical Outliers Detected</span>
            <p className="text-xl font-bold text-rose-400 tracking-tight">{criticalCount} Urgent Items</p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card flex items-center gap-3.5 border-amber-500/20 bg-amber-950/10">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Flagged Volume</span>
            <p className="text-xl font-bold text-amber-400 tracking-tight">{formatCurrency(flaggedVolume, true)}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass-card flex items-center gap-3.5 border-brand-500/20 bg-brand-950/10">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">ML Anomaly Engine</span>
            <p className="text-xl font-bold text-white tracking-tight">Isolation Forest + Z-Score</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search merchant, category, notes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Risk Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="flagged">Flagged Only</option>
              <option value="cleared">Cleared</option>
              <option value="pending">Pending Hold</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Outflows & Inflows</option>
              <option value="expense">Expenses Only</option>
              <option value="revenue">Revenues Only</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-[#141c2e] text-slate-400 hover:text-slate-200 hover:bg-[#1a263d]'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl glass-panel overflow-hidden border border-[#1f293d]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-semibold text-[11px] border-b border-[#1f293d] select-none">
              <tr>
                <th
                  onClick={() => toggleSort('date')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('merchant')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Merchant / Vendor</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Category & Department</th>
                <th
                  onClick={() => toggleSort('amount')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Type</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th
                  onClick={() => toggleSort('riskLevel')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Level</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1e293b]/60">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-50" />
                    <p className="text-sm font-semibold text-slate-300">No transactions found</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try adjusting your filters or search terms</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isFlagged = tx.status === 'flagged' || tx.riskLevel === 'critical' || tx.riskLevel === 'high';
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx)}
                      className={`hover:bg-[#151f33] transition-colors cursor-pointer group ${
                        isFlagged ? 'bg-rose-950/5' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3 px-4 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Merchant */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white group-hover:text-brand-400 transition-colors truncate max-w-[180px]">
                            {tx.merchant}
                          </span>
                          {tx.anomalyScore && tx.anomalyScore > 0.8 && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="High Anomaly Score" />
                          )}
                        </div>
                        {tx.notes && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{tx.notes}</p>
                        )}
                      </td>

                      {/* Category & Dept */}
                      <td className="py-3 px-4">
                        <span className="text-slate-200 font-medium block truncate max-w-[160px]">
                          {tx.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{tx.department}</span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span
                          className={
                            tx.type === 'revenue' ? 'text-emerald-400' : 'text-slate-100'
                          }
                        >
                          {tx.type === 'revenue' ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            tx.type === 'revenue'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            statusBadgeStyles[tx.status]
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      {/* Risk Level */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            riskBadgeStyles[tx.riskLevel]
                          }`}
                        >
                          {tx.riskLevel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransaction(tx);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#162035] text-brand-400 hover:bg-brand-600 hover:text-white border border-[#23324d] transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#1f293d] bg-[#0d1424] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="font-bold text-white">{sortedTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-white">
              {Math.min(currentPage * itemsPerPage, sortedTransactions.length)}
            </span>{' '}
            of <span className="font-bold text-white">{sortedTransactions.length}</span> transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#23324d] hover:bg-[#18233c] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#23324d] hover:bg-[#18233c] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
