import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../../services/api';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SendHorizontal,
  ExternalLink,
  Receipt,
  Sparkles
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

  if (!isOpen) return null;

  // Convert INR amount to USD for PayPal Sandbox checkout if needed (~85 INR = 1 USD)
  const usdAmount = (Number(amount) / 85).toFixed(2);

  // Official PayPal SDK createOrder handler
  const handleCreateOrder = async (data, actions) => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      // Attempt backend REST create-order
      const res = await api.createPayPalOrder({
        amount: Number(amount),
        currency: 'USD',
        description: `${recipient} - ${note}`
      });

      if (res && res.orderId) {
        return res.orderId;
      }

      // Fallback to actions.order.create if actions is available
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
      setPaymentError('Could not initialize PayPal order. Please check sandbox credentials or try test simulation.');
      setIsProcessing(false);
      throw err;
    }
  };

  // Official PayPal SDK onApprove handler
  const handleApprove = async (data, actions) => {
    try {
      setIsProcessing(true);
      const orderId = data.orderID;

      // Capture payment order through backend REST API
      const captureRes = await api.capturePayPalOrder({
        orderId,
        recipient,
        amount: Number(amount),
        currency: 'INR',
        note,
        recordAsTransaction: true
      });

      if (captureRes.success) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0070BA]/10 text-[#0070BA] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Pay with PayPal Sandbox</h3>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                  Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-400">Official REST API & JavaScript SDK Integration</p>
            </div>
          </div>
          <button
            onClick={() => closeModal('paypalCheckout')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {paymentSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Payment Completed!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your payment of <strong className="text-slate-900">{currencySymbol}{Number(paymentSuccess.amount).toLocaleString()}</strong> to <strong>{paymentSuccess.recipient}</strong> has been confirmed by PayPal Sandbox.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-left border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-semibold text-slate-800">{paymentSuccess.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Capture ID:</span>
                <span className="font-semibold text-emerald-700">{paymentSuccess.captureId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-sans font-bold text-[10px]">
                  {paymentSuccess.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-700">{new Date(paymentSuccess.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  closeModal('paypalCheckout');
                  openModal('receiptModal', paymentSuccess);
                }}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>View Receipt</span>
              </button>
              <button
                onClick={() => closeModal('paypalCheckout')}
                className="px-5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Recipient and Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient / Merchant
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Swiggy, Netflix, PixelCraft Studios"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1500"
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  ≈ ${usdAmount} USD in sandbox
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Note
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Invoice #1029"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>
            </div>

            {/* Mode selection tabs */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-700">Checkout Mode:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('sdk')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    checkoutMode === 'sdk' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Live PayPal SDK
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMode('simulate')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    checkoutMode === 'simulate' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  1-Click Test Sandbox
                </button>
              </div>
            </div>

            {/* Mode 1: Official PayPal SDK Buttons */}
            {checkoutMode === 'sdk' ? (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-slate-500 font-medium">PayPal Sandbox Gateway:</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    App: acsPaypal
                  </span>
                </div>

                {isProcessing && (
                  <div className="py-6 flex flex-col items-center justify-center text-xs text-slate-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
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
                        color: 'gold',
                        shape: 'rect',
                        label: 'pay',
                        height: 42
                      }}
                      createOrder={handleCreateOrder}
                      onApprove={handleApprove}
                      onError={(err) => {
                        console.warn('PayPal button error:', err);
                        setPaymentError('PayPal Checkout encountered an issue. You can use 1-Click Test Sandbox below to verify the flow.');
                      }}
                    />
                  </PayPalScriptProvider>
                </div>

                <p className="mt-2 text-[10px] text-slate-400 text-center">
                  Use your PayPal Sandbox test buyer account credentials to approve.
                </p>
              </div>
            ) : (
              /* Mode 2: Fast Sandbox Simulation */
              <div className="mt-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Instant Sandbox Simulation Checkout</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Executes the complete PayPal order creation, authorization, and capture pipeline locally. Validates order generation, updates transaction history, and links a verified Order ID.
                </p>
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing || !amount}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/30 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="w-4 h-4" />
                  )}
                  <span>Confirm Test Payment ({currencySymbol}{Number(amount).toLocaleString()})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
