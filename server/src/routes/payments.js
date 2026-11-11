import express from 'express';
import db from '../db.js';
import payPalService from '../services/paypalService.js';

const router = express.Router();

// GET PayPal configuration & readiness status
router.get('/config', (req, res) => {
  try {
    const status = payPalService.getStatus();
    const settings = db.getSettings();

    res.json({
      success: true,
      clientId: status.fullClientId,
      clientIdPreview: status.clientIdPreview,
      hasSecret: status.hasClientSecret,
      mode: 'sandbox',
      appName: settings.paypalAppName || 'acsPaypal',
      currency: settings.currency || 'INR',
      currencySymbol: settings.currencySymbol || '₹',
      status: status.mode,
      description: status.description
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create PayPal order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'USD', description = 'SpendWise AI Checkout' } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }

    const orderResult = await payPalService.createOrder({ amount, currency, description });
    res.json(orderResult);
  } catch (error) {
    console.error('Create order route error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST capture PayPal order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId, recipient, amount, currency = 'INR', note, recordAsTransaction = true } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const captureResult = await payPalService.captureOrder(orderId);

    if (captureResult.success) {
      // Record payment in payments collection
      const paymentRecord = {
        id: `pay-${Date.now().toString().slice(-6)}`,
        orderId: captureResult.orderId,
        captureId: captureResult.captureId,
        recipient: recipient || 'PayPal Sandbox Merchant',
        amount: Number(amount) || 1500,
        currency: currency || 'INR',
        status: captureResult.status || 'COMPLETED',
        type: 'OUTGOING',
        timestamp: new Date().toISOString(),
        payerEmail: 'sb-buyer@personal.example.com',
        note: note || 'SpendWise Sandbox Payment'
      };

      db.addItem('payments', paymentRecord);

      // Record corresponding transaction in transactions list
      if (recordAsTransaction) {
        db.addItem('transactions', {
          id: `tx-pp-${Date.now().toString().slice(-6)}`,
          description: `PayPal: ${paymentRecord.recipient}`,
          category: 'Payment Transfer',
          type: 'expense',
          amount: paymentRecord.amount,
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'PayPal Sandbox',
          status: 'Completed',
          paypalOrderId: captureResult.orderId,
          notes: note || `Verified PayPal Order ID: ${captureResult.orderId}`
        });
      }

      return res.json({
        success: true,
        orderId: captureResult.orderId,
        captureId: captureResult.captureId,
        status: captureResult.status,
        payment: paymentRecord,
        mode: captureResult.mode
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'PayPal capture was not successful',
        details: captureResult
      });
    }
  } catch (error) {
    console.error('Capture order route error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET payment history
router.get('/history', (req, res) => {
  try {
    const payments = db.get('payments');
    payments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST simulate payment (Instant sandbox testing tool)
router.post('/simulate-test-payment', (req, res) => {
  try {
    const { recipient, amount, note, currency = 'INR' } = req.body;
    const numAmount = Math.abs(Number(amount)) || 1200;
    const fakeOrderId = `ORDER-SB-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 899 + 100)}`;
    const fakeCapId = `CAP-SB-${Math.floor(Math.random() * 899999 + 100000)}`;

    const paymentRecord = {
      id: `pay-${Date.now().toString().slice(-6)}`,
      orderId: fakeOrderId,
      captureId: fakeCapId,
      recipient: recipient || 'Cloudflare CDN Services',
      amount: numAmount,
      currency,
      status: 'COMPLETED',
      type: 'OUTGOING',
      timestamp: new Date().toISOString(),
      payerEmail: 'sb-aditya-test@personal.example.com',
      note: note || 'Live Sandbox test execution'
    };

    db.addItem('payments', paymentRecord);

    db.addItem('transactions', {
      id: `tx-pp-${Date.now().toString().slice(-6)}`,
      description: `PayPal Sandbox: ${paymentRecord.recipient}`,
      category: 'Utilities',
      type: 'expense',
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'PayPal Sandbox',
      status: 'Completed',
      paypalOrderId: fakeOrderId,
      notes: `Captured via PayPal Sandbox Order ${fakeOrderId}`
    });

    res.json({
      success: true,
      message: 'PayPal Sandbox payment simulated & captured successfully',
      payment: paymentRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

