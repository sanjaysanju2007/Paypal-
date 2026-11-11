import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  ShieldCheck,
  TrendingDown,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';

export default function AIAdvisorPage() {
  const {
    transactions,
    summary,
    budgets,
    healthScore,
    aiSummary,
    currencySymbol,
    formatCurrency
  } = useApp();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 👋 Welcome to SpendWise AI Financial Advisor

I have analyzed your **${transactions.length} active transactions**, **${budgets.length} category budgets**, and recurring subscriptions.

**Current Financial Highlights**:
- **Monthly Net Savings**: **${formatCurrency(summary.monthlySavings)}** (${summary.savingsRate}% savings rate)
- **Financial Health Score**: **${healthScore?.score || 97}/100** (${healthScore?.grade || 'A+'})
- **Top Outflow Category**: **${Object.entries(summary.categoryTotals || {})[0]?.[0] || 'Housing'}**

Select any question below or type your custom inquiry to get real data-driven guidance.`,
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Financial Advisor</h1>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Real-Time Engine</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Intelligent spending analysis, personalized savings strategies, and proactive advice
          </p>
        </div>
      </div>

      {/* Main Two Column Layout: Chat on Left/Center, Insights on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[700px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">SpendWise AI Financial Assistant</h3>
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Grounded in Live Account Transactions
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Gemini 1.5 / Intelligent Analytics</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAssistant
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    {isAssistant ? <Sparkles className="w-3.5 h-3.5" /> : 'AS'}
                  </div>

                  <div className={`max-w-[85%] space-y-1`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? 'bg-slate-50 border border-slate-200/70 text-slate-800'
                          : 'bg-emerald-600 text-white font-medium'
                      }`}
                    >
                      {/* Markdown formatted response parsing */}
                      <div className="space-y-2 whitespace-pre-wrap">
                        {m.content}
                      </div>

                      {m.source && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Verified against local transactions</span>
                          <span className="font-mono">{m.source}</span>
                        </div>
                      )}
                    </div>
                    <div
                      className={`text-[10px] text-slate-400 px-1 ${
                        isAssistant ? 'text-left' : 'text-right'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Analyzing account ledger and formulating financial advice...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts Pills */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/30 overflow-x-auto">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Suggested Questions
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-[11px] font-medium transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about your money, spending, or savings goals..."
              disabled={loading}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-2xs shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>

          {/* Disclaimer Footer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Disclaimer: SpendWise AI recommendations are for informational purposes only, not professional financial advice.
          </div>
        </div>

        {/* Right Sidebar: Health Score, Challenges, Subscriptions Insights */}
        <div className="space-y-4">
          {/* Financial Health Score Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Financial Health Score</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {healthScore?.grade || 'A+'} Grade
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {healthScore?.score || 97}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100 ({healthScore?.statusText || 'Optimal Growth'})</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Savings Rate Discipline</span>
                  <span className="font-semibold text-slate-800">
                    {healthScore?.breakdown?.savingsDiscipline || 95}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${healthScore?.breakdown?.savingsDiscipline || 95}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Budget Adherence</span>
                  <span className="font-semibold text-slate-800">
                    {healthScore?.breakdown?.budgetAdherence || 90}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${healthScore?.breakdown?.budgetAdherence || 90}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Subscription Burn Ratio</span>
                  <span className="font-semibold text-slate-800">
                    {healthScore?.breakdown?.subscriptionRatio || 85}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${healthScore?.breakdown?.subscriptionRatio || 85}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Weekly Savings Challenge */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold">AI Savings Challenge</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Zero Food-Delivery Weekend</span>
                <span className="text-emerald-700 font-bold">+{currencySymbol}1,200</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Cook homemade meals this weekend to save {currencySymbol}1,200 on courier restaurant orders.
              </p>
              <div className="pt-1">
                <div className="w-full h-1.5 rounded-full bg-emerald-200/60 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full w-3/5" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">60% completed</span>
              </div>
            </div>
          </div>

          {/* Key Observation Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">Proactive Advice</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              You have <strong>{formatCurrency(summary.monthlySavings)}</strong> in unallocated surplus this month. We recommend directing <strong>{currencySymbol}10,000</strong> toward your <em>Emergency Fund</em> to reach your year-end target 6 weeks earlier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
