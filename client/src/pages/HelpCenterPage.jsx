import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  CreditCard,
  Sparkles,
  ShieldCheck,
  SendHorizontal,
  ExternalLink,
  ChevronDown
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
      a: 'The AI Financial Advisor computes real statistical metrics from your actual transactions, categories, active budgets, and recurring subscriptions. When a Gemini API key is configured, it sends this live context to Gemini 1.5 Flash. When offline or unconfigured, it utilizes our deterministic analytical engine so calculations are 100% accurate.'
    },
    {
      q: 'Are my transactions and settings saved?',
      a: 'Yes! All transactions, custom budgets, savings goals, recurring bills, and PayPal payments are persisted safely on the backend.'
    },
    {
      q: 'Can I change the display currency?',
      a: 'Yes, SpendWise AI supports INR (₹), USD ($), EUR (€), and GBP (£). You can change it anytime from the top navigation bar or the Settings page.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Help Center & FAQ</h1>
        <p className="text-xs text-slate-500">
          Learn how to test PayPal Sandbox, understand AI metrics, and configure your platform
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0070BA] flex items-center justify-center font-bold">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Testing PayPal Sandbox</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Test sending sandbox funds without real charges. Use the test buyer credentials generated in your PayPal Developer dashboard.
          </p>
          <button
            onClick={() => openModal('paypalCheckout')}
            className="pt-1 text-xs font-bold text-[#0070BA] hover:underline inline-flex items-center gap-1"
          >
            <span>Launch PayPal Modal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">AI Advisor Grounding</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All AI responses are dynamically grounded in your real-time bank ledger to formulate actionable savings steps.
          </p>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {faqs.map((f, i) => (
          <div key={i} className="p-4 sm:p-5 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs shrink-0">
                ?
              </span>
              <span>{f.q}</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-7">
              {f.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
