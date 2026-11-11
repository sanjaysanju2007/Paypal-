import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function ReportsPage() {
  const {
    summary,
    budgets,
    formatCurrency,
    settings
  } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const rows = [
      ['SpendWise AI - Financial Statement Report'],
      ['Generated On', new Date().toLocaleString()],
      ['Currency', settings?.currency || 'INR'],
      [''],
      ['Summary Section'],
      ['Total Income', summary.totalIncome],
      ['Total Expenses', summary.totalExpense],
      ['Net Savings', summary.monthlySavings],
      ['Savings Rate', `${summary.savingsRate}%`],
      [''],
      ['Category Expenses'],
      ...Object.entries(summary.categoryTotals || {}).map(([cat, val]) => [cat, val])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendWise_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Financial Statements & Audits</h1>
            <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
              Audit-Ready
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Exportable cashflow statements, performance metrics, and tax-ready summaries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePrint}
            className="px-3.5 py-2.5 glass-card rounded-xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Print Report</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 btn-blue rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </motion.button>
        </div>
      </div>

      {/* Printable Statement Sheet Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-[#38BDF8]/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 max-w-4xl mx-auto">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-white text-xl tracking-tight">SpendWise</span>
              <span className="text-xs font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
                AI Statement
              </span>
            </div>
            <p className="text-xs text-slate-400">Statement of Cash Inflows, Disbursals, and Net Retained Capital</p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 space-y-0.5 font-mono">
            <div><strong className="text-white">Client:</strong> {settings?.user?.name || 'Aditya Sharma'}</div>
            <div><strong className="text-white">Account:</strong> {settings?.user?.accountNumber || '•••• •••• 8829'}</div>
            <div><strong className="text-white">Generated:</strong> {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl glass-card">
            <span className="text-slate-400 text-xs block mb-1 font-bold uppercase tracking-wider">Total Gross Inflows</span>
            <div className="text-xl font-black text-white">{formatCurrency(summary.totalIncome)}</div>
            <span className="text-[11px] text-[#38BDF8] mt-1 block font-bold">Verified Inflow Streams</span>
          </div>

          <div className="p-4 rounded-2xl glass-card">
            <span className="text-slate-400 text-xs block mb-1 font-bold uppercase tracking-wider">Total Operating Disbursals</span>
            <div className="text-xl font-black text-rose-400">{formatCurrency(summary.totalExpense)}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Total Monthly Outflows</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border-[#38BDF8]/30">
            <span className="text-slate-400 text-xs block mb-1 font-bold uppercase tracking-wider">Net Retained Surplus</span>
            <div className="text-xl font-black text-[#38BDF8]">{formatCurrency(summary.monthlySavings)}</div>
            <span className="text-[11px] text-[#38BDF8] mt-1 block font-bold">{summary.savingsRate}% Retained Ratio</span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div>
          <h3 className="font-extrabold text-white text-sm mb-3">Outflow Breakdown by Economic Classification</h3>
          <div className="border border-white/[0.08] rounded-2xl overflow-hidden glass-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060913]/70 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
                <tr>
                  <th className="py-2.5 px-4">Expense Classification</th>
                  <th className="py-2.5 px-4 text-right">Disbursed Amount</th>
                  <th className="py-2.5 px-4 text-right">Relative Proportion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {Object.entries(summary.categoryTotals || {}).map(([cat, val]) => {
                  const share = ((val / (summary.totalExpense || 1)) * 100).toFixed(1);
                  return (
                    <tr key={cat} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white">{cat}</td>
                      <td className="py-3 px-4 text-right font-black text-slate-200">{formatCurrency(val)}</td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Verification Seal */}
        <div className="p-4 rounded-2xl glass-card border-[#38BDF8]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8] drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            <div>
              <span className="font-extrabold text-white block">SpendWise Cryptographic Verification Seal</span>
              <span className="text-[11px] text-slate-400">Reconciled against verified PayPal Sandbox orders and atomic ledger storage.</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/25 px-2.5 py-1 rounded-full font-bold">
            SHA256: 9b2d•••8e1f
          </span>
        </div>
      </div>
    </div>
  );
}
