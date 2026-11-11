import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { X, Sparkles, Loader2, Plus, Check } from 'lucide-react';

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
    'Food & Dining',
    'Groceries',
    'Housing',
    'Utilities',
    'Entertainment',
    'Transportation',
    'Shopping',
    'Health & Fitness',
    'Salary',
    'Freelance',
    'Investments',
    'Payment Transfer',
    'General Expenses'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              {editItem ? '✎' : '+'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {editItem ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <p className="text-xs text-slate-400">Record a new income or expense transaction</p>
            </div>
          </div>
          <button
            onClick={() => {
              closeModal('addTransaction');
              closeModal('editTransaction');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Type Toggle: Expense / Income */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Description with AI Auto-Categorize Button */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description / Merchant Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Swiggy Gourmet, Uber Ride, TechCorp Salary"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                onBlur={handleAiCategorize}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
              <button
                type="button"
                onClick={handleAiCategorize}
                disabled={aiSuggesting || !formData.description}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold flex items-center gap-1 border border-emerald-200/80 transition-colors disabled:opacity-50"
              >
                {aiSuggesting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>Auto-Categorize</span>
              </button>
            </div>
            {aiFeedback && (
              <p className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> {aiFeedback}
              </p>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              >
                <option value="PayPal Sandbox">PayPal Sandbox</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid during business trip"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                closeModal('addTransaction');
                closeModal('editTransaction');
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs shadow-emerald-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editItem ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
