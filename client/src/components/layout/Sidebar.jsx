import React from 'react';
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
  ShieldCheck,
  SendHorizontal
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, openModal, paypalConfig } = useApp();

  const mainMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: 'PayPal' },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'ai-advisor', label: 'AI Financial Advisor', icon: Sparkles, badge: 'Gemini' },
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
    <aside className="w-64 bg-white border-r border-slate-200/90 h-screen flex flex-col fixed left-0 top-0 z-30 select-none shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-lg">SpendWise</span>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-1.5 py-0.5 rounded-md">
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Intelligent Money Mgmt</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Menu */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs ring-1 ring-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* General Menu */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            General
          </div>
          <nav className="space-y-1">
            {generalMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs ring-1 ring-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Quick Action & Status Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
        <button
          onClick={() => openModal('paypalCheckout')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-colors"
        >
          <SendHorizontal className="w-3.5 h-3.5" />
          <span>Pay with PayPal</span>
        </button>

        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white border border-slate-200/70 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-700">Sandbox</span>
          </div>
          <span className="text-slate-400 text-[10px] font-mono">acsPaypal</span>
        </div>
      </div>
    </aside>
  );
}

