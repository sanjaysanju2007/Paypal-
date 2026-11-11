import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  CreditCard,
  Building,
  Mail,
  Smartphone,
  Lock,
  ExternalLink,
  Award
} from 'lucide-react';

export default function ProfilePage() {
  const { settings } = useApp();
  const user = settings?.user || {
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    accountNumber: '•••• •••• 8829',
    tier: 'SpendWise Pro'
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Account & Profile</h1>
        <p className="text-xs text-slate-500">
          Personal identification, linked banking nodes, and security clearance
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-black text-xl flex items-center justify-center shadow-sm shadow-emerald-500/20">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                {user.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                HDFC FinTech Account
              </span>
              <span>•</span>
              <span className="font-mono">{user.accountNumber}</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Status</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified & KYC Compliant
          </span>
        </div>
      </div>

      {/* Linked Payment Methods */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Authorized Payment Rails</h3>

        <div className="space-y-2 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0070BA]/10 text-[#0070BA] flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">PayPal Sandbox Wallet (acsPaypal)</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  App: BAAmDmQ9...pt-rC4
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              Active
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Primary Savings Checking Account</div>
                <div className="text-[11px] text-slate-400 font-mono">Direct Deposit / Salary Linked</div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Primary
            </span>
          </div>
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 text-sm">Security & Privacy</h3>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          SpendWise AI isolates API secret keys within secure server-side environments. Client credentials are strictly scoped to developer sandbox endpoints.
        </p>
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px]">
          <ShieldCheck className="w-4 h-4" />
          <span>AES-256 Bit Encrypted Storage Active</span>
        </div>
      </div>
    </div>
  );
}
