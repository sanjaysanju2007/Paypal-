import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  CreditCard,
  Globe,
  Sliders,
  CheckCircle2,
  Save,
  Loader2,
  AlertCircle,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, setSettings, refreshAll } = useApp();

  const [formData, setFormData] = useState({
    currency: 'INR',
    appName: 'SpendWise AI',
    paypalAppName: 'acsPaypal',
    paypalClientId: '',
    paypalClientSecret: '',
    monthlyBudgetAlertThreshold: 85
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency || 'INR',
        appName: settings.appName || 'SpendWise AI',
        paypalAppName: settings.paypalAppName || 'acsPaypal',
        paypalClientId: settings.paypalClientId || 'BAAmDmQ9iyFIWvwF3CYwoqPk6itcyayF1KmLuoOqD23jaXrKaPddNrU4N1Tig3_p8OBaKKh1Uc0ipt-rC4',
        paypalClientSecret: settings.paypalClientSecret || '',
        monthlyBudgetAlertThreshold: settings.monthlyBudgetAlertThreshold || 85
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await api.updateSettings(formData);
      if (res.success) {
        setSettings(res.data);
        setSuccessMsg('Settings successfully updated and synchronized!');
        refreshAll();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-black text-white tracking-tight">System & Account Settings</h1>
          <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
            Config Master
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Configure financial currency standards, PayPal sandbox keys, and automated threshold alerts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Currency Standards */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
            <Globe className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="font-extrabold text-white text-sm">Currency & Denomination Standards</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Primary Ledger Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 glass-input rounded-xl bg-[#060913]"
              >
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Brand Instance Label</label>
              <input
                type="text"
                value={formData.appName}
                onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                className="w-full px-3.5 py-2.5 glass-input rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* PayPal Sandbox Environment Configuration */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="font-extrabold text-white text-sm">PayPal Sandbox REST API Credentials</h3>
            </div>
            <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full font-bold">
              Sandbox Live
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                PayPal App Name
              </label>
              <input
                type="text"
                value={formData.paypalAppName}
                onChange={(e) => setFormData({ ...formData, paypalAppName: e.target.value })}
                className="w-full px-3.5 py-2.5 glass-input rounded-xl font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                PayPal Sandbox Client ID
              </label>
              <input
                type="text"
                value={formData.paypalClientId}
                onChange={(e) => setFormData({ ...formData, paypalClientId: e.target.value })}
                className="w-full px-3.5 py-2.5 glass-input rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                PayPal Sandbox Client Secret (Backend Secure Storage)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.paypalClientSecret || '••••••••••••••••••••••••••••••••••••••••••••••••'}
                  onChange={(e) => setFormData({ ...formData, paypalClientSecret: e.target.value })}
                  placeholder="Leave untouched to keep active backend secret key"
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl font-mono text-xs pr-10"
                />
                <Lock className="w-3.5 h-3.5 text-[#38BDF8] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* AI & Automation Thresholds */}
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
            <Sliders className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="font-extrabold text-white text-sm">Automated Alerts & AI Thresholds</h3>
          </div>

          <div className="text-xs space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-bold">Monthly Budget Warning Threshold</span>
                <span className="font-bold text-[#38BDF8]">{formData.monthlyBudgetAlertThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={formData.monthlyBudgetAlertThreshold}
                onChange={(e) => setFormData({ ...formData, monthlyBudgetAlertThreshold: Number(e.target.value) })}
                className="w-full accent-[#38BDF8]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Trigger dashboard warnings and AI proactive recommendations when category spending passes this percentage.
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 btn-blue rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Apply Settings</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
}
