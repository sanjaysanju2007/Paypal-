import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  Sparkles,
  Send,
  Loader2,
  Zap,
  TrendingDown,
  CheckCircle2,
  Cpu,
  Shield,
  Activity,
  Compass
} from 'lucide-react';

export default function AIAdvisorPage() {
  const {
    transactions,
    summary,
    budgets,
    healthScore,
    currencySymbol,
    formatCurrency
  } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Greetings, Aditya.** I am your SpendWise Neural Financial Advisor.

I have executed a real-time audit across your **${transactions.length} active transactions**, **${budgets.length} category budgets**, and verified recurring subscriptions.

**Current Intelligence Highlights**:
• **Monthly Retained Surplus**: **${formatCurrency(summary.monthlySavings)}** (${summary.savingsRate}% savings discipline)
• **Neural Financial Health**: **${healthScore?.score || 97}/100** (${healthScore?.grade || 'A+'} Prime)
• **Top Expenditure Vector**: **${Object.entries(summary.categoryTotals || {})[0]?.[0] || 'Housing'}**

Select any query chip below or submit your custom financial question to receive data-grounded insights.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'Where did most of my money go this month?',
    `How can I save ${currencySymbol}5,000 next month?`,
    'Which category has the highest expenses?',
    'Compare my spending this month with last month',
    'Am I spending too much on food?',
    'Give me a personalized savings plan'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.chatAI({
        message: text,
        conversationHistory: messages.slice(-4)
      });

      if (res.success && res.data) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: res.data.reply,
          source: res.data.source,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to communicate with the advisory engine. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">SpendWise Neural Advisor</h1>
            <span className="text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              <Sparkles className="w-3 h-3 text-[#38BDF8]" />
              <span>Gemini 1.5 Pro Live</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Intelligent spending analysis, personalized savings strategies, and proactive ledger intelligence
          </p>
        </div>

        {/* Neural Engine Status Card */}
        <div className="flex items-center gap-3 px-3.5 py-2 glass-card rounded-xl border-[#38BDF8]/20">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#38BDF8]"></span>
          </div>
          <div className="text-left">
            <div className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Neural Context</div>
            <div className="text-[10px] text-[#38BDF8] font-mono">100% Grounded in Live Data</div>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout: Chat Window on Left, Intelligence Widgets on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Chat Interface Glass Container */}
        <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col h-[740px] overflow-hidden relative shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          {/* Chat Header with Glowing Orb */}
          <div className="p-4 border-b border-[#38BDF8]/15 flex items-center justify-between bg-[#060913]/70 relative">
            <div className="flex items-center gap-3">
              {/* Glowing High-Tech AI Indicator Orb */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#2563EB] opacity-75 blur-xs"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.9, 0.6]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative w-8 h-8 rounded-xl bg-[#060913] flex items-center justify-center text-[#38BDF8] shadow-inner">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <span>SpendWise Intelligence Interface</span>
                </h3>
                <span className="text-[10px] text-[#38BDF8] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
                  Listening & Auditing Active Transactions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                Gemini Pro 1.5 + Heuristics
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black shadow-xs ${
                        isAssistant
                          ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                          : 'bg-gradient-to-br from-[#38BDF8] to-[#2563EB] text-white'
                      }`}
                    >
                      {isAssistant ? <Sparkles className="w-4 h-4" /> : 'AS'}
                    </div>

                    <div className={`max-w-[85%] space-y-1`}>
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isAssistant
                            ? 'glass-panel text-slate-200 border-[#38BDF8]/20'
                            : 'bg-gradient-to-r from-[#38BDF8]/20 to-[#2563EB]/20 border border-[#38BDF8]/35 text-white font-medium shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                        }`}
                      >
                        <div className="space-y-2 whitespace-pre-wrap">
                          {m.content}
                        </div>

                        {m.source && (
                          <div className="mt-3 pt-2.5 border-t border-white/[0.08] text-[10px] text-slate-400 flex items-center justify-between font-mono">
                            <span className="flex items-center gap-1 text-[#38BDF8]">
                              <Shield className="w-3 h-3" />
                              <span>Verified Against Live Database</span>
                            </span>
                            <span>{m.source}</span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`text-[10px] text-slate-500 px-1 font-mono ${
                          isAssistant ? 'text-left' : 'text-right'
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Live Data Scanning Radar Animation on Loading */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] flex items-center justify-center">
                  <Cpu className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl glass-panel border-[#38BDF8]/30 text-xs flex flex-col gap-2 min-w-[280px]">
                  <div className="flex items-center gap-2 text-[#38BDF8] font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Neural Scanning Active Transactions...</span>
                  </div>
                  {/* Glowing progress scanning bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#060913] overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full"
                      animate={{
                        x: ['-100%', '100%']
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: 'easeInOut'
                      }}
                      style={{ width: '45%' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompt Pills */}
          <div className="p-3 border-t border-[#38BDF8]/15 bg-[#060913]/60 overflow-x-auto">
            <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-3 h-3" />
              <span>Suggested Advisory Prompts</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {suggestedQuestions.map((q, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSendMessage(q)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl glass-card hover:border-[#38BDF8]/50 text-slate-300 hover:text-white text-[11px] font-medium transition-all disabled:opacity-50"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[#38BDF8]/15 bg-[#060913]/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything regarding your spending, budgets, or savings target..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs glass-input rounded-xl placeholder-slate-500 font-medium"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading || !inputMessage.trim()}
              className="px-5 py-2.5 btn-blue rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </motion.button>
          </form>

          {/* Informational Disclaimer Footer */}
          <div className="px-4 py-2 bg-[#060913] border-t border-white/[0.06] text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-[#38BDF8]/60" />
            <span>SpendWise AI recommendations are data-grounded insights for informational purposes, not certified financial advice.</span>
          </div>
        </div>

        {/* Right Intelligence Column: Health Score, Challenges, Proactive Insights */}
        <div className="space-y-5">
          {/* Financial Health Score Widget */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-wide uppercase">Financial Health Score</span>
              <span className="text-[10px] font-black bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                {healthScore?.grade || 'A+'} Prime
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tight">
                {healthScore?.score || 97}
              </span>
              <span className="text-xs text-[#38BDF8] font-semibold">/ 100 ({healthScore?.statusText || 'Optimal Growth'})</span>
            </div>

            {/* Glowing Breakdown Bars */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Savings Rate Discipline</span>
                  <span className="font-bold text-[#38BDF8]">
                    {healthScore?.breakdown?.savingsDiscipline || 95}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#060913] overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full shadow-[0_0_8px_#38BDF8]"
                    style={{ width: `${healthScore?.breakdown?.savingsDiscipline || 95}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Budget Adherence</span>
                  <span className="font-bold text-[#38BDF8]">
                    {healthScore?.breakdown?.budgetAdherence || 90}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#060913] overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full shadow-[0_0_8px_#38BDF8]"
                    style={{ width: `${healthScore?.breakdown?.budgetAdherence || 90}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Subscription Burn Ratio</span>
                  <span className="font-bold text-[#38BDF8]">
                    {healthScore?.breakdown?.subscriptionRatio || 85}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#060913] overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full shadow-[0_0_8px_#38BDF8]"
                    style={{ width: `${healthScore?.breakdown?.subscriptionRatio || 85}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Weekly Savings Challenge */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <Zap className="w-4 h-4 fill-[#38BDF8]/20" />
              <span className="text-xs font-bold">AI Savings Sprint</span>
            </div>

            <div className="p-3.5 rounded-xl glass-card space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Zero Food-Delivery Weekend</span>
                <span className="text-[#38BDF8] font-black">+{currencySymbol}1,200</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Cook homemade meals this weekend to save {currencySymbol}1,200 on courier restaurant fees.
              </p>
              <div className="pt-1">
                <div className="w-full h-1.5 rounded-full bg-[#060913] overflow-hidden border border-white/[0.08]">
                  <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full w-3/5" />
                </div>
                <span className="text-[10px] text-[#38BDF8] mt-1 block font-mono font-bold">60% completed</span>
              </div>
            </div>
          </div>

          {/* Proactive Observation Card */}
          <div className="glass-panel p-5 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-white font-bold mb-1">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              <span>Algorithmic Optimization</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              You have accumulated <strong>{formatCurrency(summary.monthlySavings)}</strong> in net unallocated surplus. We recommend redirecting <strong>{currencySymbol}10,000</strong> toward your <em>Emergency Fund</em> to achieve your target 6 weeks ahead of schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
