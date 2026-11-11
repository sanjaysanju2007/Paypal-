import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  Target,
  Plus,
  Calendar,
  Trash2,
  PlusCircle,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function SavingsGoalsPage() {
  const {
    goals,
    currencySymbol,
    formatCurrency,
    openModal,
    refreshAll
  } = useApp();

  const [deletingId, setDeletingId] = useState(null);

  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((s, g) => s + Number(g.currentAmount || 0), 0);
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const overallPercentage = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

  const handleDelete = async (id) => {
    if (window.confirm('Delete this savings goal?')) {
      try {
        setDeletingId(id);
        await api.deleteGoal(id);
        refreshAll();
      } catch (err) {
        alert(err.message || 'Failed to delete goal');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Target Wealth & Goals</h1>
            <span className="text-[10px] font-bold bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 px-2 py-0.5 rounded-full">
              {goals.length} Targets Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Define milestones, allocate savings deposits, and monitor algorithmic completion trajectory
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openModal('addGoal')}
          className="px-4 py-2.5 btn-mint rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(124,255,178,0.3)] self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Savings Goal</span>
        </motion.button>
      </div>

      {/* Aggregate Progress Card */}
      <div className="glass-panel p-6 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Cumulative Milestone Progress</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{formatCurrency(totalSaved)}</span>
              <span className="text-xs font-bold text-[#7CFFB2]">/ {formatCurrency(totalTarget)} Target Pool</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#7CFFB2] bg-[#7CFFB2]/10 border border-[#7CFFB2]/30 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(124,255,178,0.2)]">
              {overallPercentage}% Completed
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-[#071512] overflow-hidden border border-white/[0.08]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#20D995] to-[#7CFFB2] transition-all duration-700 shadow-[0_0_12px_#7CFFB2]"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((g) => {
          const percent = Math.min(100, g.percentage || 0);
          const isDone = g.currentAmount >= g.targetAmount;

          return (
            <motion.div
              key={g.id}
              whileHover={{ y: -3 }}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(124,255,178,0.2)]">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{g.name}</h3>
                      <span className="text-[10px] font-bold text-slate-400">{g.category || 'Personal'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#7CFFB2] bg-[#7CFFB2]/15 border border-[#7CFFB2]/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Achieved</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="p-1 rounded-lg glass-card text-slate-400 hover:text-rose-400"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-3 mb-2">
                  <div>
                    <span className="text-xl font-black text-white">{formatCurrency(g.currentAmount)}</span>
                    <span className="text-xs text-slate-400 ml-1">/ {formatCurrency(g.targetAmount)}</span>
                  </div>
                  <span className="text-xs font-bold text-[#7CFFB2] font-mono">{percent}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#071512] overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#20D995] to-[#7CFFB2] transition-all duration-500 shadow-[0_0_8px_#7CFFB2]"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#7CFFB2]" /> Target: {g.targetDate || '2027-01-01'}
                  </span>
                  <span>Need: <strong className="text-white">{formatCurrency(Math.max(0, g.targetAmount - g.currentAmount))}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] text-[#7CFFB2] font-mono">Automated tracking</span>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openModal('depositGoal', g)}
                  className="px-3.5 py-1.5 glass-card hover:border-[#7CFFB2]/50 text-slate-200 hover:text-[#7CFFB2] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#7CFFB2]" />
                  <span>Deposit Funds</span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
