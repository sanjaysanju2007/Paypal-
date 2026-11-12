import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { X, Sparkles, Loader2, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AddTransactionModal() {
  const { modalState, closeModal, refreshAll, currencySymbol } = useApp();
  const isOpen = Boolean(modalState.addTransaction || modalState.editTransaction);
  const editItem = typeof modalState.editTransaction === 'object' ? modalState.editTransaction : null;

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'Completed'
  });

  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editItem) {
      setFormData({
        description: editItem.description || '',
        amount: editItem.amount || '',
        type: editItem.type || 'expense',
        category: editItem.category || 'Food & Dining',
        paymentMethod: editItem.paymentMethod || 'Credit Card',
        date: editItem.date || new Date().toISOString().split('T')[0],
        notes: editItem.notes || '',
        status: editItem.status || 'Completed'
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'Credit Card',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        status: 'Completed'
      });
    }
    setAiFeedback(null);
    setError(null);
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleAiCategorize = async () => {
    if (!formData.description) return;
    try {
      setAiSuggesting(true);
      const res = await api.categorizeWithAI({
        description: formData.description,
        amount: formData.amount
      });
      if (res.success && res.data) {
        setFormData(prev => ({
          ...prev,
          category: res.data.category,
          type: res.data.type || prev.type
        }));
        setAiFeedback(`AI Suggested: ${res.data.category} (${Math.round((res.data.confidence || 0.9) * 100)}% confidence)`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      setError('Please provide a description and amount.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (editItem) {
        await api.updateTransaction(editItem.id, formData);
        closeModal('editTransaction');
      } else {
        await api.addTransaction(formData);
        closeModal('addTransaction');
      }
      refreshAll();
    } catch (err) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Housing',
    'Food & Dining',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Investments',
    'Shopping',
    'Salary',
    'Freelance',
    'Other'
  ];

  const paymentMethods = [
    'Credit Card',
    'Debit Card',
    'UPI Transfer',
    'PayPal Sandbox',
    'Net Banking',
    'Cash'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-elevated rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-[#10233F] dark:text-white relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-blue-500/25 dark:border-[#38BDF8]/25"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-500/15 dark:border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-[#10233F] dark:text-white text-base">
              {editItem ? 'Edit Transaction' : 'Record New Transaction'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live ledger transaction with AI categorization</p>
          </div>
          <button
            onClick={() => {
              if (editItem) closeModal('editTransaction');
              else closeModal('addTransaction');
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#10233F] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Type Toggle: Inflow vs Outflow */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#060913] rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                formData.type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Expense (Outflow)</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                formData.type === 'income'
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Income (Inflow)</span>
            </button>
          </div>

          {/* Description & AI Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Description / Merchant
              </label>
              <button
                type="button"
                onClick={handleAiCategorize}
                disabled={aiSuggesting || !formData.description}
                className="text-[10px] text-[#38BDF8] hover:text-[#60A5FA] font-bold flex items-center gap-1 disabled:opacity-40"
              >
                <Sparkles className="w-3 h-3" />
                <span>{aiSuggesting ? 'Analyzing...' : 'AI Categorize'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g. Starbucks, Cult.fit Gym, Freelance UX Design"
              className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
            />
            {aiFeedback && (
              <p className="text-[11px] text-[#38BDF8] mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{aiFeedback}</span>
              </p>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="2500"
                className="w-full px-4 py-2.5 text-xs font-black text-[#38BDF8] glass-input rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 text-xs glass-input rounded-xl bg-[#060913]"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#060913] text-white">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Payment Channel
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2.5 text-xs glass-input rounded-xl bg-[#060913]"
              >
                {paymentMethods.map((m) => (
                  <option key={m} value={m} className="bg-[#060913] text-white">{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g. Team dinner celebration, invoice reference"
              className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                if (editItem) closeModal('editTransaction');
                else closeModal('addTransaction');
              }}
              className="px-4 py-2.5 glass-card rounded-xl text-xs font-bold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 btn-blue rounded-xl text-xs font-bold flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editItem ? 'Save Updates' : 'Add to Ledger'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
