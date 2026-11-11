import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  Settings,
  CreditCard,
  Globe,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Save,
  Loader2,
  AlertCircle
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
        setSuccessMsg('Settings updated successfully!');
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
    <div className="space-y-6 animate-fade-in pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500">
          Configure currency standards, PayPal sandbox keys, and automated threshold alerts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Currency Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Currency & Localization</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
              { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
              { code: 'EUR', symbol: '€', label: 'Euro (€)' },
              { code: 'GBP', symbol: '£', label: 'British Pound (£)' }
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setFormData({ ...formData, currency: c.code })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  formData.currency === c.code
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-bold shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="text-base">{c.symbol}</div>
                <div className="text-xs mt-1">{c.code}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PayPal Sandbox Credentials Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#0070BA]" />
              <h3 className="font-bold text-slate-900 text-sm">PayPal Sandbox REST API Configuration</h3>
            </div>
            <span className="text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded">
              acsPaypal
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PayPal Sandbox Client ID
              </label>
              <input
                type="text"
                required
                value={formData.paypalClientId}
                onChange={(e) => setFormData({ ...formData, paypalClientId: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Public client identifier used by the official PayPal JavaScript SDK.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PayPal Client Secret (Stored Securely in Backend)
              </label>
              <input
                type="password"
                placeholder="Enter client secret for backend REST token generation"
                value={formData.paypalClientSecret}
                onChange={(e) => setFormData({ ...formData, paypalClientSecret: e.target.value })}
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Never shared with the browser. Kept protected in backend memory.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PayPal Environment Base URL
              </label>
              <input
                type="text"
                disabled
                value="https://api-m.sandbox.paypal.com"
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Budget Alert Thresholds */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Automated Alerts & Discipline</h3>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-slate-700">Budget Warning Trigger Threshold</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {formData.monthlyBudgetAlertThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={formData.monthlyBudgetAlertThreshold}
              onChange={(e) => setFormData({ ...formData, monthlyBudgetAlertThreshold: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              SpendWise triggers an alert whenever category spending crosses this percentage of its limit.
            </span>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
