import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  SendHorizontal,
  Receipt,
  Copy,
  Check,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Lock
} from 'lucide-react';

export default function PaymentsPage() {
  const {
    payments,
    paypalConfig,
    currencySymbol,
    formatCurrency,
    openModal,
    refreshAll
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const clientId = paypalConfig?.clientId || 'BAAmDmQ9iyFIWvwF3CYwoqPk6itcyayF1KmLuoOqD23jaXrKaPddNrU4N1Tig3_p8OBaKKh1Uc0ipt-rC4';

  const copyClientId = () => {
    navigator.clipboard.writeText(clientId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalOutgoing = payments
    .filter((p) => p.type === 'OUTGOING')
    .reduce((s, p) => s + Number(p.amount || 0), 0);

  const totalIncoming = payments
    .filter((p) => p.type === 'INCOMING')
    .reduce((s, p) => s + Number(p.amount || 0), 0);

  const filteredPayments = payments.filter((p) => {
    if (filterType === 'outgoing') return p.type === 'OUTGOING';
    if (filterType === 'incoming') return p.type === 'INCOMING';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              PayPal Gateway & Payments
            </h1>
            <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              REST v2 & SDK
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time server capture verification, cryptographic order IDs, and instant PayPal Sandbox execution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refreshAll()}
            className="p-2.5 glass-card rounded-xl text-slate-300 hover:text-white"
            title="Refresh History"
          >
            <RefreshCw className="w-4 h-4 text-[#38BDF8]" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal('paypalCheckout')}
            className="px-4 py-2.5 btn-blue rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Launch PayPal Checkout</span>
          </motion.button>
        </div>
      </div>

      {/* Luxury Sandbox Connection Card */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#003087] to-[#0070BA] flex items-center justify-center text-white shadow-[0_0_25px_rgba(0,112,186,0.4)]">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-white text-base">acsPaypal Sandbox Gateway</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] text-[11px] font-bold border border-[#38BDF8]/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
                  </span>
                  <span>Active & Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official REST endpoint: <code className="font-mono text-[#38BDF8]">https://api-m.sandbox.paypal.com</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Environment</span>
              <span className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                <Lock className="w-3 h-3 text-[#38BDF8]" />
                <span>Tier 1 Sandbox Developer</span>
              </span>
            </div>
          </div>
        </div>

        {/* Credentials Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="md:col-span-2 p-3.5 rounded-xl glass-card flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-[#38BDF8] font-mono font-bold block text-[10px] uppercase tracking-wider">
                Public Frontend Client ID
              </span>
              <code className="text-[11px] font-mono text-slate-200 font-medium truncate block mt-0.5">
                {clientId}
              </code>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={copyClientId}
              className="shrink-0 p-2 glass-card hover:border-[#38BDF8]/50 text-slate-300 hover:text-white rounded-lg transition-colors"
              title="Copy Client ID"
            >
              {copied ? <Check className="w-4 h-4 text-[#38BDF8]" /> : <Copy className="w-4 h-4 text-[#38BDF8]" />}
            </motion.button>
          </div>

          <div className="p-3.5 rounded-xl glass-card flex items-center justify-between border-[#38BDF8]/30">
            <div>
              <span className="text-[#38BDF8] font-mono font-bold block text-[10px] uppercase tracking-wider">
                Backend REST Order Capture
              </span>
              <span className="text-xs font-bold text-white">
                Synchronous Capture Ready
              </span>
            </div>
            <ShieldCheck className="w-6 h-6 text-[#38BDF8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
          </div>
        </div>
      </div>

      {/* Payment Volume Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Gateway Flow</span>
          <div className="text-xl font-black text-white">
            {formatCurrency(totalOutgoing + totalIncoming)}
          </div>
          <span className="text-[11px] text-[#38BDF8] font-mono mt-1 block font-bold">
            {payments.length} verified sandbox orders
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Outgoing Disbursals</span>
          <div className="text-xl font-black text-rose-400">
            -{formatCurrency(totalOutgoing)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Merchants & subscriptions
          </span>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Incoming Payouts</span>
          <div className="text-xl font-black text-[#38BDF8]">
            +{formatCurrency(totalIncoming)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Client & freelance settlements
          </span>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#060913]/50">
          <div>
            <h3 className="font-bold text-white text-sm">PayPal Payment Ledger</h3>
            <p className="text-xs text-slate-400">
              Authenticated orders verified via official PayPal REST v2 endpoints
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#060913] p-1 rounded-xl border border-white/[0.08] text-xs font-semibold overflow-x-auto">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'outgoing', label: 'Sent' },
              { id: 'incoming', label: 'Received' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-[#38BDF8] text-[#060913] shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No payments recorded yet. Click "Launch PayPal Checkout" to test live Sandbox flow.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#060913]/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Recipient / Payer</th>
                  <th className="py-3 px-4">PayPal Order ID</th>
                  <th className="py-3 px-4">Capture ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Digital Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {filteredPayments.map((p) => {
                  const isIncoming = p.type === 'INCOMING';
                  return (
                    <motion.tr 
                      key={p.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncoming
                                ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {isIncoming ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="text-white font-bold">{p.recipient}</div>
                            {p.note && <div className="text-[10px] text-slate-400 font-normal">{p.note}</div>}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300 select-all">
                        {p.orderId}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#38BDF8] select-all">
                        {p.captureId || 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(p.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`font-black ${isIncoming ? 'text-[#38BDF8]' : 'text-white'}`}>
                          {isIncoming ? '+' : '-'}{formatCurrency(p.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25 shadow-[0_0_8px_rgba(56,189,248,0.2)]">
                          {p.status || 'COMPLETED'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal('receiptModal', p)}
                          className="px-2.5 py-1 glass-card hover:border-[#38BDF8]/50 text-slate-200 hover:text-[#38BDF8] rounded-lg font-bold inline-flex items-center gap-1.5 text-[11px] transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>Receipt</span>
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
