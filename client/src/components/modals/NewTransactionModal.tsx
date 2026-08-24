import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { TransactionType } from '../../types';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addNewTransaction } = useFinancial();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Cloud Infrastructure');
  const [department, setDepartment] = useState('Engineering');
  const [type, setType] = useState<TransactionType>('expense');
  const [isRecurring, setIsRecurring] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Corporate Card (•8491)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    await addNewTransaction({
      merchant,
      amount: parseFloat(amount),
      category,
      department,
      type,
      isRecurring,
      paymentMethod,
      notes,
    });

    onClose();
    setMerchant('');
    setAmount('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-slate-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">Record New Transaction</h2>
              <p className="text-[11px] text-slate-500">
                Log transaction into company ledger and run anomaly check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                type === 'expense'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Expense Outflow
            </button>
            <button
              type="button"
              onClick={() => setType('revenue')}
              className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                type === 'revenue'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Revenue Inflow
            </button>
          </div>

          {/* Merchant & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Merchant / Destination
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Cloud Services"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Amount (INR ₹)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 145000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              >
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Marketing">Marketing</option>
                <option value="Software & Subscriptions">Software & Subscriptions</option>
                <option value="Payroll & Benefits">Payroll & Benefits</option>
                <option value="Operations">Operations</option>
                <option value="Executive & Legal">Executive & Legal</option>
                <option value="Travel & Entertainment">Travel & Entertainment</option>
                <option value="Sales Revenue">Sales Revenue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="HR & People">HR & People</option>
                <option value="Executive & Legal">Executive & Legal</option>
              </select>
            </div>
          </div>

          {/* Payment Method & Recurring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
              >
                <option value="Corporate Card (•8491)">Corporate Card (•8491)</option>
                <option value="Amex Corporate (•1004)">Amex Corporate (•1004)</option>
                <option value="RTGS / Wire Transfer (HDFC Bank)">RTGS / Wire Transfer (HDFC Bank)</option>
                <option value="Automated Direct Bank ACH">Automated Direct Bank ACH</option>
                <option value="NEFT / RTGS Transfer">NEFT / RTGS Transfer</option>
              </select>
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4"
                />
                <span>Recurring Monthly Outflow</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Notes / Memo
            </label>
            <input
              type="text"
              placeholder="e.g. Q1 annual enterprise license renewal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
