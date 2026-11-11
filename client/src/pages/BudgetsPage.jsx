import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  PieChart,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export default function BudgetsPage() {
  const {
    budgets,
    currencySymbol,
    formatCurrency,
    openModal,
    refreshAll,
    setActiveTab
  } = useApp();

  const [deletingId, setDeletingId] = useState(null);

  const totalLimit = budgets.reduce((s, b) => s + Number(b.limit || 0), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent || 0), 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallPercent = totalLimit > 0 ? ((totalSpent / totalLimit) * 100).toFixed(1) : 0;

  const overBudgetCategories = budgets.filter((b) => b.isOverBudget);
  const nearLimitCategories = budgets.filter((b) => b.isNearLimit && !b.isOverBudget);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget category?')) {
      try {
        setDeletingId(id);
        await api.deleteBudget(id);
        refreshAll();
      } catch (e) {
        alert(e.message || 'Failed to delete budget');
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
            <h1 className="text-2xl font-black text-white tracking-tight">Smart Budget Management</h1>
            <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
              {budgets.length} Categories Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Set threshold limits, monitor real-time outflow, and receive AI-driven overspending warnings
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => openModal('addBudget')}
          className="px-4 py-2.5 btn-blue rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Budget</span>
        </motion.button>
      </div>

      {/* Warnings & Alerts if any */}
      {(overBudgetCategories.length > 0 || nearLimitCategories.length > 0) && (
        <div className="p-4 rounded-2xl glass-panel border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-[0_0_25px_rgba(245,158,11,0.15)]">
          <div className="flex items-start sm:items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold text-amber-200 block sm:inline mr-1">
                Budget Attention Triggered:
              </span>
              <span className="text-amber-300/90">
                {overBudgetCategories.length > 0
                  ? `${overBudgetCategories.map((b) => b.category).join(', ')} exceeded monthly ceiling.`
                  : `${nearLimitCategories.map((b) => b.category).join(', ')} reached >85% of monthly threshold.`}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('ai-advisor')}
            className="shrink-0 px-3.5 py-1.5 glass-panel text-amber-300 hover:text-white rounded-xl font-bold text-[11px] border-amber-500/30 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Overspending Plan</span>
          </motion.button>
        </div>
      )}

      {/* Overview 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Budget Pool</span>
          <div className="text-2xl font-black text-white">{formatCurrency(totalLimit)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across {budgets.length} assigned categories</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Spent This Cycle</span>
          <div className="text-2xl font-black text-[#38BDF8]">{formatCurrency(totalSpent)}</div>
          <div className="text-[11px] text-slate-400 mt-1">{overallPercent}% of cumulative allowance utilized</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Remaining Safety Cushion</span>
          <div className="text-2xl font-black text-[#60A5FA]">{formatCurrency(totalRemaining)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Available for remaining month</div>
        </div>
      </div>

      {/* Budget Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const percent = Math.min(100, b.percentage || 0);
          const isOver = b.spent > b.limit;
          const isNear = percent > 85 && !isOver;

          return (
            <motion.div
              key={b.id}
              whileHover={{ y: -3 }}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: b.color || '#38BDF8' }} />
                    <h3 className="font-extrabold text-white text-sm">{b.category}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal('editBudget', b)}
                      className="p-1 rounded-lg glass-card text-slate-400 hover:text-white"
                      title="Edit Budget"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1 rounded-lg glass-card text-slate-400 hover:text-rose-400"
                      title="Delete Budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-3 mb-2">
                  <div>
                    <span className="text-xl font-black text-white">{formatCurrency(b.spent)}</span>
                    <span className="text-xs text-slate-400 ml-1">/ {formatCurrency(b.limit)}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isOver
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : isNear
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                        : 'bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'
                    }`}
                  >
                    {percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#060913] overflow-hidden border border-white/[0.08]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? 'bg-rose-500 shadow-[0_0_10px_#F43F5E]'
                        : isNear
                        ? 'bg-amber-400 shadow-[0_0_10px_#FBBF24]'
                        : 'bg-gradient-to-r from-[#2563EB] to-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                  <span>Remaining: <strong className="text-white">{formatCurrency(b.remaining)}</strong></span>
                  <span className="font-mono">{b.period || 'Monthly'}</span>
                </div>
              </div>

              {/* Overspending Advice Chip */}
              {isOver && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center justify-between">
                  <span>Over budget by {formatCurrency(b.spent - b.limit)}</span>
                  <button
                    onClick={() => setActiveTab('ai-advisor')}
                    className="font-bold underline hover:text-white"
                  >
                    Ask AI
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
