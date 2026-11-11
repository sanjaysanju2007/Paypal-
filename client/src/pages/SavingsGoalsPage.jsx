import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  Edit2,
  PlusCircle,
  TrendingUp,
  Sparkles
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Savings Goals</h1>
          <p className="text-xs text-slate-500">
            Define personal financial milestones, allocate savings, and track completion
          </p>
        </div>

        <button
          onClick={() => openModal('addGoal')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/30 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Aggregate Progress Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-0.5">Aggregate Goal Progress</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{formatCurrency(totalSaved)}</span>
              <span className="text-xs font-semibold text-slate-400">/ {formatCurrency(totalTarget)} Target</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {overallPercentage}% Completed
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const percent = Math.min(100, g.percentage || 0);
          const isDone = g.currentAmount >= g.targetAmount;

          return (
            <div
              key={g.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs"
                      style={{ backgroundColor: g.color || '#10B981' }}
                    >
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{g.name}</h3>
                      <span className="text-[11px] text-slate-400">{g.category || 'General'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(g.id)}
                      disabled={deletingId === g.id}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div className="flex justify-between items-baseline mb-2 text-xs">
                  <div>
                    <span className="text-slate-400">Saved:</span>
                    <span className="ml-1 font-bold text-slate-900">{formatCurrency(g.currentAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Target:</span>
                    <span className="ml-1 font-semibold text-slate-700">{formatCurrency(g.targetAmount)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isDone ? 'bg-emerald-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-500">{percent}% achieved</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Target: {g.targetDate || '2027'}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {formatCurrency(g.remaining)} left to save
                </span>
                <button
                  onClick={() => openModal('depositGoal', g)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add Savings</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
