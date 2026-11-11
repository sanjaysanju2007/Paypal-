import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function HelpCenterPage() {
  const { openModal } = useApp();

  const faqs = [
    {
      q: 'How does the PayPal Sandbox integration work?',
      a: 'SpendWise AI connects directly to the official PayPal Sandbox REST API and JavaScript SDK using your Sandbox App (acsPaypal). Orders are created with intent CAPTURE and authorized via the official PayPal buttons. When captured, the transaction is verified and saved to your local transaction history.'
    },
    {
      q: 'How do I test making a payment in Sandbox mode?',
      a: 'Click "Pay with PayPal" anywhere in the app. You can log into PayPal using any test Personal buyer account created in your PayPal Developer Dashboard (e.g. sb-buyer@personal.example.com). Alternatively, use the 1-Click Sandbox Test Simulation button to instantly test the order generation, capture, and receipt generation flow.'
    },
    {
      q: 'How does the AI Financial Advisor calculate recommendations?',
      a: 'The AI Financial Advisor computes real statistical metrics from your actual transactions, categories, active budgets, and recurring subscriptions. When a Gemini API key is configured, it sends this live context to Gemini 1.5 Flash. When offline or unconfigured, it utilizes our deterministic analytical model so calculations are 100% accurate.'
    },
    {
      q: 'Can I change the display currency?',
      a: 'Yes, SpendWise AI supports INR (₹), USD ($), EUR (€), and GBP (£). You can change it anytime from the top navigation bar or the Settings page.'
    }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-black text-white tracking-tight">Help & Knowledge Center</h1>
          <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
            Documentation
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Learn how to test PayPal Sandbox, verify AI models, and optimize your financial ledger
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2 border-[#38BDF8]/20">
          <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 flex items-center justify-center font-bold">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-white text-sm">Testing PayPal Sandbox</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Test sending sandbox funds without real charges. Use the test buyer credentials generated in your PayPal Developer dashboard.
          </p>
          <button
            onClick={() => openModal('paypalCheckout')}
            className="pt-1 text-xs font-bold text-[#38BDF8] hover:underline inline-flex items-center gap-1"
          >
            <span>Launch PayPal Modal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2 border-[#38BDF8]/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#2563EB] text-white flex items-center justify-center font-bold shadow-[0_0_12px_rgba(56,189,248,0.3)]">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
          <h3 className="font-extrabold text-white text-sm">AI Advisor Grounding</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All AI responses are dynamically grounded in your real-time bank ledger to formulate actionable savings steps.
          </p>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="glass-panel rounded-2xl divide-y divide-white/[0.08] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        {faqs.map((f, i) => (
          <div key={i} className="p-4 sm:p-5 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 flex items-center justify-center text-xs shrink-0 font-bold">
                ?
              </span>
              <span>{f.q}</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed pl-7.5">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
