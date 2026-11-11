import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { X, Target, Loader2 } from 'lucide-react';

export default function AddGoalModal() {
  const { modalState, closeModal, refreshAll, currencySymbol } = useApp();
  const isOpen = Boolean(modalState.addGoal);

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Tech & Gadgets');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setTargetDate('');
    setError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount) {
      setError('Please provide a goal name and target amount.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.addGoal({
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount) || 0,
        targetDate: targetDate || '2027-01-01',
        category,
        color: '#38BDF8'
      });
      closeModal('addGoal');
      refreshAll();
    } catch (err) {
      setError(err.message || 'Failed to create goal');
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
        className="glass-panel-elevated rounded-3xl w-full max-w-md overflow-hidden text-white relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-[#38BDF8]/25"
      >
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">New Wealth Goal</h3>
              <p className="text-xs text-slate-400">Target a financial milestone and track progress</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('addGoal')}
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

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Goal Title</label>
            <input
              type="text"
              required
              placeholder="e.g. MacBook Pro M3, Emergency Cushion, Tokyo Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Target ({currencySymbol})
              </label>
              <input
                type="number"
                required
                placeholder="200000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-4 py-2.5 text-xs font-black text-[#38BDF8] glass-input rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Initial Saved ({currencySymbol})
              </label>
              <input
                type="number"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs glass-input rounded-xl bg-[#060913]"
              >
                <option value="Tech & Gadgets">Tech & Gadgets</option>
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Travel & Vacation">Travel & Vacation</option>
                <option value="Investments">Investments</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Real Estate">Real Estate</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => closeModal('addGoal')}
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
              <span>Lock Goal Target</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
