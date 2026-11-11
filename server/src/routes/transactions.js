import express from 'express';
import db from '../db.js';
import geminiService from '../services/geminiService.js';

const router = express.Router();

// GET all transactions with filters
router.get('/', (req, res) => {
  try {
    let list = db.get('transactions');
    const { type, category, search, sortBy, order = 'desc', startDate, endDate } = req.query;

    if (type && type !== 'all') {
      list = list.filter(t => t.type.toLowerCase() === type.toLowerCase());
    }

    if (category && category !== 'all') {
      list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    if (startDate) {
      list = list.filter(t => t.date >= startDate);
    }
    if (endDate) {
      list = list.filter(t => t.date <= endDate);
    }

    if (sortBy === 'amount') {
      list.sort((a, b) => order === 'asc' ? a.amount - b.amount : b.amount - a.amount);
    } else {
      // default sort by date
      list.sort((a, b) => order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET summary metrics
router.get('/summary', (req, res) => {
  try {
    const list = db.get('transactions');
    const settings = db.getSettings();

    const totalIncome = list
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    const totalExpense = list
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    const totalBalance = totalIncome - totalExpense;
    const monthlySavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((monthlySavings / totalIncome) * 100).toFixed(1) : 0;

    // Category breakdown
    const categoryTotals = {};
    list.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount || 0);
    });

    res.json({
      success: true,
      data: {
        totalBalance,
        totalIncome,
        totalExpense,
        monthlySavings,
        savingsRate: Number(savingsRate),
        currency: settings.currency,
        currencySymbol: settings.currencySymbol,
        categoryTotals
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST add transaction
router.post('/', (req, res) => {
  try {
    const { description, amount, type, category, date, paymentMethod, status = 'Completed', notes, paypalOrderId } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ success: false, message: 'Description and amount are required' });
    }

    // Auto categorize if missing or general
    let finalCategory = category;
    let finalType = type;
    if (!finalCategory || finalCategory === 'Uncategorized') {
      const suggested = geminiService.categorizeTransaction(description, amount);
      finalCategory = suggested.category;
      if (!finalType) finalType = suggested.type;
    }

    const newTx = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      description,
      amount: Math.abs(Number(amount)),
      type: finalType || 'expense',
      category: finalCategory || 'General Expenses',
      date: date || new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Bank Transfer',
      status: status || 'Completed',
      notes: notes || '',
      paypalOrderId: paypalOrderId || null,
      createdAt: new Date().toISOString()
    };

    db.addItem('transactions', newTx);
    res.status(201).json({ success: true, data: newTx });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update transaction
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.amount) updates.amount = Math.abs(Number(updates.amount));

    const updated = db.updateItem('transactions', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE transaction
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteItem('transactions', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
