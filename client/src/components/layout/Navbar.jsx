import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  CheckCircle2,
  Sparkles,
  Shield,
  ChevronDown,
  Globe,
  SlidersHorizontal,
  X
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
    markAllNotificationsRead
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

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
    <header className="h-16 bg-white border-b border-slate-200/80 fixed top-0 right-0 left-64 z-20 px-6 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions, budgets, insights..."
          className="w-full pl-9 pr-12 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </span>
        )}
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-3">
        {/* Sandbox Live Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>PayPal Sandbox Ready</span>
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{settings?.currency || 'INR'} ({settings?.currencySymbol || '₹'})</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showCurrencyMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 animate-fade-in text-xs font-medium">
              {[
                { code: 'INR', symbol: '₹', label: 'INR (₹)' },
                { code: 'USD', symbol: '$', label: 'USD ($)' },
                { code: 'EUR', symbol: '€', label: 'EUR (€)' },
                { code: 'GBP', symbol: '£', label: 'GBP (£)' }
              ].map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleCurrencyChange(c.code)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    settings?.currency === c.code ? 'text-emerald-700 bg-emerald-50/60 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span>{c.label}</span>
                  {settings?.currency === c.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-40 animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      item.unread ? 'bg-emerald-50/40 border-emerald-100' : 'bg-slate-50/60 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-xs shadow-2xs">
            AS
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {settings?.user?.name || 'Aditya Sharma'}
            </div>
            <div className="text-[10px] text-slate-400 leading-none">
              {settings?.user?.tier || 'SpendWise Pro'}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}

