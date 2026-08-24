import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowUpDown,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { FinancialTransaction, RiskLevel, TransactionStatus } from '../types';

export const TransactionsPage: React.FC = () => {
  const { transactions, setSelectedTransaction, formatCurrency } = useFinancial();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof FinancialTransaction>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ['all', ...Array.from(set)];
  }, [transactions]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          tx.merchant.toLowerCase().includes(query) ||
          tx.category.toLowerCase().includes(query) ||
          tx.department.toLowerCase().includes(query) ||
          (tx.notes && tx.notes.toLowerCase().includes(query));

        // Risk Level
        const matchesRisk = selectedRisk === 'all' || tx.riskLevel === selectedRisk;

        // Status
        const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;

        // Category
        const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;

        // Type
        const matchesType = selectedType === 'all' || tx.type === selectedType;

        return matchesSearch && matchesRisk && matchesStatus && matchesCategory && matchesType;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          valA = (valA as string).toLowerCase();
          valB = ((valB as string) || '').toLowerCase();
        }

        if (valA! < valB!) return sortOrder === 'asc' ? -1 : 1;
        if (valA! > valB!) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [
    transactions,
    searchQuery,
    selectedRisk,
    selectedStatus,
    selectedCategory,
    selectedType,
    sortField,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof FinancialTransaction) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const statusBadgeStyles: Record<TransactionStatus, string> = {
    flagged: 'bg-rose-50 text-rose-700 border border-rose-200',
    cleared: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  const riskBadgeStyles: Record<RiskLevel, string> = {
    critical: 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold',
    high: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
    medium: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    low: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  const exportCSV = () => {
    const headers = 'ID,Date,Merchant,Amount,Category,Department,Type,Status,RiskLevel,Notes\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.date}","${t.merchant}",${t.amount},"${t.category}","${t.department}","${t.type}","${t.status}","${t.riskLevel}","${t.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `financial-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  const criticalCount = transactions.filter((t) => t.riskLevel === 'critical').length;
  const flaggedVolume = transactions
    .filter((t) => t.status === 'flagged')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* Top Outlier Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Critical Outliers</span>
            <p className="text-lg font-bold text-rose-600 tracking-tight">{criticalCount} Flagged Items</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Flagged Volume</span>
            <p className="text-lg font-bold text-amber-700 tracking-tight">{formatCurrency(flaggedVolume, true)}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Outlier Detection</span>
            <p className="text-lg font-bold text-slate-900 tracking-tight">Statistical Z-Score + IQR</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
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
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-slate-900"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-slate-900"
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
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-slate-900"
            >
              <option value="all">All Outflows & Inflows</option>
              <option value="expense">Expenses Only</option>
              <option value="revenue">Revenues Only</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-md text-xs capitalize transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Controls & Count */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">
              Showing <span className="text-slate-900 font-bold">{filteredTransactions.length}</span> recorded entries
            </span>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('date')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('merchant')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Merchant / Destination</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Category & Department</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount (INR ₹)</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No transactions match your current filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 text-slate-600 font-mono whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Merchant & Flags */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[180px]">
                          {tx.merchant}
                        </span>
                        {tx.anomalyScore && tx.anomalyScore > 0.8 && (
                          <span className="w-2 h-2 rounded-full bg-rose-500" title="High Anomaly Score" />
                        )}
                      </div>
                      {tx.notes && (
                        <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{tx.notes}</p>
                      )}
                    </td>

                    {/* Category & Dept */}
                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium block truncate max-w-[160px]">
                        {tx.category}
                      </span>
                      <span className="text-[10px] text-slate-500">{tx.department}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-mono font-semibold whitespace-nowrap">
                      <span
                        className={
                          tx.type === 'revenue' ? 'text-emerald-600 font-bold' : 'text-slate-900'
                        }
                      >
                        {tx.type === 'revenue' ? '+' : ''}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          tx.type === 'revenue'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${
                          statusBadgeStyles[tx.status]
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${
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
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white border border-slate-200 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
