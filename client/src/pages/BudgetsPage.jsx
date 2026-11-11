import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Budget Management</h1>
          <p className="text-xs text-slate-500">
            Set category limits, monitor real-time outflow, and receive predictive warnings
          </p>
        </div>

        <button
          onClick={() => openModal('addBudget')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/30 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Budget</span>
        </button>
      </div>

      {/* Warnings & Alerts if any */}
      {(overBudgetCategories.length > 0 || nearLimitCategories.length > 0) && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold text-amber-900 block sm:inline mr-1">
                Budget Attention Needed:
              </span>
              <span className="text-amber-800">
                {overBudgetCategories.length > 0
                  ? `${overBudgetCategories.map((b) => b.category).join(', ')} exceeded monthly limit.`
                  : `${nearLimitCategories.map((b) => b.category).join(', ')} reached >85% of monthly threshold.`}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ai-advisor')}
            className="shrink-0 px-3 py-1.5 bg-white text-amber-900 hover:bg-amber-100/50 rounded-xl font-bold text-[11px] border border-amber-200 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Get AI Overspending Advice</span>
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Budget Pool</span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(totalLimit)}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across {budgets.length} spending categories</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Spent So Far</span>
          <div className="text-2xl font-black text-slate-900">{formatCurrency(totalSpent)}</div>
          <div className="text-[11px] text-slate-500 mt-1">{overallPercent}% of total allocation used</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Available Remaining Balance</span>
          <div className="text-2xl font-black text-emerald-700">{formatCurrency(totalRemaining)}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Surplus buffer intact</div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const percent = Math.min(100, b.percentage || 0);
          const isOver = b.spent > b.limit;
          const isWarning = percent >= 85 && !isOver;

          return (
            <div
              key={b.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: b.color || '#10B981' }}
                    />
                    <h3 className="font-bold text-slate-900 text-sm">{b.category}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal('editBudget', b)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={deletingId === b.id}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <span className="text-xs text-slate-400">Spent:</span>
                    <span className="ml-1 text-sm font-bold text-slate-900">{formatCurrency(b.spent)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Limit:</span>
                    <span className="ml-1 text-xs font-semibold text-slate-600">{formatCurrency(b.limit)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Status Indicator */}
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-500">{percent}% utilized</span>
                  <span
                    className={`font-semibold ${
                      isOver ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-700'
                    }`}
                  >
                    {isOver ? (
                      `Over by ${formatCurrency(b.spent - b.limit)}`
                    ) : (
                      `${formatCurrency(b.remaining)} remaining`
                    )}
                  </span>
                </div>
              </div>

              {/* Action / Quick Insight */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Cycle: Monthly</span>
                <button
                  onClick={() => openModal('addTransaction')}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  + Add Expense
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
