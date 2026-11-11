import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all recurring payments with subscription analysis
router.get('/', (req, res) => {
  try {
    const recurring = db.get('recurring');
    const transactions = db.get('transactions');

    const totalMonthlyRecurring = recurring
      .filter(r => r.status === 'Active')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    // Subscription Detector algorithm: find repeated transactions or known digital merchants
    const detectedPatterns = [];
    const merchantMap = {};
    
    transactions.forEach(t => {
      const descLower = t.description.toLowerCase();
      const detectedBrand = [
        'netflix', 'spotify', 'aws', 'amazon prime', 'cult.fit', 'gym', 
        'chatgpt', 'github', 'icloud', 'airtel', 'hotstar', 'youtube premium'
      ].find(b => descLower.includes(b));

      if (detectedBrand) {
        if (!merchantMap[detectedBrand]) {
          merchantMap[detectedBrand] = { count: 0, total: 0, latestTx: t };
        }
        merchantMap[detectedBrand].count += 1;
        merchantMap[detectedBrand].total += Number(t.amount || 0);
      }
    });

    Object.entries(merchantMap).forEach(([brand, data]) => {
      detectedPatterns.push({
        brand: brand.toUpperCase(),
        occurrenceCount: data.count,
        latestAmount: data.latestTx.amount,
        latestDate: data.latestTx.date,
        isConfigured: recurring.some(r => r.name.toLowerCase().includes(brand))
      });
    });

    res.json({
      success: true,
      data: recurring,
      meta: {
        totalMonthlyRecurring,
        activeSubscriptionsCount: recurring.filter(r => r.status === 'Active').length,
        detectedPatterns
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create recurring payment
router.post('/', (req, res) => {
  try {
    const { name, category, amount, frequency = 'Monthly', billingCycleDate = 1, paymentMethod = 'PayPal Sandbox', autoPay = true } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ success: false, message: 'Name and amount are required' });
    }

    const newRecurring = {
      id: `rec-${Date.now().toString().slice(-6)}`,
      name,
      category: category || 'Utilities',
      amount: Math.abs(Number(amount)),
      frequency,
      billingCycleDate: Number(billingCycleDate) || 1,
      paymentMethod,
      status: 'Active',
      autoPay: Boolean(autoPay)
    };

    db.addItem('recurring', newRecurring);
    res.status(201).json({ success: true, data: newRecurring });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update recurring payment
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.amount) updates.amount = Math.abs(Number(updates.amount));

    const updated = db.updateItem('recurring', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Recurring item not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE recurring payment
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteItem('recurring', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Recurring item not found' });
    }
    res.json({ success: true, message: 'Recurring item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
