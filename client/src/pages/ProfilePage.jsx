import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  Zap
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
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-black text-white tracking-tight">User Account & Profile</h1>
          <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
            Tier 1 Verified
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Personal identification, linked banking nodes, and sandbox security clearance
        </p>
      </div>

      {/* Main Profile Info Glass Card */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#2563EB] text-[#060913] font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
              <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full font-mono">
                {user.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#38BDF8]" />
                FinTech Corporate Core
              </span>
              <span>•</span>
              <span className="font-mono text-slate-300">{user.accountNumber}</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Verification Status</span>
          <span className="text-xs font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-3 py-1 rounded-full border border-[#38BDF8]/30 inline-flex items-center gap-1.5 mt-1 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            KYC & Sandbox Compliant
          </span>
        </div>
      </div>

      {/* Linked Payment Rails */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="font-extrabold text-white text-sm">Authorized Financial Rails</h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-[#38BDF8]/20">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003087] to-[#0070BA] text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(0,112,186,0.3)] shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="font-bold text-white">PayPal Sandbox Wallet (acsPaypal)</div>
                <div className="text-[11px] text-[#38BDF8] font-mono mt-0.5 truncate">
                  Client ID: BAAmDmQ9•••pt-rC4
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2.5 py-1 rounded-full font-mono shrink-0">
              Live Connected
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 flex items-center justify-center font-bold shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">Primary Salary Direct Deposit Core</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Automated payroll intake active</div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-white/[0.06] text-slate-300 border border-white/[0.08] px-2.5 py-1 rounded-full font-mono shrink-0">
              Primary Node
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
