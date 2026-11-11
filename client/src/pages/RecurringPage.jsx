import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  RefreshCw,
  Plus,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Calendar,
  SendHorizontal,
  Trash2,
  Sparkles,
  Search
} from 'lucide-react';

export default function RecurringPage() {
  const {
    recurring,
    currencySymbol,
    formatCurrency,
    openModal,
    refreshAll
  } = useApp();

  const [deletingId, setDeletingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSub, setNewSub] = useState({
    name: '',
    category: 'Entertainment',
    amount: '',
    frequency: 'Monthly',
    billingCycleDate: '15',
    paymentMethod: 'PayPal Sandbox'
  });

  const totalMonthly = recurring
    .filter((r) => r.status === 'Active')
    .reduce((s, r) => s + Number(r.amount || 0), 0);

  const annualProjection = totalMonthly * 12;

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    if (!newSub.name || !newSub.amount) return;

    try {
      await api.addRecurring({
        ...newSub,
        amount: Number(newSub.amount),
        billingCycleDate: Number(newSub.billingCycleDate)
      });
      setShowAddForm(false);
      setNewSub({
        name: '',
        category: 'Entertainment',
        amount: '',
        frequency: 'Monthly',
        billingCycleDate: '15',
        paymentMethod: 'PayPal Sandbox'
      });
      refreshAll();
    } catch (err) {
      alert(err.message || 'Failed to add subscription');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recurring payment?')) {
      try {
        setDeletingId(id);
        await api.deleteRecurring(id);
        refreshAll();
      } catch (err) {
        alert(err.message || 'Failed to delete');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handlePayViaPayPal = (sub) => {
    openModal('paypalCheckout', {
      recipient: sub.name,
      amount: sub.amount,
      note: `Monthly Subscription: ${sub.name}`
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Recurring Payments & Subscriptions
            </h1>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Subscription Detector Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Audit automatic renewals, recurring bills, and software memberships
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/30 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Close Form' : 'Add Subscription'}</span>
        </button>
      </div>

      {/* Subscription Detection Alert Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start md:items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block md:inline mr-1">
              Smart Subscription Detector:
            </span>
            <span className="text-slate-600">
              Identified 6 recurring services including Netflix, Spotify, AWS, and Cult.fit.
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-slate-800">
            {formatCurrency(totalMonthly)}/month
          </span>
          <span className="text-[10px] text-slate-400 block">({formatCurrency(annualProjection)}/yr)</span>
        </div>
      </div>

      {/* Add Subscription Dropdown Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubscription}
          className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-4 animate-fade-in"
        >
          <h3 className="text-sm font-bold text-slate-900">Track New Recurring Subscription</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Disney+ Hotstar, GitHub Copilot"
                value={newSub.name}
                onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount ({currencySymbol})
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="499"
                value={newSub.amount}
                onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Day</label>
              <input
                type="number"
                min="1"
                max="31"
                placeholder="Day of Month (1-31)"
                value={newSub.billingCycleDate}
                onChange={(e) => setNewSub({ ...newSub, billingCycleDate: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
            >
              Save Subscription
            </button>
          </div>
        </form>
      )}

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurring.map((sub) => (
          <div
            key={sub.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                    {sub.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{sub.name}</h3>
                    <span className="text-[10px] text-slate-400">{sub.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(sub.id)}
                  disabled={deletingId === sub.id}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2">
                <div className="text-xl font-black text-slate-900">
                  {formatCurrency(sub.amount)}
                  <span className="text-xs font-normal text-slate-400"> / {sub.frequency.toLowerCase()}</span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Billing Cycle:</span>
                  <span className="font-medium text-slate-700">{sub.billingCycleDate}th of every month</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Payment Gateway:</span>
                  <span className="font-medium text-slate-700">{sub.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {sub.status || 'Active'}
              </span>

              <button
                onClick={() => handlePayViaPayPal(sub)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border border-emerald-200/80"
              >
                <SendHorizontal className="w-3 h-3 text-emerald-600" />
                <span>Pay Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
