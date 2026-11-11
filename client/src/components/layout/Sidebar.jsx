import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  CreditCard,
  PieChart,
  Sparkles,
  BarChart3,
  Target,
  RefreshCw,
  FileText,
  Settings,
  HelpCircle,
  User,
  SendHorizontal,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, openModal } = useApp();

  const mainMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: 'PayPal' },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'Gemini' },
    { id: 'analytics', label: 'Spending Analytics', icon: BarChart3 },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'recurring', label: 'Recurring Payments', icon: RefreshCw },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const generalMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-[#0D211B]/75 backdrop-blur-2xl border-r border-[#7CFFB2]/15 h-screen flex flex-col fixed left-0 top-0 z-40 select-none shadow-[4px_0_30px_rgba(0,0,0,0.6)]">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-[#7CFFB2]/10 relative overflow-hidden">
        {/* Subtle Ambient Light behind Logo */}
        <div className="absolute -left-4 top-2 w-28 h-28 bg-[#7CFFB2]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CFFB2] to-[#20D995] flex items-center justify-center text-[#071512] font-black shadow-[0_0_20px_rgba(124,255,178,0.4)]"
          >
            <Zap className="w-5 h-5 fill-[#071512]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-lg">SpendWise</span>
              <span className="text-[10px] font-bold bg-[#7CFFB2]/15 text-[#7CFFB2] border border-[#7CFFB2]/30 px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(124,255,178,0.2)]">
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Intelligent Wealth Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Menu */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#7CFFB2]/70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CFFB2]/60" />
            Main Menu
          </div>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative group ${
                    isActive
                      ? 'text-[#7CFFB2] font-semibold bg-[#7CFFB2]/10 border border-[#7CFFB2]/25 shadow-[0_0_20px_rgba(124,255,178,0.12)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  {/* Active Indicator Glow Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#7CFFB2]/15 to-transparent pointer-events-none -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-[#7CFFB2] drop-shadow-[0_0_8px_rgba(124,255,178,0.6)]' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        isActive
                          ? 'bg-[#7CFFB2] text-[#071512] shadow-[0_0_12px_rgba(124,255,178,0.5)]'
                          : 'bg-white/[0.06] text-slate-300 border border-white/[0.08]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* General Menu */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            General
          </div>
          <nav className="space-y-1">
            {generalMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative group ${
                    isActive
                      ? 'text-[#7CFFB2] font-semibold bg-[#7CFFB2]/10 border border-[#7CFFB2]/25 shadow-[0_0_20px_rgba(124,255,178,0.12)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#7CFFB2] drop-shadow-[0_0_8px_rgba(124,255,178,0.6)]' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Quick Action & Live Sandbox Status */}
      <div className="p-3 border-t border-[#7CFFB2]/10 bg-[#071512]/60 space-y-2.5">
        <motion.button
          onClick={() => openModal('paypalCheckout')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl btn-mint text-xs font-bold"
        >
          <SendHorizontal className="w-3.5 h-3.5" />
          <span>Pay with PayPal</span>
        </motion.button>

        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#0D211B]/80 border border-[#7CFFB2]/15 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CFFB2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7CFFB2]"></span>
            </span>
            <span className="font-semibold text-slate-200">Sandbox</span>
          </div>
          <span className="text-[#7CFFB2] font-mono text-[10px] bg-[#7CFFB2]/10 px-1.5 py-0.5 rounded border border-[#7CFFB2]/20">
            acsPaypal
          </span>
        </div>
      </div>
    </aside>
  );
}
