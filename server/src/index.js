import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import transactionsRouter from './routes/transactions.js';
import budgetsRouter from './routes/budgets.js';
import goalsRouter from './routes/goals.js';
import recurringRouter from './routes/recurring.js';
import paymentsRouter from './routes/payments.js';
import aiRouter from './routes/ai.js';
import analyticsRouter from './routes/analytics.js';
import settingsRouter from './routes/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  }
  next();
});

// API Routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/recurring', recurringRouter);
app.use('/api/paypal', paymentsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'SpendWise AI',
    timestamp: new Date().toISOString(),
    sandbox: {
      clientConfigured: Boolean(process.env.PAYPAL_CLIENT_ID),
      appName: 'acsPaypal'
    }
  });
});

// Serve frontend production build if available
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 SpendWise AI Server running on port ${PORT}`);
  console.log(`💳 PayPal App: acsPaypal`);
  console.log(`🔑 Client ID: ${process.env.PAYPAL_CLIENT_ID ? 'Configured (' + process.env.PAYPAL_CLIENT_ID.slice(0, 10) + '...)' : 'Default'}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
