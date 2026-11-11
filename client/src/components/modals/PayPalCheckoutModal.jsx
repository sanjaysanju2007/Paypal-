import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import {
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SendHorizontal,
  Receipt,
  Sparkles,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function PayPalCheckoutModal() {
  const { modalState, closeModal, refreshAll, currencySymbol, openModal, paypalConfig } = useApp();
  const isOpen = Boolean(modalState.paypalCheckout);
  const initialData = modalState.paypalInitialData || {};

  const [recipient, setRecipient] = useState('Netflix Services');
  const [amount, setAmount] = useState('1500');
  const [note, setNote] = useState('Payment via SpendWise AI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [checkoutMode, setCheckoutMode] = useState('sdk'); // 'sdk' or 'simulate'

  const clientId = paypalConfig?.clientId || 'BAAmDmQ9iyFIWvwF3CYwoqPk6itcyayF1KmLuoOqD23jaXrKaPddNrU4N1Tig3_p8OBaKKh1Uc0ipt-rC4';

  useEffect(() => {
    if (initialData) {
      if (initialData.recipient) setRecipient(initialData.recipient);
      if (initialData.amount) setAmount(String(initialData.amount));
      if (initialData.note) setNote(initialData.note);
    }
    setPaymentSuccess(null);
    setPaymentError(null);
    setIsProcessing(false);
  }, [isOpen, initialData]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#2563EB', '#60A5FA', '#FFFFFF']
      });
    } catch (e) {
      // safe fallback
    }
  };

  if (!isOpen) return null;

  const usdAmount = (Number(amount) / 85).toFixed(2);

  const handleCreateOrder = async (data, actions) => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      const res = await api.createPayPalOrder({
        amount: Number(amount),
        currency: 'USD',
        description: `${recipient} - ${note}`
      });

      if (res && res.orderId) {
        return res.orderId;
      }

      if (actions?.order) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: Math.max(1, Number(usdAmount) || 1).toString(),
                currency_code: 'USD'
              },
              description: `SpendWise: ${recipient}`
            }
          ]
        });
      }
      throw new Error('Could not initialize PayPal order');
    } catch (err) {
      console.error('PayPal createOrder failed:', err);
      setPaymentError('Could not initialize PayPal order. Check sandbox credentials or use 1-Click Test Sandbox.');
      setIsProcessing(false);
      throw err;
    }
  };

  const handleApprove = async (data, actions) => {
    try {
      setIsProcessing(true);
      const orderId = data.orderID;

      const captureRes = await api.capturePayPalOrder({
        orderId,
        recipient,
        amount: Number(amount),
        currency: 'INR',
        note,
        recordAsTransaction: true
      });

      if (captureRes.success) {
        triggerConfetti();
        setPaymentSuccess({
          orderId: captureRes.orderId,
          captureId: captureRes.captureId,
          amount: Number(amount),
          recipient,
          status: captureRes.status,
          timestamp: new Date().toISOString()
        });
        refreshAll();
      } else {
        setPaymentError('Payment capture was rejected by PayPal Sandbox.');
      }
    } catch (err) {
      console.error('Capture failed:', err);
      setPaymentError(err.message || 'Payment approval capture failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      const res = await api.simulateTestPayment({
        recipient,
        amount: Number(amount),
        note,
        currency: 'INR'
      });

      if (res.success && res.payment) {
        triggerConfetti();
        setPaymentSuccess({
          orderId: res.payment.orderId,
          captureId: res.payment.captureId,
          amount: res.payment.amount,
          recipient: res.payment.recipient,
          status: res.payment.status,
          timestamp: res.payment.timestamp
        });
        refreshAll();
      }
    } catch (err) {
      setPaymentError(err.message || 'Simulation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel-elevated rounded-3xl w-full max-w-lg overflow-hidden text-[#10233F] dark:text-white relative shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-blue-500/25 dark:border-[#38BDF8]/25"
      >
        {/* Subtle Ambient Glow behind Header */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#38BDF8]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-blue-500/15 dark:border-white/[0.08] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#2563EB] text-white flex items-center justify-center font-black shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <CreditCard className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-[#10233F] dark:text-white text-base">PayPal Sandbox Checkout</h3>
                <span className="text-[10px] font-mono font-bold bg-[#38BDF8]/15 text-[#2563EB] dark:text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
                  acsPaypal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Official REST v2 & JavaScript SDK</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('paypalCheckout')}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#10233F] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {paymentSuccess ? (
          <div className="p-6 text-center space-y-4 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-16 h-16 bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(56,189,248,0.4)]"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>
            <div>
              <h4 className="text-xl font-black text-white">Payment Confirmed!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your payment of <strong className="text-[#38BDF8]">{currencySymbol}{Number(paymentSuccess.amount).toLocaleString()}</strong> to <strong className="text-white">{paymentSuccess.recipient}</strong> has been synchronously captured by PayPal Sandbox.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-bold text-slate-200 select-all">{paymentSuccess.orderId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Capture ID:</span>
                <span className="font-bold text-[#38BDF8] select-all">{paymentSuccess.captureId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 bg-[#38BDF8]/15 text-[#38BDF8] rounded-full font-bold text-[10px] border border-[#38BDF8]/25">
                  {paymentSuccess.status}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{new Date(paymentSuccess.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  closeModal('paypalCheckout');
                  openModal('receiptModal', paymentSuccess);
                }}
                className="px-4 py-2.5 glass-card hover:border-[#38BDF8]/50 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Receipt className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>View Digital Receipt</span>
              </button>
              <button
                onClick={() => closeModal('paypalCheckout')}
                className="px-6 py-2.5 btn-blue rounded-xl text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4 relative z-10">
            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Recipient & Amount Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Recipient / Merchant
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Swiggy, Netflix, AWS Services"
                className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1500"
                  className="w-full px-4 py-2.5 text-xs font-bold text-[#38BDF8] glass-input rounded-xl"
                />
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                  ≈ ${usdAmount} USD in sandbox
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                  Reference Note
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Invoice #2041"
                  className="w-full px-4 py-2.5 text-xs glass-input rounded-xl"
                />
              </div>
            </div>

            {/* Checkout Mode Toggle */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Checkout Mode:</span>
              <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-[#060913] p-1 rounded-xl border border-blue-500/15 dark:border-white/[0.08] text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('sdk')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    checkoutMode === 'sdk' 
                      ? 'bg-[#2563EB] dark:bg-[#38BDF8] text-white dark:text-[#060913] shadow-[0_0_10px_rgba(37,99,235,0.3)] dark:shadow-[0_0_10px_rgba(56,189,248,0.4)]' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#10233F] dark:hover:text-white'
                  }`}
                >
                  Live PayPal SDK
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMode('simulate')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    checkoutMode === 'simulate' 
                      ? 'bg-[#2563EB] dark:bg-[#38BDF8] text-white dark:text-[#060913] shadow-[0_0_10px_rgba(37,99,235,0.3)] dark:shadow-[0_0_10px_rgba(56,189,248,0.4)]' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#10233F] dark:hover:text-white'
                  }`}
                >
                  1-Click Test Sandbox
                </button>
              </div>
            </div>

            {/* Mode 1: Official PayPal SDK Buttons */}
            {checkoutMode === 'sdk' ? (
              <div className="mt-3 p-4 rounded-2xl glass-card border-[#38BDF8]/20">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-slate-300 font-medium">PayPal Sandbox Gateway:</span>
                  <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
                    App: acsPaypal
                  </span>
                </div>

                {isProcessing && (
                  <div className="py-6 flex flex-col items-center justify-center text-xs text-slate-300 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#38BDF8]" />
                    <span>Communicating with PayPal Sandbox servers...</span>
                  </div>
                )}

                <div className={isProcessing ? 'hidden' : 'block'}>
                  <PayPalScriptProvider
                    options={{
                      'client-id': clientId,
                      currency: 'USD',
                      intent: 'capture'
                    }}
                  >
                    <PayPalButtons
                      style={{
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        label: 'pay',
                        height: 42
                      }}
                      createOrder={handleCreateOrder}
                      onApprove={handleApprove}
                      onError={(err) => {
                        console.warn('PayPal button error:', err);
                        setPaymentError('PayPal Checkout encountered an issue. You can use 1-Click Test Sandbox to verify the flow.');
                      }}
                    />
                  </PayPalScriptProvider>
                </div>

                <p className="mt-2 text-[10px] text-slate-400 text-center font-mono">
                  Sign in with your PayPal Sandbox buyer credentials to approve.
                </p>
              </div>
            ) : (
              /* Mode 2: Instant Test Sandbox Simulation */
              <div className="mt-3 p-4 rounded-2xl glass-card border-[#38BDF8]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold">
                  <Sparkles className="w-4 h-4 fill-[#38BDF8]/20" />
                  <span>Instant Sandbox Simulation Checkout</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Executes the complete PayPal order creation and backend REST capture pipeline synchronously.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSimulatePayment}
                  disabled={isProcessing || !amount}
                  className="w-full py-2.5 px-4 btn-blue rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="w-4 h-4" />
                  )}
                  <span>Authorize & Capture ({currencySymbol}{Number(amount).toLocaleString()})</span>
                </motion.button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
