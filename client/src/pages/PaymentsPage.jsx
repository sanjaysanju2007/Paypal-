import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  SendHorizontal,
  ExternalLink,
  Receipt,
  FileCheck2,
  Copy,
  Check,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              PayPal Sandbox Payments
            </h1>
            <span className="text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/80 px-2 py-0.5 rounded-md">
              REST API & SDK
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Secure payments, capture verification, and transaction history powered by PayPal Sandbox
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refreshAll()}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-colors"
            title="Refresh History"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => openModal('paypalCheckout')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/30 flex items-center gap-1.5 transition-colors"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>New PayPal Payment</span>
          </button>
        </div>
      </div>

      {/* Sandbox Connection & Status Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#003087] to-[#0070BA] flex items-center justify-center text-white shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">acsPaypal Sandbox App</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sandbox Base URL: <code className="font-mono text-slate-600">https://api-m.sandbox.paypal.com</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block">Environment</span>
              <span className="text-xs font-semibold text-slate-700">Sandbox Developer Tier</span>
            </div>
          </div>
        </div>

        {/* Client ID & Config Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="md:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                Frontend Sandbox Client ID
              </span>
              <code className="text-[11px] font-mono text-slate-800 font-medium truncate block">
                {clientId}
              </code>
            </div>
            <button
              onClick={copyClientId}
              className="shrink-0 p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Copy Client ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-emerald-800 font-semibold block text-[10px] uppercase">
                Backend REST Order Status
              </span>
              <span className="text-xs font-bold text-emerald-900">
                Live Capture Ready
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Payment Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Payments Volume</span>
          <div className="text-xl font-bold text-slate-900">
            {formatCurrency(totalOutgoing + totalIncoming)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {payments.length} verified sandbox orders
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Outgoing Disbursals</span>
          <div className="text-xl font-bold text-rose-600">
            -{formatCurrency(totalOutgoing)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Merchants & subscriptions
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Incoming Payouts</span>
          <div className="text-xl font-bold text-emerald-600">
            +{formatCurrency(totalIncoming)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Freelance & client settlements
          </span>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">PayPal Payment History</h3>
            <p className="text-xs text-slate-400">
              Authenticated orders captured via official PayPal endpoints
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'outgoing', label: 'Sent' },
              { id: 'incoming', label: 'Received' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No payments recorded yet. Click "New PayPal Payment" to test.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Recipient / Payer</th>
                  <th className="py-3 px-4">PayPal Order ID</th>
                  <th className="py-3 px-4">Capture ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredPayments.map((p) => {
                  const isIncoming = p.type === 'INCOMING';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncoming ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {isIncoming ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div>{p.recipient}</div>
                            {p.note && <div className="text-[10px] text-slate-400 font-normal">{p.note}</div>}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 select-all">
                        {p.orderId}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-700 select-all">
                        {p.captureId || 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(p.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`font-bold ${isIncoming ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {isIncoming ? '+' : '-'}{formatCurrency(p.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status || 'COMPLETED'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openModal('receiptModal', p)}
                          className="px-2.5 py-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold inline-flex items-center gap-1 text-[11px] border border-slate-200 transition-colors"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
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
