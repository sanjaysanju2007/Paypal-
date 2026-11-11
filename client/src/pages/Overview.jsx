import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import NumberCounter from '../components/common/NumberCounter';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
  Plus,
  SendHorizontal,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Overview() {
  const {
    summary,
    transactions,
    budgets,
    currencySymbol,
    formatCurrency,
    openModal,
    setActiveTab,
    analytics,
    aiSummary
  } = useApp();

  const [hideBalance, setHideBalance] = useState(false);
  const [timeRange, setTimeRange] = useState('30D');

  const chartData = analytics?.monthlyTrends || [
    { month: 'Jun', income: 130000, expenses: 62000 },
    { month: 'Jul', income: 135000, expenses: 68000 },
    { month: 'Aug', income: 142000, expenses: 64000 },
    { month: 'Sep', income: 138000, expenses: 71000 },
    { month: 'Oct', income: 155000, expenses: 66000 },
    { month: 'Nov', income: summary.totalIncome || 163700, expenses: summary.totalExpense || 55287 },
  ];

  // Electric Mint & Emerald Theme Palette
  const mintCategoryColors = ['#7CFFB2', '#20D995', '#38BDF8', '#10B981', '#34D399', '#059669'];
  const categoryChartData = Object.entries(summary.categoryTotals || {}).map(([name, value], i) => ({
    name,
    value,
    color: mintCategoryColors[i % mintCategoryColors.length]
  }));

  const recentTransactions = transactions.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* Header Greeting & Action Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Executive Dashboard</h1>
            <span className="text-[10px] font-mono font-bold bg-[#7CFFB2]/10 text-[#7CFFB2] border border-[#7CFFB2]/20 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(124,255,178,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CFFB2] animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Welcome back, Aditya. SpendWise neural models have audited your November cash flow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal('addTransaction')}
            className="px-3.5 py-2.5 glass-card rounded-xl text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#7CFFB2]" />
            <span>Add Transaction</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal('paypalCheckout')}
            className="px-4 py-2.5 btn-mint rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(124,255,178,0.3)]"
          >
            <SendHorizontal className="w-3.5 h-3.5" />
            <span>Pay with PayPal</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 4 Premium Glass KPI Metric Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL BALANCE CARD (Hero Glass Card with Floating Ambient Glow) */}
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-[#7CFFB2]/40 transition-all">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#7CFFB2]/15 rounded-full blur-xl pointer-events-none group-hover:bg-[#7CFFB2]/25 transition-all" />
          
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Total Net Balance</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="text-slate-400 hover:text-[#7CFFB2] transition-colors p-1"
                title={hideBalance ? "Show Balance" : "Hide Balance"}
              >
                {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <div className="w-8 h-8 rounded-xl bg-[#7CFFB2]/15 border border-[#7CFFB2]/30 text-[#7CFFB2] flex items-center justify-center shadow-[0_0_12px_rgba(124,255,178,0.2)]">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="text-2xl font-black text-white tracking-tight relative z-10">
            {hideBalance ? (
              <span className="tracking-widest text-slate-400">••••••••••</span>
            ) : (
              <NumberCounter value={summary.totalBalance} prefix={currencySymbol} />
            )}
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] relative z-10">
            <span className="inline-flex items-center text-[#7CFFB2] font-bold bg-[#7CFFB2]/10 px-2 py-0.5 rounded-md border border-[#7CFFB2]/25">
              <TrendingUp className="w-3 h-3 mr-1" /> +5.4%
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* TOTAL INCOME CARD */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Total Inflow</span>
            <div className="w-8 h-8 rounded-xl bg-[#20D995]/15 border border-[#20D995]/30 text-[#20D995] flex items-center justify-center shadow-[0_0_10px_rgba(32,217,149,0.2)]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {hideBalance ? '••••••' : <NumberCounter value={summary.totalIncome} prefix={currencySymbol} />}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-[#7CFFB2] font-bold">2 active streams</span>
            <span>(Salary & Freelance)</span>
          </div>
        </div>

        {/* TOTAL EXPENSES CARD */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Total Outflow</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.2)]">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {hideBalance ? '••••••' : <NumberCounter value={summary.totalExpense} prefix={currencySymbol} />}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
              {((summary.totalExpense / (summary.totalIncome || 1)) * 100).toFixed(1)}%
            </span>
            <span>of total earnings</span>
          </div>
        </div>

        {/* MONTHLY SAVINGS CARD */}
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Monthly Savings</span>
            <div className="w-8 h-8 rounded-xl bg-[#7CFFB2]/15 border border-[#7CFFB2]/30 text-[#7CFFB2] flex items-center justify-center shadow-[0_0_10px_rgba(124,255,178,0.2)]">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {hideBalance ? '••••••' : <NumberCounter value={summary.monthlySavings} prefix={currencySymbol} />}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px]">
            <span className="text-[#7CFFB2] font-bold bg-[#7CFFB2]/10 px-2 py-0.5 rounded-md border border-[#7CFFB2]/20">
              {summary.savingsRate}% Rate
            </span>
            <span className="text-slate-400">Benchmark: 30%</span>
          </div>
        </div>
      </motion.div>

      {/* AI Financial Summary Banner */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-[#7CFFB2]/25 shadow-[0_0_30px_rgba(124,255,178,0.08)]"
      >
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7CFFB2] to-[#20D995] text-[#071512] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(124,255,178,0.4)]">
            <Sparkles className="w-5 h-5 fill-[#071512]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-extrabold text-white text-sm">SpendWise Neural Summary</h3>
              <span className="text-[10px] font-bold bg-[#7CFFB2]/15 text-[#7CFFB2] px-2 py-0.5 rounded-full border border-[#7CFFB2]/30">
                Live Insights
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {aiSummary?.summary || 'Your cash reserves are strong. You have retained 66.2% of your monthly income. Discretionary spending on Food & Dining is well-managed at ₹3,270. Emergency fund milestone is 65% achieved.'}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveTab('ai-advisor')}
          className="shrink-0 px-4 py-2.5 btn-glass rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative z-10"
        >
          <span>Deep AI Audit</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#7CFFB2]" />
        </motion.button>
      </motion.div>

      {/* Main Charts Row: Inflow vs Outflow & Expense Category Donut */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Interactive Area Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Income vs Expenses Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400">Monthly cash inflow and outflow performance</p>
            </div>

            {/* Time range switcher */}
            <div className="flex items-center gap-1 bg-[#071512]/60 p-1 rounded-xl border border-white/[0.08]">
              {['7D', '30D', '90D', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    timeRange === range
                      ? 'bg-[#7CFFB2] text-[#071512] shadow-[0_0_10px_rgba(124,255,178,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-68 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mintIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CFFB2" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7CFFB2" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="roseExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
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
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(124, 255, 178, 0.2)',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income Inflow"
                  stroke="#7CFFB2"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#mintIncomeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses Outflow"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#roseExpenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Glass Donut */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white text-sm">Expense Categories</h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-[11px] font-bold text-[#7CFFB2] hover:underline"
              >
                Full Analytics
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Live allocation for this billing cycle</p>

            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
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
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-medium">Largest Slice</span>
                <span className="text-xs font-bold text-[#7CFFB2]">
                  {categoryChartData[0]?.name || 'Housing'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-white/[0.08]">
            {categoryChartData.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-white">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Two Column Bottom Row: Recent Transactions & Budget Progress */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Interactive Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-sm">Recent Activity</h3>
              <p className="text-xs text-slate-400">Live ledger events across verified accounts</p>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-bold text-[#7CFFB2] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <motion.div
                  key={tx.id}
                  whileHover={{ scale: 1.01, x: 2 }}
                  onClick={() => openModal('viewTransaction', tx)}
                  className="p-3 rounded-xl glass-card flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 shadow-[0_0_10px_rgba(124,255,178,0.2)]'
                          : 'bg-white/[0.06] text-slate-300 border border-white/[0.08]'
                      }`}
                    >
                      {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#7CFFB2] transition-colors leading-tight">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                        {tx.paymentMethod === 'PayPal Sandbox' && (
                          <span className="text-[10px] bg-[#7CFFB2]/10 text-[#7CFFB2] border border-[#7CFFB2]/20 px-1.5 rounded font-mono">
                            PayPal
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-bold ${
                        isIncome ? 'text-[#7CFFB2]' : 'text-slate-200'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] text-[#7CFFB2] bg-[#7CFFB2]/10 border border-[#7CFFB2]/20 px-1.5 py-0.5 rounded font-mono">
                      {tx.status || 'Completed'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Budget Progress Glass Indicators */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white text-sm">Monthly Budgets</h3>
              <button
                onClick={() => setActiveTab('budgets')}
                className="text-[11px] font-bold text-[#7CFFB2] hover:underline"
              >
                Manage
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Thresholds & spending boundaries</p>

            <div className="space-y-4">
              {budgets.slice(0, 4).map((b) => {
                const percent = Math.min(100, b.percentage || 0);
                const isWarning = percent > 85;
                const isOver = b.spent > b.limit;

                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{b.category}</span>
                      <span className="text-slate-400 font-medium">
                        {formatCurrency(b.spent)} / <strong className="text-white">{formatCurrency(b.limit)}</strong>
                      </span>
                    </div>
                    {/* Glowing Progress Track */}
                    <div className="w-full h-2 rounded-full bg-[#071512] border border-white/[0.08] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver
                            ? 'bg-rose-500 shadow-[0_0_10px_#F43F5E]'
                            : isWarning
                            ? 'bg-amber-400 shadow-[0_0_10px_#FBBF24]'
                            : 'bg-gradient-to-r from-[#20D995] to-[#7CFFB2] shadow-[0_0_10px_rgba(124,255,178,0.5)]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{percent}% spent</span>
                      <span>{formatCurrency(b.remaining)} left</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.08]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal('addBudget')}
              className="w-full py-2.5 glass-card rounded-xl text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#7CFFB2]" />
              <span>Create New Budget</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
