import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET settings
router.get('/', (req, res) => {
  try {
    const settings = db.getSettings();
    // Mask sensitive secret
    const masked = {
      ...settings,
      paypalClientSecret: settings.paypalClientSecret ? '••••••••••••••••' : ''
    };
    res.json({ success: true, data: masked });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update settings
router.put('/', (req, res) => {
  try {
    const updates = req.body;
    // Map currency symbols
    if (updates.currency) {
      if (updates.currency === 'USD') updates.currencySymbol = '$';
      else if (updates.currency === 'EUR') updates.currencySymbol = '€';
      else if (updates.currency === 'GBP') updates.currencySymbol = '£';
      else updates.currencySymbol = '₹';
    }

    const updated = db.updateSettings(updates);
    res.json({ success: true, data: updated, message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

