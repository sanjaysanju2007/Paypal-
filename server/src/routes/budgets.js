import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all budgets with live spending calculations
router.get('/', (req, res) => {
  try {
    const budgets = db.get('budgets');
    const transactions = db.get('transactions');
    const settings = db.getSettings();

    // Calculate current spending for each budget category
    const budgetsWithProgress = budgets.map(b => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase())
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      const limit = Number(b.limit || 0);
      const remaining = Math.max(0, limit - spent);
      const percentage = limit > 0 ? Number(((spent / limit) * 100).toFixed(1)) : 0;
      const isOverBudget = spent > limit;
      const isNearLimit = percentage >= (settings.monthlyBudgetAlertThreshold || 85);

      return {
        ...b,
        spent,
        remaining,
        percentage,
        isOverBudget,
        isNearLimit
      };
    });

    const totalBudgetLimit = budgets.reduce((s, b) => s + Number(b.limit || 0), 0);
    const totalSpentInBudgets = budgetsWithProgress.reduce((s, b) => s + b.spent, 0);

    res.json({
      success: true,
      data: budgetsWithProgress,
      meta: {
        totalBudgetLimit,
        totalSpentInBudgets,
        overallPercentage: totalBudgetLimit > 0 ? ((totalSpentInBudgets / totalBudgetLimit) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create budget
router.post('/', (req, res) => {
  try {
    const { category, limit, period = 'Monthly', color = '#10B981', icon = 'Wallet' } = req.body;
    if (!category || !limit) {
      return res.status(400).json({ success: false, message: 'Category and limit are required' });
    }

    const newBudget = {
      id: `b-${Date.now().toString().slice(-6)}`,
      category,
      limit: Math.abs(Number(limit)),
      period,
      color,
      icon
    };

    db.addItem('budgets', newBudget);
    res.status(201).json({ success: true, data: newBudget });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update budget
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.limit) updates.limit = Math.abs(Number(updates.limit));

    const updated = db.updateItem('budgets', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE budget
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteItem('budgets', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

