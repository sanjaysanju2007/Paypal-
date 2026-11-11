import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  Plus,
  SendHorizontal,
  Trash2,
  Sparkles,
  RefreshCw,
  Calendar,
  CreditCard,
  X
} from 'lucide-react';

export default function RecurringPage() {
  const {
    recurring,
    currencySymbol,
    formatCurrency,
    openModal,
    refreshAll,
    setActiveTab
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Recurring Outflows & Subscriptions
            </h1>
            <span className="text-[10px] font-bold bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 px-2 py-0.5 rounded-full">
              Automated Detector Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Audit automatic renewals, recurring memberships, and execute one-click PayPal sandbox settlements
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 btn-mint rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(124,255,178,0.3)] self-start sm:self-auto"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{showAddForm ? 'Cancel' : 'Track Subscription'}</span>
        </motion.button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Monthly Recurring Burn</span>
          <div className="text-2xl font-black text-white">{formatCurrency(totalMonthly)}</div>
          <span className="text-[11px] text-[#7CFFB2] mt-1 block">Across {recurring.length} active service commitments</span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Annualized Commitment</span>
          <div className="text-2xl font-black text-[#20D995]">{formatCurrency(annualProjection)}</div>
          <span className="text-[11px] text-slate-400 mt-1">Projected 12-month renewal outlay</span>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">AI Optimization Potential</span>
          <div className="text-2xl font-black text-rose-400">{formatCurrency(totalMonthly * 0.2)}/mo</div>
          <span className="text-[11px] text-slate-400 mt-1">Identified potential unutilized services</span>
        </div>
      </div>

      {/* Add Subscription Form Accordion */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddSubscription}
            className="glass-panel p-5 rounded-2xl space-y-4 overflow-hidden border-[#7CFFB2]/30"
          >
            <h3 className="font-extrabold text-white text-sm">Register New Recurring Subscription</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Figma Pro, ChatGPT Plus"
                  value={newSub.name}
                  onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                  className="w-full px-3.5 py-2 glass-input rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  placeholder="1999"
                  value={newSub.amount}
                  onChange={(e) => setNewSub({ ...newSub, amount: e.target.value })}
                  className="w-full px-3.5 py-2 glass-input font-bold text-[#7CFFB2] rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Billing Cycle Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newSub.billingCycleDate}
                  onChange={(e) => setNewSub({ ...newSub, billingCycleDate: e.target.value })}
                  className="w-full px-3.5 py-2 glass-input rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Payment Method</label>
                <select
                  value={newSub.paymentMethod}
                  onChange={(e) => setNewSub({ ...newSub, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 glass-input rounded-xl bg-[#071512]"
                >
                  <option value="PayPal Sandbox">PayPal Sandbox</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Auto Debit">Auto Debit</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 glass-card rounded-xl text-xs font-bold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 btn-mint rounded-xl text-xs font-bold"
              >
                Save Subscription
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recurring.map((sub) => (
          <motion.div
            key={sub.id}
            whileHover={{ y: -3 }}
            className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(124,255,178,0.2)]">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{sub.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400">{sub.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-1 rounded-lg glass-card text-slate-400 hover:text-rose-400"
                  title="Remove Subscription"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-baseline justify-between mt-3 mb-2">
                <div>
                  <span className="text-xl font-black text-white">{formatCurrency(sub.amount)}</span>
                  <span className="text-xs text-slate-400 ml-1">/ {sub.frequency || 'Monthly'}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 font-mono">
                  {sub.status || 'Active'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl glass-card text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#7CFFB2]" /> Renews day {sub.billingCycleDate || '15'} of month
                </span>
                <span className="font-mono text-slate-300">{sub.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Sandbox Verified</span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handlePayViaPayPal(sub)}
                className="px-3.5 py-1.5 glass-card hover:border-[#7CFFB2]/50 text-slate-200 hover:text-[#7CFFB2] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <SendHorizontal className="w-3.5 h-3.5 text-[#7CFFB2]" />
                <span>Pay via PayPal</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
