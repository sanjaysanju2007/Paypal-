import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Printer, Download, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function ReceiptModal() {
  const { modalState, closeModal, currencySymbol } = useApp();
  const payment = modalState.receiptModal;
  const isOpen = Boolean(payment);

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Receipt Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">PayPal Sandbox Official Receipt</h3>
          </div>
          <button
            onClick={() => closeModal('receiptModal')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 space-y-5 text-slate-800" id="printable-receipt">
          {/* Brand & Status Banner */}
          <div className="text-center pb-4 border-b border-dashed border-slate-200">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payment Captured Successfully</span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {currencySymbol}{Number(payment.amount || 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Paid to {payment.recipient || 'Merchant'}</p>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">PayPal Order ID</span>
              <span className="font-mono font-medium text-slate-800 select-all">{payment.orderId || 'ORDER-SB-9921'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Capture Transaction ID</span>
              <span className="font-mono font-medium text-emerald-700 select-all">{payment.captureId || 'CAP-SB-44018'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Environment</span>
              <span className="font-semibold text-slate-700">PayPal Sandbox (acsPaypal)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Date & Time</span>
              <span className="text-slate-700">{new Date(payment.timestamp || Date.now()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payer Account</span>
              <span className="text-slate-700 font-mono">{payment.payerEmail || 'sb-buyer@personal.example.com'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Payment Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                {payment.status || 'COMPLETED'}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-200">
            This transaction was executed in the PayPal Sandbox developer environment under application <strong>acsPaypal</strong> and captured by the SpendWise AI backend services.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={() => closeModal('receiptModal')}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

