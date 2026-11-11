import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowDownRight, ArrowUpRight, Calendar, CreditCard, Tag, FileText, CheckCircle2 } from 'lucide-react';

export default function TransactionDetailModal() {
  const { modalState, closeModal, currencySymbol, openModal } = useApp();
  const tx = modalState.viewTransaction;
  const isOpen = Boolean(tx);

  if (!isOpen || !tx) return null;

  const isIncome = tx.type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Transaction Details</h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {tx.id}</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('viewTransaction')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="text-center pb-4 border-b border-slate-100">
            <h4 className="text-sm font-semibold text-slate-500 mb-1">{tx.description}</h4>
            <div
              className={`text-2xl font-bold tracking-tight ${
                isIncome ? 'text-emerald-600' : 'text-slate-900'
              }`}
            >
              {isIncome ? '+' : '-'}{currencySymbol}{Number(tx.amount || 0).toLocaleString()}
            </div>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>{tx.status || 'Completed'}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" /> Category
              </span>
              <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                {tx.category}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date
              </span>
              <span className="font-medium text-slate-700">{tx.date}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Method
              </span>
              <span className="font-semibold text-slate-700">{tx.paymentMethod || 'Bank Transfer'}</span>
            </div>

            {tx.paypalOrderId && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">PayPal Order ID</span>
                <span className="font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                  {tx.paypalOrderId}
                </span>
              </div>
            )}

            {tx.notes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 text-[11px] block mb-1">Notes</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed text-[11px]">
                  {tx.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              closeModal('viewTransaction');
              openModal('editTransaction', tx);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
          >
            Edit Transaction
          </button>
          <button
            onClick={() => closeModal('viewTransaction')}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
