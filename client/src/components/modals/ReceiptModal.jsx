import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Printer, ShieldCheck, Download, Sparkles } from 'lucide-react';

export default function ReceiptModal() {
  const { modalState, closeModal, currencySymbol } = useApp();
  const payment = modalState.receiptModal;
  const isOpen = Boolean(payment);

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-elevated rounded-3xl w-full max-w-md overflow-hidden text-[#10233F] dark:text-white relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-blue-500/25 dark:border-[#38BDF8]/25"
      >
        {/* Receipt Header */}
        <div className="px-6 py-4 border-b border-blue-500/15 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] dark:text-[#38BDF8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            <h3 className="font-extrabold text-[#10233F] dark:text-white text-sm">PayPal Sandbox Official Receipt</h3>
          </div>
          <button
            onClick={() => closeModal('receiptModal')}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#10233F] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 space-y-5" id="printable-receipt">
          {/* Brand & Status Banner */}
          <div className="text-center pb-4 border-b border-dashed border-white/[0.12]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-bold rounded-full mb-2.5 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Payment Captured Synchronously</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">
              {currencySymbol}{Number(payment.amount || 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Disbursed to <strong className="text-white">{payment.recipient || 'Merchant'}</strong></p>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-white/[0.06]">
              <span className="text-slate-400">PayPal Order ID</span>
              <span className="font-bold text-slate-200 select-all">{payment.orderId || 'ORDER-SB-9921'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.06]">
              <span className="text-slate-400">Capture ID</span>
              <span className="font-bold text-[#38BDF8] select-all">{payment.captureId || 'CAP-SB-44018'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.06]">
              <span className="text-slate-400">Environment</span>
              <span className="font-semibold text-slate-200 font-sans">PayPal Sandbox (acsPaypal)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.06]">
              <span className="text-slate-400">Timestamp</span>
              <span className="text-slate-300 font-sans">{new Date(payment.timestamp || Date.now()).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/[0.06]">
              <span className="text-slate-400">Payer Account</span>
              <span className="text-slate-300 font-mono text-[11px]">{payment.payerEmail || 'sb-buyer@personal.example.com'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-2 py-0.5 rounded-full text-[10px] border border-[#38BDF8]/25 font-sans">
                {payment.status || 'COMPLETED'}
              </span>
            </div>
          </div>

          <div className="p-3 glass-card rounded-xl text-[11px] text-slate-400 leading-relaxed border-[#38BDF8]/15">
            This transaction was executed in the official PayPal Sandbox developer sandbox under application <strong>acsPaypal</strong> and captured by the SpendWise AI backend services.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#060913]/60 border-t border-white/[0.08] flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white glass-card rounded-xl flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Print Receipt</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => closeModal('receiptModal')}
            className="px-5 py-2 text-xs font-bold btn-blue rounded-xl"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
