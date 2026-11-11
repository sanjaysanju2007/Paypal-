import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { X, PieChart, Loader2 } from 'lucide-react';

export default function AddBudgetModal() {
  const { modalState, closeModal, refreshAll, currencySymbol } = useApp();
  const isOpen = Boolean(modalState.addBudget || modalState.editBudget);
  const editItem = typeof modalState.editBudget === 'object' ? modalState.editBudget : null;

  const [category, setCategory] = useState('Food & Dining');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState('Monthly');
  const [color, setColor] = useState('#10B981');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editItem) {
      setCategory(editItem.category || 'Food & Dining');
      setLimit(editItem.limit || '');
      setPeriod(editItem.period || 'Monthly');
      setColor(editItem.color || '#10B981');
    } else {
      setCategory('Food & Dining');
      setLimit('');
      setPeriod('Monthly');
      setColor('#10B981');
    }
    setError(null);
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !limit) {
      setError('Please provide a category and spending limit.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      if (editItem) {
        await api.updateBudget(editItem.id, { category, limit: Number(limit), period, color });
        closeModal('editBudget');
      } else {
        await api.addBudget({ category, limit: Number(limit), period, color });
        closeModal('addBudget');
      }
      refreshAll();
    } catch (err) {
      setError(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Food & Dining',
    'Housing',
    'Groceries',
    'Shopping',
    'Utilities',
    'Entertainment',
    'Transportation',
    'Health & Fitness',
    'Personal Care',
    'Education'
  ];

  const colors = ['#10B981', '#3B82F6', '#14B8A6', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {editItem ? 'Edit Budget' : 'Create Category Budget'}
              </h3>
              <p className="text-xs text-slate-400">Set monthly spending threshold</p>
            </div>
          </div>
          <button
            onClick={() => {
              closeModal('addBudget');
              closeModal('editBudget');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
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
              Monthly Limit ({currencySymbol})
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 8000"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Accent Color</label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-110 border-slate-800 shadow-sm' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                closeModal('addBudget');
                closeModal('editBudget');
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
              <span>{editItem ? 'Save Budget' : 'Create Budget'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

