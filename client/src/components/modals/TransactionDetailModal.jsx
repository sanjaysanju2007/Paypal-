import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { X, ArrowDownRight, ArrowUpRight, Calendar, CreditCard, Tag, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function TransactionDetailModal() {
  const { modalState, closeModal, currencySymbol, openModal, refreshAll } = useApp();
  const tx = modalState.viewTransaction;
  const isOpen = Boolean(tx);

  if (!isOpen || !tx) return null;

  const isIncome = tx.type === 'income';

  const handleDelete = async () => {
    if (window.confirm(`Delete transaction "${tx.description}"?`)) {
      try {
        await api.deleteTransaction(tx.id);
        closeModal('viewTransaction');
        refreshAll();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleEdit = () => {
    closeModal('viewTransaction');
    openModal('editTransaction', tx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-elevated rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto text-[#10233F] dark:text-white relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-blue-500/25 dark:border-[#38BDF8]/25"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-500/15 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isIncome
                  ? 'bg-blue-500/15 dark:bg-[#38BDF8]/15 text-[#2563EB] dark:text-[#38BDF8] border border-blue-500/30 dark:border-[#38BDF8]/30 shadow-[0_0_10px_rgba(37,99,235,0.15)] dark:shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-[#10233F] dark:text-white text-sm">Transaction Details</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Ledger ID: {tx.id}</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('viewTransaction')}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#10233F] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="text-center pb-4 border-b border-white/[0.08]">
            <h4 className="text-sm font-semibold text-slate-300 mb-1">{tx.description}</h4>
            <div
              className={`text-3xl font-black tracking-tight ${
                isIncome ? 'text-[#38BDF8]' : 'text-white'
              }`}
            >
              {isIncome ? '+' : '-'}{currencySymbol}{Number(tx.amount || 0).toLocaleString()}
            </div>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_10px_rgba(56,189,248,0.15)]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{tx.status || 'Completed'}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#38BDF8]" /> Category
              </span>
              <span className="font-bold text-white bg-white/[0.06] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                {tx.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" /> Date
              </span>
              <span className="font-medium text-slate-200">{tx.date}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#38BDF8]" /> Payment Channel
              </span>
              <span className="font-semibold text-slate-200">{tx.paymentMethod || 'Bank Transfer'}</span>
            </div>

            {tx.paypalOrderId && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PayPal Order ID</span>
                <span className="font-mono font-medium text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded text-[11px]">
                  {tx.paypalOrderId}
                </span>
              </div>
            )}

            {tx.notes && (
              <div className="pt-2 border-t border-white/[0.08]">
                <span className="text-slate-400 text-[11px] block mb-1">Notes</span>
                <p className="text-slate-300 glass-card p-3 rounded-xl leading-relaxed text-[11px]">
                  {tx.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#060913]/60 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 glass-card hover:border-rose-500/40 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-xs font-bold glass-card hover:border-[#38BDF8]/40 rounded-xl text-slate-200 hover:text-white flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => closeModal('viewTransaction')}
              className="px-5 py-2 text-xs font-bold btn-blue rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
