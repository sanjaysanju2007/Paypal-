import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AnalyticsPage() {
  const {
    analytics,
    summary,
    transactions,
    currencySymbol,
    formatCurrency
  } = useApp();

  const [timeRange, setTimeRange] = useState('6m');

  const trends = analytics?.monthlyTrends || [
    { month: 'Jun', income: 130000, expenses: 62000, savings: 68000 },
    { month: 'Jul', income: 135000, expenses: 68000, savings: 67000 },
    { month: 'Aug', income: 142000, expenses: 64000, savings: 78000 },
    { month: 'Sep', income: 138000, expenses: 71000, savings: 67000 },
    { month: 'Oct', income: 155000, expenses: 66000, savings: 89000 },
    { month: 'This Month', income: summary.totalIncome || 163700, expenses: summary.totalExpense || 55287, savings: summary.monthlySavings || 108413 }
  ];

  const colors = ['#7CFFB2', '#20D995', '#38BDF8', '#10B981', '#34D399', '#059669', '#A7F3D0'];
  const categoryData = Object.entries(summary.categoryTotals || {}).map(([name, value], i) => ({
    name,
    value,
    color: colors[i % colors.length]
  }));

  const topTransactions = [...transactions]
    .filter((t) => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Spending Intelligence & Analytics</h1>
            <span className="text-[10px] font-bold bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 px-2 py-0.5 rounded-full">
              6-Month Trend
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Historical cashflow trends, comparative analysis, and deep category distributions
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-[#071512] p-1 rounded-xl border border-white/[0.08] text-xs font-bold">
          {[
            { id: '1m', label: '30 Days' },
            { id: '3m', label: '90 Days' },
            { id: '6m', label: '6 Months' },
            { id: '1y', label: '1 Year' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === t.id
                  ? 'bg-[#7CFFB2] text-[#071512] shadow-[0_0_10px_rgba(124,255,178,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bar Chart: Inflow vs Outflow */}
      <div className="glass-panel p-6 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-extrabold text-white text-base">Inflow vs Outflow Trajectory</h3>
            <p className="text-xs text-slate-400">Tracking monthly income against expenses and net surplus</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7CFFB2] shadow-[0_0_8px_#7CFFB2]"></span>
              <span className="text-slate-300">Income Inflow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]"></span>
              <span className="text-slate-300">Expense Outflow</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${currencySymbol}${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), '']}
                contentStyle={{
                  backgroundColor: 'rgba(13, 33, 27, 0.9)',
                  borderColor: 'rgba(124, 255, 178, 0.25)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
                }}
              />
              <Bar dataKey="income" fill="#7CFFB2" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expenses" fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Category Breakdown Donut & Top Outflow Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Donut */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-white text-sm mb-1">Expense Category Distribution</h3>
            <p className="text-xs text-slate-400 mb-4">Detailed proportion across spending classes</p>

            <div className="h-52 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), '']}
                    contentStyle={{
                      backgroundColor: 'rgba(13, 33, 27, 0.9)',
                      borderColor: 'rgba(124, 255, 178, 0.2)',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/[0.08] text-xs">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-2 rounded-xl glass-card">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor]" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-300 font-medium truncate">{c.name}</span>
                </div>
                <span className="font-bold text-white ml-2 shrink-0">{formatCurrency(c.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 High-Volume Outflows */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-white text-sm mb-1">Top Outflow Transactions</h3>
            <p className="text-xs text-slate-400 mb-4">Highest individual expense transactions this period</p>

            <div className="space-y-3">
              {topTransactions.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl glass-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{tx.description}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-rose-400">
                      -{formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {tx.paymentMethod}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 glass-card rounded-xl text-xs text-slate-300 mt-4 border-[#7CFFB2]/20">
            <span className="font-bold text-[#7CFFB2] block mb-1">Neural AI Insight</span>
            <span>Your single largest outflow was rent/mortgage at ₹35,000, which represents 63.3% of total monthly expenses.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
