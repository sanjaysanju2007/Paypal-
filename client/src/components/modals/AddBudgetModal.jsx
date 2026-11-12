import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [color, setColor] = useState('#38BDF8');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editItem) {
      setCategory(editItem.category || 'Food & Dining');
      setLimit(editItem.limit || '');
      setPeriod(editItem.period || 'Monthly');
      setColor(editItem.color || '#38BDF8');
    } else {
      setCategory('Food & Dining');
      setLimit('');
      setPeriod('Monthly');
      setColor('#38BDF8');
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

  const colors = ['#38BDF8', '#2563EB', '#60A5FA', '#818CF8', '#0EA5E9', '#3B82F6', '#93C5FD'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-elevated rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-[#10233F] dark:text-white relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-blue-500/25 dark:border-[#38BDF8]/25"
      >
        <div className="px-6 py-4 border-b border-blue-500/15 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 dark:bg-[#38BDF8]/15 text-[#2563EB] dark:text-[#38BDF8] border border-blue-500/30 dark:border-[#38BDF8]/30 flex items-center justify-center font-bold">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#10233F] dark:text-white text-base">
                {editItem ? 'Edit Budget' : 'Create Category Budget'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Set monthly spending threshold</p>
            </div>
          </div>
          <button
            onClick={() => {
              closeModal('addBudget');
              closeModal('editBudget');
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#10233F] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs glass-input rounded-xl bg-[#060913]"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#060913] text-white">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
              Monthly Limit ({currencySymbol})
            </label>
            <input
              type="number"
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="10000"
              className="w-full px-4 py-2.5 text-xs font-bold text-[#38BDF8] glass-input rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
              Color Tag
            </label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white shadow-[0_0_10px_currentColor]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                closeModal('addBudget');
                closeModal('editBudget');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white glass-card rounded-xl"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 text-xs font-bold btn-blue rounded-xl flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editItem ? 'Save Updates' : 'Establish Budget'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
