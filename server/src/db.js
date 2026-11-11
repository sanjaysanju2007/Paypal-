import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initialData = {
  settings: {
    currency: 'INR',
    currencySymbol: '₹',
    appName: 'SpendWise AI',
    paypalAppName: 'acsPaypal',
    paypalClientId: process.env.PAYPAL_CLIENT_ID || 'BAAmDmQ9iyFIWvwF3CYwoqPk6itcyayF1KmLuoOqD23jaXrKaPddNrU4N1Tig3_p8OBaKKh1Uc0ipt-rC4',
    paypalMode: 'sandbox',
    monthlyBudgetAlertThreshold: 85, // percent
    user: {
      name: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      accountNumber: '•••• •••• 8829',
      tier: 'SpendWise Pro'
    }
  },
  transactions: [
    {
      id: 'tx-001',
      description: 'TechCorp Solutions - Monthly Salary',
      category: 'Salary',
      type: 'income',
      amount: 125000,
      date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      notes: 'Monthly direct salary deposit'
    },
    {
      id: 'tx-002',
      description: 'Fintech UI Design Consulting',
      category: 'Freelance',
      type: 'income',
      amount: 34500,
      date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'PayPal Sandbox',
      status: 'Completed',
      paypalOrderId: 'ORDER-SB-9928192',
      notes: 'Payment for UX prototype delivered'
    },
    {
      id: 'tx-003',
      description: 'Prestige Heights - Apartment Rent',
      category: 'Housing',
      type: 'expense',
      amount: 32000,
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      notes: 'Monthly rent for 2BHK'
    },
    {
      id: 'tx-004',
      description: 'Nature Basket Organic Groceries',
      category: 'Groceries',
      type: 'expense',
      amount: 4850,
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      status: 'Completed',
      notes: 'Weekly fresh groceries'
    },
    {
      id: 'tx-005',
      description: 'Blue Tokai Specialty Coffee & Brunch',
      category: 'Food & Dining',
      type: 'expense',
      amount: 1450,
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'UPI',
      status: 'Completed',
      notes: 'Weekend cafe work session'
    },
    {
      id: 'tx-006',
      description: 'Swiggy Gourmet Dinner Order',
      category: 'Food & Dining',
      type: 'expense',
      amount: 1820,
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'PayPal Sandbox',
      status: 'Completed',
      paypalOrderId: 'ORDER-SB-4401892',
      notes: 'Dinner delivery with friends'
    },
    {
      id: 'tx-007',
      description: 'Amazon Web Services Cloud Hosting',
      category: 'Utilities',
      type: 'expense',
      amount: 3400,
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      status: 'Completed',
      notes: 'EC2 and S3 instances'
    },
    {
      id: 'tx-008',
      description: 'Netflix 4K Premium Plan',
      category: 'Entertainment',
      type: 'expense',
      amount: 649,
      date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'PayPal Sandbox',
      status: 'Completed',
      paypalOrderId: 'ORDER-SB-7718291',
      notes: 'Monthly subscription'
    },
    {
      id: 'tx-009',
      description: 'Cult.fit Gym & Fitness Membership',
      category: 'Health & Fitness',
      type: 'expense',
      amount: 2499,
      date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Debit Card',
      status: 'Completed',
      notes: 'Monthly gym fee'
    },
    {
      id: 'tx-010',
      description: 'Uber Premier City Commute',
      category: 'Transportation',
      type: 'expense',
      amount: 890,
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'UPI',
      status: 'Completed',
      notes: 'Airport cab'
    },
    {
      id: 'tx-011',
      description: 'Zara Autumn Jacket & Shirt',
      category: 'Shopping',
      type: 'expense',
      amount: 5200,
      date: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      status: 'Completed',
      notes: 'Weekend shopping'
    },
    {
      id: 'tx-012',
      description: 'Tata Power Electricity Bill',
      category: 'Utilities',
      type: 'expense',
      amount: 2350,
      date: new Date(Date.now() - 13 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      notes: 'Monthly electricity bill'
    },
    {
      id: 'tx-013',
      description: 'Mutual Fund Dividend Payout',
      category: 'Investments',
      type: 'income',
      amount: 4200,
      date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
      notes: 'Nifty 50 Index dividend'
    },
    {
      id: 'tx-014',
      description: 'Spotify Family Subscription',
      category: 'Entertainment',
      type: 'expense',
      amount: 179,
      date: new Date(Date.now() - 16 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'PayPal Sandbox',
      status: 'Completed',
      paypalOrderId: 'ORDER-SB-1192831',
      notes: 'Monthly music streaming'
    }
  ],
  budgets: [
    {
      id: 'b-001',
      category: 'Food & Dining',
      limit: 10000,
      period: 'Monthly',
      color: '#10B981',
      icon: 'Utensils'
    },
    {
      id: 'b-002',
      category: 'Housing',
      limit: 35000,
      period: 'Monthly',
      color: '#3B82F6',
      icon: 'Home'
    },
    {
      id: 'b-003',
      category: 'Groceries',
      limit: 9000,
      period: 'Monthly',
      color: '#14B8A6',
      icon: 'ShoppingBag'
    },
    {
      id: 'b-004',
      category: 'Shopping',
      limit: 8000,
      period: 'Monthly',
      color: '#F59E0B',
      icon: 'Tag'
    },
    {
      id: 'b-005',
      category: 'Utilities',
      limit: 7500,
      period: 'Monthly',
      color: '#8B5CF6',
      icon: 'Zap'
    },
    {
      id: 'b-006',
      category: 'Entertainment',
      limit: 4000,
      period: 'Monthly',
      color: '#EC4899',
      icon: 'Film'
    },
    {
      id: 'b-007',
      category: 'Transportation',
      limit: 4500,
      period: 'Monthly',
      color: '#6366F1',
      icon: 'Car'
    }
  ],
  goals: [
    {
      id: 'g-001',
      name: 'Emergency Fund (6 Months)',
      targetAmount: 300000,
      currentAmount: 195000,
      targetDate: '2027-03-31',
      category: 'Security',
      color: '#10B981'
    },
    {
      id: 'g-002',
      name: 'Apple MacBook Pro M3 Max',
      targetAmount: 220000,
      currentAmount: 165000,
      targetDate: '2026-12-15',
      category: 'Tech & Work',
      color: '#06B6D4'
    },
    {
      id: 'g-003',
      name: 'Bali Retreat & Travel',
      targetAmount: 110000,
      currentAmount: 72000,
      targetDate: '2027-02-20',
      category: 'Vacation',
      color: '#F59E0B'
    },
    {
      id: 'g-004',
      name: 'High-Yield Dividend Portfolio',
      targetAmount: 500000,
      currentAmount: 240000,
      targetDate: '2027-08-01',
      category: 'Wealth',
      color: '#8B5CF6'
    }
  ],
  recurring: [
    {
      id: 'rec-001',
      name: 'Netflix 4K Premium',
      category: 'Entertainment',
      amount: 649,
      frequency: 'Monthly',
      billingCycleDate: 15,
      paymentMethod: 'PayPal Sandbox',
      status: 'Active',
      autoPay: true
    },
    {
      id: 'rec-002',
      name: 'Spotify Family Plan',
      category: 'Entertainment',
      amount: 179,
      frequency: 'Monthly',
      billingCycleDate: 22,
      paymentMethod: 'PayPal Sandbox',
      status: 'Active',
      autoPay: true
    },
    {
      id: 'rec-003',
      name: 'Amazon Web Services',
      category: 'Utilities',
      amount: 3400,
      frequency: 'Monthly',
      billingCycleDate: 5,
      paymentMethod: 'Credit Card',
      status: 'Active',
      autoPay: true
    },
    {
      id: 'rec-004',
      name: 'Cult.fit Gym & Wellness',
      category: 'Health & Fitness',
      amount: 2499,
      frequency: 'Monthly',
      billingCycleDate: 1,
      paymentMethod: 'Bank Transfer',
      status: 'Active',
      autoPay: true
    },
    {
      id: 'rec-005',
      name: 'Airtel Fiber Gigabit Internet',
      category: 'Utilities',
      amount: 1199,
      frequency: 'Monthly',
      billingCycleDate: 10,
      paymentMethod: 'UPI',
      status: 'Active',
      autoPay: true
    },
    {
      id: 'rec-006',
      name: 'ChatGPT Plus & Claude Pro',
      category: 'Software & AI',
      amount: 3999,
      frequency: 'Monthly',
      billingCycleDate: 18,
      paymentMethod: 'PayPal Sandbox',
      status: 'Active',
      autoPay: true
    }
  ],
  payments: [
    {
      id: 'pay-001',
      orderId: 'ORDER-SB-9928192',
      captureId: 'CAP-SB-8819230',
      recipient: 'Client - PixelCraft Studios',
      amount: 34500,
      currency: 'INR',
      status: 'COMPLETED',
      type: 'INCOMING',
      timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
      payerEmail: 'sandbox-buyer-client@business.example.com',
      note: 'Milestone 2 - Web Dashboard Design'
    },
    {
      id: 'pay-002',
      orderId: 'ORDER-SB-4401892',
      captureId: 'CAP-SB-4401893',
      recipient: 'Swiggy Merchant Sandbox',
      amount: 1820,
      currency: 'INR',
      status: 'COMPLETED',
      type: 'OUTGOING',
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      payerEmail: 'sb-aditya-buyer@personal.example.com',
      note: 'Dinner Feast Delivery'
    },
    {
      id: 'pay-003',
      orderId: 'ORDER-SB-7718291',
      captureId: 'CAP-SB-7718292',
      recipient: 'Netflix Services India',
      amount: 649,
      currency: 'INR',
      status: 'COMPLETED',
      type: 'OUTGOING',
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
      payerEmail: 'sb-aditya-buyer@personal.example.com',
      note: 'Monthly streaming subscription'
    }
  ],
  aiInsights: {
    lastUpdated: new Date().toISOString(),
    healthScore: 84,
    healthGrade: 'A',
    summary: 'Your financial health is outstanding this month. You have saved 44.2% of your total income, exceeding the recommended 30% threshold. Discretionary spending on Food & Dining is well-managed at 32% of budget. You are on track to achieve your Emergency Fund goal 2 months ahead of schedule.',
    challenges: [
      {
        id: 'ch-1',
        title: 'Zero Food-Delivery Weekend',
        targetSaving: 1200,
        status: 'In Progress',
        progress: 60,
        description: 'Cook homemade meals this weekend to save ₹1,200 on convenience deliveries.'
      },
      {
        id: 'ch-2',
        title: 'Review Unused Digital Subscriptions',
        targetSaving: 828,
        status: 'Recommended',
        progress: 0,
        description: 'Auditing 2 rarely-used video & audio services could free up ₹828/month.'
      }
    ]
  }
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.write(initialData);
    }
  }

  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.write(initialData);
        return initialData;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading db.json:', err);
      return initialData;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to db.json:', err);
    }
  }

  get(collection) {
    const data = this.read();
    return data[collection] || [];
  }

  set(collection, items) {
    const data = this.read();
    data[collection] = items;
    this.write(data);
    return data[collection];
  }

  addItem(collection, item) {
    const data = this.read();
    if (!data[collection]) data[collection] = [];
    data[collection].unshift(item);
    this.write(data);
    return item;
  }

  updateItem(collection, id, updates) {
    const data = this.read();
    if (!data[collection]) return null;
    const index = data[collection].findIndex(i => i.id === id);
    if (index === -1) return null;
    data[collection][index] = { ...data[collection][index], ...updates };
    this.write(data);
    return data[collection][index];
  }

  deleteItem(collection, id) {
    const data = this.read();
    if (!data[collection]) return false;
    const initialLen = data[collection].length;
    data[collection] = data[collection].filter(i => i.id !== id);
    this.write(data);
    return data[collection].length < initialLen;
  }

  getSettings() {
    const data = this.read();
    return data.settings;
  }

  updateSettings(updates) {
    const data = this.read();
    data.settings = { ...data.settings, ...updates };
    this.write(data);
    return data.settings;
  }
}

export const db = new Database();
export default db;

