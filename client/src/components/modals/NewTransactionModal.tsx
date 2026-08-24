import React, { useState } from 'react';
import { X, PlusCircle, DollarSign, Building2, Tag, CreditCard } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-[#22314e] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#1f293d] flex items-center justify-between bg-gradient-to-r from-slate-900 to-[#121c33]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Financial Transaction</h2>
              <p className="text-xs text-slate-400">
                Data is automatically ingested by the ML Anomaly Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#131c2e] border border-[#1f2d47] rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense Outflow
            </button>
            <button
              type="button"
              onClick={() => setType('revenue')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'revenue'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue Inflow
            </button>
          </div>

          {/* Merchant & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Merchant / Vendor
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Snowflake Cloud"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount (INR ₹)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 145000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-lg text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Corporate Card (•8491)">Corporate Card (•8491)</option>
                <option value="Amex Corporate (•1004)">Amex Corporate (•1004)</option>
                <option value="RTGS / Wire Transfer (HDFC Bank)">RTGS / Wire Transfer (HDFC Bank)</option>
                <option value="Automated Direct Bank ACH">Automated Direct Bank ACH</option>
                <option value="NEFT / RTGS Transfer">NEFT / RTGS Transfer</option>
              </select>
            </div>

            <div className="pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-[#1f2d47] bg-[#131c2e] text-brand-600 focus:ring-0 w-4 h-4"
                />
                <span>Recurring Monthly Outflow</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notes / Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. Q1 annual enterprise license renewal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#131c2e] border border-[#1f2d47] rounded-lg text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all shadow-glow"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
