import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function AnalyticsPage() {
  const {
    analytics,
    summary,
    transactions,
    currencySymbol,
    formatCurrency
  } = useApp();

  const [timeRange, setTimeRange] = useState('6m'); // '1m', '3m', '6m', '1y'

  const trends = analytics?.monthlyTrends || [
    { month: 'Jun', income: 130000, expenses: 62000, savings: 68000 },
    { month: 'Jul', income: 135000, expenses: 68000, savings: 67000 },
    { month: 'Aug', income: 142000, expenses: 64000, savings: 78000 },
    { month: 'Sep', income: 138000, expenses: 71000, savings: 67000 },
    { month: 'Oct', income: 155000, expenses: 66000, savings: 89000 },
    { month: 'This Month', income: summary.totalIncome || 163700, expenses: summary.totalExpense || 55287, savings: summary.monthlySavings || 108413 }
  ];

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'];
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Spending Analytics</h1>
          <p className="text-xs text-slate-500">
            Historical trends, comparative analysis, and category distributions
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
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
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bar Chart: Inflow vs Outflow */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Monthly Inflow vs Outflow Trends</h3>
            <p className="text-xs text-slate-400">Comparing income, expenses, and retained savings over time</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="text-slate-600">Expenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="text-slate-600">Savings</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${currencySymbol}${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val) => [formatCurrency(val), '']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="savings" fill="#0284C7" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Top Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 text-sm">Category Expenditure Share</h3>
              <span className="text-xs text-slate-400 font-medium">{categoryData.length} active categories</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Proportional breakdown of all expenses</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={88}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), '']}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-600 truncate">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-800 shrink-0">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Spending Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Highest Spending Outflows</h3>
            <p className="text-xs text-slate-400 mb-4">Largest single debits recorded in current billing cycle</p>

            <div className="space-y-3">
              {topTransactions.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs">{tx.description}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {tx.category} • {tx.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-xs">
                      -{formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] text-slate-400">{tx.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Observation Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Observation</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Your fixed housing commitments comprise 57% of your total expenditures, which is normal for metro living. Discretionary spending variability remains well within healthy thresholds (&lt;12% deviation month-over-month).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
