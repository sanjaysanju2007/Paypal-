import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { X, PlusCircle, Loader2 } from 'lucide-react';

export default function DepositGoalModal() {
  const { modalState, closeModal, refreshAll, currencySymbol } = useApp();
  const goal = modalState.depositGoal;
  const isOpen = Boolean(goal);

  const [amount, setAmount] = useState('5000');
  const [recordTx, setRecordTx] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAmount('5000');
    setError(null);
  }, [isOpen]);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please provide a valid deposit amount.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.depositGoal(goal.id, {
        amount: Number(amount),
        recordTransaction: recordTx
      });
      closeModal('depositGoal');
      refreshAll();
    } catch (err) {
      setError(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-elevated rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto text-[#10233F] dark:text-white relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-blue-500/25 dark:border-[#38BDF8]/25"
      >
        <div className="px-6 py-4 border-b border-blue-500/15 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 dark:bg-[#38BDF8]/15 text-[#2563EB] dark:text-[#38BDF8] border border-blue-500/30 dark:border-[#38BDF8]/30 flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#10233F] dark:text-white text-sm">Add Savings Deposit</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{goal.name}</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('depositGoal')}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
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

          <div className="glass-card p-3.5 rounded-xl space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Current Progress:</span>
              <span className="font-bold text-slate-200">{currencySymbol}{Number(goal.currentAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Target Goal:</span>
              <span className="font-bold text-[#38BDF8]">{currencySymbol}{Number(goal.targetAmount).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Deposit Amount ({currencySymbol})
            </label>
            <input
              type="number"
              step="any"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 text-base font-black text-[#38BDF8] glass-input rounded-xl"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={recordTx}
              onChange={(e) => setRecordTx(e.target.checked)}
              className="w-4 h-4 rounded accent-[#38BDF8]"
            />
            <span>Record as an expense in Financial Ledger</span>
          </label>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => closeModal('depositGoal')}
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
              <span>Commit Deposit</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
