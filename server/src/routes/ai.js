import express from 'express';
import db from '../db.js';
import geminiService from '../services/geminiService.js';

const router = express.Router();

// POST chat with AI Financial Advisor
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const advisorResult = await geminiService.askAdvisor(message, conversationHistory);

    res.json({
      success: true,
      data: advisorResult,
      disclaimer: 'SpendWise AI recommendations are for informational purposes only, not certified financial advice.'
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST auto-categorize transaction description
router.post('/categorize', (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    const result = geminiService.categorizeTransaction(description, amount);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET financial health score
router.get('/health-score', (req, res) => {
  try {
    const transactions = db.get('transactions');
    const budgets = db.get('budgets');
    const recurring = db.get('recurring');

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount || 0), 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Component scores (0-100)
    // 1. Savings Score (Target 30% savings = 100)
    const savingsScore = Math.min(100, Math.max(20, Math.round((savingsRate / 30) * 100)));

    // 2. Budget Discipline
    const overBudgetCount = budgets.filter(b => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase())
        .reduce((s, t) => s + Number(t.amount || 0), 0);
      return spent > Number(b.limit || 0);
    }).length;
    const budgetScore = Math.max(30, 100 - overBudgetCount * 18);

    // 3. Recurring Expense Ratio (<15% of income = 100)
    const monthlyRecurring = recurring.filter(r => r.status === 'Active').reduce((s, r) => s + Number(r.amount || 0), 0);
    const recurringRatio = totalIncome > 0 ? (monthlyRecurring / totalIncome) * 100 : 25;
    const recurringScore = Math.min(100, Math.max(30, Math.round(100 - (recurringRatio / 15) * 30)));

    // Composite Score
    const overallScore = Math.round(savingsScore * 0.45 + budgetScore * 0.35 + recurringScore * 0.20);
    let grade = 'A';
    let statusText = 'Excellent';
    if (overallScore < 60) {
      grade = 'Needs Attention';
      statusText = 'High Burn Rate';
    } else if (overallScore < 75) {
      grade = 'Fair';
      statusText = 'Moderate Health';
    } else if (overallScore < 85) {
      grade = 'Good';
      statusText = 'Healthy Discipline';
    } else {
      grade = 'A+';
      statusText = 'Optimal Growth';
    }

    res.json({
      success: true,
      data: {
        score: overallScore,
        grade,
        statusText,
        breakdown: {
          savingsDiscipline: savingsScore,
          budgetAdherence: budgetScore,
          subscriptionRatio: recurringScore
        },
        metrics: {
          savingsRate: Number(savingsRate.toFixed(1)),
          monthlyRecurring,
          overBudgetCategories: overBudgetCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET AI financial summary & observations
router.get('/summary', (req, res) => {
  try {
    const rawData = db.read();
    const insights = rawData.aiInsights || {};
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
