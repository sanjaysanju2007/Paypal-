import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all goals
router.get('/', (req, res) => {
  try {
    const goals = db.get('goals');
    const goalsWithStats = goals.map(g => {
      const target = Number(g.targetAmount || 0);
      const current = Number(g.currentAmount || 0);
      const percentage = target > 0 ? Math.min(100, Number(((current / target) * 100).toFixed(1))) : 0;
      const remaining = Math.max(0, target - current);
      return {
        ...g,
        percentage,
        remaining,
        isCompleted: current >= target
      };
    });

    const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount || 0), 0);
    const totalSaved = goals.reduce((s, g) => s + Number(g.currentAmount || 0), 0);

    res.json({
      success: true,
      data: goalsWithStats,
      meta: {
        totalTarget,
        totalSaved,
        overallPercentage: totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create goal
router.post('/', (req, res) => {
  try {
    const { name, targetAmount, currentAmount = 0, targetDate, category = 'General', color = '#10B981' } = req.body;
    if (!name || !targetAmount) {
      return res.status(400).json({ success: false, message: 'Goal name and target amount are required' });
    }

    const newGoal = {
      id: `g-${Date.now().toString().slice(-6)}`,
      name,
      targetAmount: Math.abs(Number(targetAmount)),
      currentAmount: Math.abs(Number(currentAmount)),
      targetDate: targetDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      category,
      color,
      createdAt: new Date().toISOString()
    };

    db.addItem('goals', newGoal);
    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST deposit into goal
router.post('/:id/deposit', (req, res) => {
  try {
    const { id } = req.params;
    const { amount, recordTransaction = true } = req.body;
    const numAmount = Math.abs(Number(amount));

    if (!numAmount || isNaN(numAmount)) {
      return res.status(400).json({ success: false, message: 'Valid deposit amount is required' });
    }

    const goals = db.get('goals');
    const goal = goals.find(g => g.id === id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    const newCurrent = Number(goal.currentAmount || 0) + numAmount;
    const updated = db.updateItem('goals', id, { currentAmount: newCurrent });

    // Optionally record a transaction
    if (recordTransaction) {
      db.addItem('transactions', {
        id: `tx-dep-${Date.now().toString().slice(-6)}`,
        description: `Savings Goal Contribution: ${goal.name}`,
        category: 'Savings',
        type: 'expense',
        amount: numAmount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        status: 'Completed',
        notes: `Manual allocation to goal "${goal.name}"`
      });
    }

    res.json({
      success: true,
      data: updated,
      message: `Successfully allocated deposit to ${goal.name}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update goal
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.targetAmount) updates.targetAmount = Math.abs(Number(updates.targetAmount));
    if (updates.currentAmount) updates.currentAmount = Math.abs(Number(updates.currentAmount));

    const updated = db.updateItem('goals', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE goal
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteItem('goals', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

