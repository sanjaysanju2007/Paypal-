import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Globe,
  Calendar,
  X,
  User,
  Shield,
  CreditCard,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Menu
} from 'lucide-react';
import api from '../../services/api';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    settings,
    setSettings,
    refreshAll,
    notifications,
    markAllNotificationsRead,
    theme,
    toggleTheme,
    toggleMobileMenu
  } = useApp();

  const isDark = theme === 'dark';

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'overview': return 'Executive Overview';
      case 'transactions': return 'Financial Ledger';
      case 'payments': return 'PayPal Gateway & Payments';
      case 'budgets': return 'Smart Budget Management';
      case 'ai-advisor': return 'SpendWise Neural Advisor';
      case 'analytics': return 'Spending Intelligence & Analytics';
      case 'goals': return 'Target Wealth & Goals';
      case 'recurring': return 'Recurring Outflows & Subscriptions';
      case 'reports': return 'Financial Statements & Audits';
      case 'settings': return 'System Settings';
      case 'help': return 'Help & Knowledge Center';
      case 'profile': return 'User Profile & Credentials';
      default: return 'SpendWise AI';
    }
  };

  const handleCurrencyChange = async (curr) => {
    try {
      const res = await api.updateSettings({ currency: curr });
      if (res.success) {
        setSettings(res.data);
        setShowCurrencyMenu(false);
        refreshAll();
      }
    } catch (e) {
      console.error('Failed to change currency:', e);
    }
  };

  return (
    <header className="h-16 sm:h-18 bg-white/85 dark:bg-[#0D1527]/75 backdrop-blur-2xl border-b border-blue-500/15 dark:border-[#38BDF8]/15 fixed top-0 right-0 left-0 lg:left-64 z-30 px-3.5 sm:px-7 flex items-center justify-between shadow-[0_4px_25px_rgba(37,99,235,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-250">
      {/* Left side: Hamburger (mobile) + Page Title & Live Date */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#10233F] dark:hover:text-white bg-slate-100/80 dark:bg-white/[0.05] border border-blue-500/15 dark:border-white/[0.1] transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-[#10233F] dark:text-white tracking-tight flex items-center gap-2 truncate max-w-[130px] sm:max-w-none">
            <span>{getPageTitle(activeTab)}</span>
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <Calendar className="w-3 h-3 text-[#2563EB] dark:text-[#38BDF8]" />
            <span>{todayDateString}</span>
            <span className="text-blue-500/40 dark:text-[#38BDF8]/40">•</span>
            <span className="text-[#2563EB] dark:text-[#38BDF8]/80 font-mono">Encrypted 256-bit Sandbox</span>
          </div>
        </div>
      </div>

      {/* Center/Right Nav Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Search Input (Collapsible/Hidden on small mobile) */}
        <div className="hidden md:block">
          <motion.div 
            className="relative"
            animate={{ width: isSearchExpanded || searchQuery ? 260 : 170 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => !searchQuery && setIsSearchExpanded(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ledger, AI..."
              className="w-full pl-9 pr-10 py-1.5 sm:py-2 text-xs glass-input rounded-xl placeholder-slate-400 dark:placeholder-slate-500 font-medium text-[#10233F] dark:text-slate-200"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2563EB] dark:hover:text-[#38BDF8]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-white/[0.06] border border-blue-500/10 dark:border-white/[0.08] px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            )}
          </motion.div>
        </div>

        {/* AI Quick Assistant Trigger Button */}
        <motion.button
          onClick={() => setActiveTab('ai-advisor')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/15 dark:from-[#38BDF8]/15 dark:to-[#2563EB]/20 border border-blue-500/25 dark:border-[#38BDF8]/30 text-[#2563EB] dark:text-[#38BDF8] text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.1)] dark:shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:border-blue-500/50 dark:hover:border-[#38BDF8]/60 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 fill-[#2563EB]/20 dark:fill-[#38BDF8]/30 animate-pulse text-[#2563EB] dark:text-[#38BDF8]" />
          <span>Ask AI</span>
        </motion.button>

        {/* Dynamic Animated Light Mode / Dark Mode Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="relative flex items-center h-8 sm:h-9 w-[60px] sm:w-[68px] p-1 rounded-full bg-slate-200/80 dark:bg-[#060913]/90 border border-blue-500/20 dark:border-[#38BDF8]/25 hover:border-blue-500/40 dark:hover:border-[#38BDF8]/50 shadow-[0_2px_10px_rgba(37,99,235,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-all cursor-pointer group"
          >
            {/* Smooth animated sliding indicator pill */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              className={`absolute top-1 bottom-1 w-6 sm:w-7 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#2563EB] shadow-[0_0_12px_rgba(56,189,248,0.5)] ${
                isDark ? 'right-1' : 'left-1'
              }`}
            />
            <div className="relative z-10 flex items-center justify-between w-full px-1 sm:px-1.5 pointer-events-none select-none">
              <Sun
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-200 ${
                  !isDark ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              />
              <Moon
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-200 ${
                  isDark ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100/80 dark:bg-white/[0.05] border border-blue-500/15 dark:border-white/[0.1] hover:border-blue-500/40 dark:hover:border-[#38BDF8]/40 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#10233F] dark:hover:text-white transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
            <span className="hidden sm:inline">{settings?.currency || 'INR'} ({settings?.currencySymbol || '₹'})</span>
            <span className="sm:hidden font-mono">{settings?.currencySymbol || '₹'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <AnimatePresence>
            {showCurrencyMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-40 glass-panel-elevated rounded-xl py-1.5 z-50 text-xs font-medium"
              >
                {[
                  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
                  { code: 'USD', symbol: '$', label: 'USD ($)' },
                  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
                  { code: 'GBP', symbol: '£', label: 'GBP (£)' }
                ].map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleCurrencyChange(c.code)}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-blue-500/10 dark:hover:bg-[#38BDF8]/10 transition-colors ${
                      settings?.currency === c.code
                        ? 'text-[#2563EB] dark:text-[#38BDF8] font-semibold bg-blue-500/10 dark:bg-[#38BDF8]/10'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{c.label}</span>
                    {settings?.currency === c.code && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.05] border border-blue-500/15 dark:border-white/[0.1] hover:border-blue-500/40 dark:hover:border-[#38BDF8]/40 text-slate-700 dark:text-slate-300 hover:text-[#10233F] dark:hover:text-white transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"></span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 sm:w-84 glass-panel-elevated rounded-2xl p-3.5 z-50 max-w-[90vw]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-500/10 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#10233F] dark:text-white">Notifications</span>
                    <span className="text-[10px] bg-blue-500/15 dark:bg-[#38BDF8]/15 text-[#2563EB] dark:text-[#38BDF8] px-1.5 py-0.2 rounded font-mono font-bold">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-[#2563EB] dark:text-[#38BDF8] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        item.unread
                          ? 'bg-blue-500/10 dark:bg-[#38BDF8]/10 border-blue-500/25 dark:border-[#38BDF8]/30 shadow-[0_0_15px_rgba(37,99,235,0.06)]'
                          : 'bg-white/60 dark:bg-[#060913]/60 border-blue-500/10 dark:border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#10233F] dark:text-slate-200">{item.title}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">{item.message}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile & Dropdown */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-2.5 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.05] border border-blue-500/15 dark:border-white/[0.1] hover:border-blue-500/40 dark:hover:border-[#38BDF8]/40 transition-all text-left group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#38BDF8] to-[#2563EB] flex items-center justify-center font-extrabold text-white text-xs shadow-[0_0_12px_rgba(56,189,248,0.35)]">
              AS
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-bold text-[#10233F] dark:text-white leading-tight">
                {settings?.user?.name || 'Aditya Sharma'}
              </div>
              <div className="text-[10px] text-[#2563EB] dark:text-[#38BDF8] font-mono leading-none font-bold">
                {settings?.user?.tier || 'SpendWise Pro'}
              </div>
            </div>
            <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-[#10233F] dark:group-hover:text-white transition-colors" />
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 glass-panel-elevated rounded-2xl p-2 z-50 text-xs"
              >
                <div className="p-3 border-b border-blue-500/10 dark:border-white/[0.08] mb-1">
                  <p className="font-bold text-[#10233F] dark:text-white">{settings?.user?.name || 'Aditya Sharma'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{settings?.user?.email || 'aditya.sharma@example.com'}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono text-[#2563EB] dark:text-[#38BDF8] bg-blue-500/10 dark:bg-[#38BDF8]/10 px-2 py-0.5 rounded-full border border-blue-500/20 dark:border-[#38BDF8]/20">
                    <Shield className="w-2.5 h-2.5" />
                    <span>PayPal Verified Tier</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#10233F] dark:hover:text-white hover:bg-blue-500/[0.06] dark:hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
                    <span>Profile Details</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('payments'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#10233F] dark:hover:text-white hover:bg-blue-500/[0.06] dark:hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
                    <span>PayPal Management</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#10233F] dark:hover:text-white hover:bg-blue-500/[0.06] dark:hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#38BDF8]" />
                    <span>Preferences & Security</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
