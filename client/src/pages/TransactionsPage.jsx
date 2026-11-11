import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  Plus,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit2,
  Eye,
  X
} from 'lucide-react';

export default function TransactionsPage() {
  const {
    transactions,
    currencySymbol,
    formatCurrency,
    openModal,
    refreshAll,
    searchQuery: globalSearch
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'income', 'expense'
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ['all', ...Array.from(set)];
  }, [transactions]);

  const query = (localSearch || globalSearch || '').toLowerCase();

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (activeTab !== 'all' && t.type !== activeTab) return false;
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (startDate && t.date < startDate) return false;
        if (endDate && t.date > endDate) return false;
        if (query) {
          const matchDesc = t.description?.toLowerCase().includes(query);
          const matchCat = t.category?.toLowerCase().includes(query);
          const matchMethod = t.paymentMethod?.toLowerCase().includes(query);
          const matchNote = t.notes?.toLowerCase().includes(query);
          if (!matchDesc && !matchCat && !matchMethod && !matchNote) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, activeTab, selectedCategory, startDate, endDate, query, sortBy]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setDeletingId(id);
        await api.deleteTransaction(id);
        refreshAll();
      } catch (err) {
        alert(err.message || 'Failed to delete transaction');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleExportCSV = () => {
    if (!filteredTransactions.length) return;
    const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'PaymentMethod', 'Status', 'Notes'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount,
      t.paymentMethod || 'Bank',
      t.status || 'Completed',
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
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
            <h1 className="text-2xl font-black text-white tracking-tight">Financial Ledger</h1>
            <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
              {filteredTransactions.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time auditable ledger entries, category tagging, and multi-channel reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 glass-card rounded-xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Export CSV</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal('addTransaction')}
            className="px-4 py-2.5 btn-blue rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </motion.button>
        </div>
      </div>

      {/* Filter and Search Glass Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs: All / Inflow / Outflow */}
          <div className="flex items-center gap-1 bg-[#060913] p-1 rounded-xl border border-white/[0.08] text-xs font-bold">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'income', label: 'Income (+)' },
              { id: 'expense', label: 'Expenses (-)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#38BDF8] text-[#060913] shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter by description, channel..."
              className="w-full pl-9 pr-8 py-2 text-xs glass-input rounded-xl"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category, Date & Sort Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-white/[0.06] text-xs">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 glass-input rounded-xl bg-[#060913] text-xs"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map((c) => (
                <option key={c} value={c} className="bg-[#060913] text-white">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-1.5 glass-input rounded-xl bg-[#060913] text-xs"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 glass-input rounded-xl text-xs"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No transactions found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[#060913]/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Description / Merchant</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <motion.tr
                      key={tx.id}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      onClick={() => openModal('viewTransaction', tx)}
                      className="cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isIncome
                                ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                                : 'bg-white/[0.06] text-slate-300 border border-white/[0.08]'
                            }`}
                          >
                            {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-white font-bold">{tx.description}</div>
                            {tx.notes && <div className="text-[10px] text-slate-400 font-normal">{tx.notes}</div>}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-lg text-[11px]">
                          {tx.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {tx.date}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <span className="font-medium">{tx.paymentMethod || 'Bank Transfer'}</span>
                        {tx.paymentMethod === 'PayPal Sandbox' && (
                          <span className="ml-1.5 text-[9px] bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-1 py-0.2 rounded font-mono font-bold">
                            SDK
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`font-black ${isIncome ? 'text-[#38BDF8]' : 'text-white'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/25 font-mono">
                          {tx.status || 'Completed'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openModal('viewTransaction', tx)}
                            className="p-1.5 rounded-lg glass-card hover:border-[#38BDF8]/50 text-slate-300 hover:text-white"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                          </button>
                          <button
                            onClick={() => openModal('editTransaction', tx)}
                            className="p-1.5 rounded-lg glass-card hover:border-[#38BDF8]/50 text-slate-300 hover:text-white"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(tx.id, e)}
                            className="p-1.5 rounded-lg glass-card hover:border-rose-500/40 text-slate-400 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
