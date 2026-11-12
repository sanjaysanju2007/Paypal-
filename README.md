# SpendWise AI – Intelligent Money Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox%20Active-0070BA.svg)](https://developer.paypal.com)
[![AI](https://img.shields.io/badge/AI-Gemini%20%2F%20Deterministic%20Engine-10B981.svg)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Tailwind-slate.svg)]()

**SpendWise AI** is an intelligent, modern, full-stack Money Management & Financial Technology platform. Designed with a clean white background, minimal light-green fintech accents, and refined typography inspired by modern neo-banking aesthetics, it brings together real-time banking analytics, persistent financial ledgers, deep AI financial advisory, and official **PayPal Sandbox checkout**.

---

## 🌟 Key Features

### 1. 💳 Official PayPal Sandbox Integration (Critical Feature)
- **Official App Profile**: Configured for PayPal developer application **`acsPaypal`**.
- **Client ID**: Integrated with sandbox client identifier:
  ```
  BAAmDmQ9iyFIWvwF3CYwoqPk6itcyayF1KmLuoOqD23jaXrKaPddNrU4N1Tig3_p8OBaKKh1Uc0ipt-rC4
  ```
- **Live PayPal JS SDK**: Rendered using `@paypal/react-paypal-js` for official PayPal checkout modal.
- **Backend Order Creation & Capture**:
  - `POST /api/paypal/create-order`
  - `POST /api/paypal/capture-order`
  - `GET /api/paypal/config`
  - `GET /api/paypal/history`
- **Instant Sandbox Simulation**: 1-click test simulation for instantaneous order reconciliation and testing.
- **Official Receipt Generator**: Detailed modal with Order ID, Capture ID, Payer Email, timestamps, status badge, and print action.

### 2. 🧠 AI Financial Advisor
- **Grounded in Real Ledger Data**: Never hallucinates numbers. Computes insights directly from the user's active transactions, categories, and budgets.
- **Dual Engine**:
  - **Google Gemini API**: Connected via REST endpoint when `GEMINI_API_KEY` is provided.
  - **Intelligent Financial Intelligence Engine**: Deterministic analytical model that answers questions with exact mathematical precision when offline or API key is unconfigured.
- **Preset Quick Inquiries**:
  1. *Where did most of my money go this month?*
  2. *How can I save ₹5,000 next month?*
  3. *Which category has the highest expenses?*
  4. *Compare my spending this month with last month*
  5. *Am I spending too much on food?*
  6. *Give me a personalized savings plan*
- **Smart Expense Auto-Categorizer**: Real-time AI categorization of transaction descriptions (e.g. Swiggy → Food & Dining, Uber → Transportation).
- **Financial Health Score**: Composite rating (0–100, Grade A+) based on savings discipline, budget adherence, and subscription burn.
- **AI Savings Challenges**: Interactive weekly challenges (e.g. "Zero Food-Delivery Weekend: Save ₹1,200").

### 3. 📊 Dashboard & Overview
- **4 Primary Metric Cards**: Total Balance, Total Income, Total Expenses, and Monthly Net Savings with savings rate badge.
- **Interactive Recharts**:
  - Income vs Expenses monthly trend area chart.
  - Expense Category donut chart with top-spending highlight.
- **Live AI Financial Summary Banner**: High-level observation card with 1-click advisor shortcut.
- **Budget Progress Meters**: Real-time tracking of limits against actual spend.
- **Recent Transactions Ledger**: Quick view of recent debits/credits with PayPal badges.

### 4. 💸 Transactions Management
- **Full CRUD**: Add, edit, and delete transactions with instant state updates.
- **Multi-Level Filters**: Tabs for All / Income / Expense, Category dropdown, and date-range filters.
- **Live Search**: Instant search by merchant name, category, or note.
- **Sorting**: Amount (High to Low, Low to High) and Date (Newest / Oldest).
- **Export to CSV**: Working one-click export of filtered transactions to downloadable `.csv`.

### 5. 🎯 Smart Budgets
- Category-wise monthly limits (Food & Dining, Housing, Utilities, Shopping, etc.).
- Color-coded progress indicators:
  - 🟢 Green (< 70% utilized)
  - 🟡 Amber (70% – 85% utilized)
  - 🔴 Red (> 85% or Over-budget)
- Predictive Overspending Warning banners.

### 6. 🏆 Savings Goals
- Goal creation with target amount, current amount, and target deadline.
- Progress percentage bar with remaining amount needed.
- **Deposit Allocation Modal**: Deposit savings into a goal with optional automatic transaction recording.

### 7. 🔄 Recurring Payments & Subscription Detector
- **Subscription Detector**: Automatically scans transactions for repeated services (Netflix, Spotify, AWS, Gym, ChatGPT, Hotstar).
- Monthly and annual recurring drain calculations.
- **1-Click Pay Now via PayPal**: Directly launch PayPal sandbox checkout for any recurring bill.

### 8. 📄 Financial Reports & Statements
- Formal Income Statement & Statement of Cash Inflows.
- Itemized category ledger with reconciled status badges.
- Print-ready statement layout and CSV download.

### 9. ⚙️ Settings, Help Center & Profile
- **Currency Switcher**: Switch between INR (₹), USD ($), EUR (€), and GBP (£).
- **PayPal Configuration**: Manage Client ID, Client Secret, and alert thresholds.
- **Help Center**: Sandbox developer credentials guide and FAQ.

---

## 🎨 Design System

- **Background**: Pure white `#FFFFFF` cards on ultra-clean `#FAFAFA` canvas.
- **Accent**: Minimal emerald fintech green (`#10B981` / `#059669` / `emerald-600`), light mint badges (`bg-emerald-50 text-emerald-800 border-emerald-200`).
- **Sidebar**: Fixed left sidebar navigation with rounded navigation items and active state indicators.
- **Navbar**: Compact 64px top bar with search shortcut (`⌘K`), currency switcher, sandbox status badge, and notifications.
- **Typography**: Inter and Plus Jakarta Sans.

---

## 🏗️ Project Architecture

```
paypal/
├── client/                     # Frontend (React 19, Vite, Tailwind CSS v4)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Navbar
│   │   │   └── modals/         # AddTransaction, PayPalCheckout, AddBudget, etc.
│   │   ├── context/            # AppContext.jsx (Global reactive state)
│   │   ├── pages/              # Overview, Transactions, Payments, AI, Budgets, etc.
│   │   ├── services/           # api.js (Backend REST client)
│   │   ├── App.jsx             # Main router & layout
│   │   ├── main.jsx            # React root
│   │   └── index.css           # Tailwind CSS base styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js, Express)
│   ├── data/
│   │   └── db.json             # Atomic persistent JSON database
│   ├── src/
│   │   ├── routes/             # transactions, budgets, goals, recurring, paypal, ai, etc.
│   │   ├── services/           # paypalService.js, geminiService.js
│   │   ├── db.js               # Database engine
│   │   └── index.js            # Express server entry point
│   ├── .env                    # Environment variables
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                # Root unified scripts
└── README.md
```

---

## 🚀 Quick Start Instructions

### Prerequisites
- Node.js v18+ (tested on Node.js v24)
- npm v9+

### 1. Installation
Install all dependencies for both client and server:
```bash
npm run install:all
```

### 2. Environment Variables
Verify or update `server/.env`:
```env
PORT=5000
PAYPAL_CLIENT_ID=BAAmDmQ9iyFIWvwF3CYwoqPk6itcyayF1KmLuoOqD23jaXrKaPddNrU4N1Tig3_p8OBaKKh1Uc0ipt-rC4
PAYPAL_CLIENT_SECRET=
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
GEMINI_API_KEY=
```

### 3. Build & Run Application
You can build the production frontend and start the unified server:
```bash
# Build the frontend client
npm run build

# Start the unified backend server (serves API & Frontend on http://localhost:5000)
npm start
```
Now open [http://localhost:5000](http://localhost:5000) in your browser!

### 4. Running Development Servers
Alternatively, run both in dev mode:
```bash
# In terminal 1:
npm run server:dev

# In terminal 2:
npm run client
```
The Vite development server will run on [http://localhost:5173](http://localhost:5173) with automatic proxying to backend on port 5000.

---

## 💳 Testing PayPal Sandbox Checkout

1. Navigate to the **Payments** page or click **"Pay with PayPal"** anywhere in the header/sidebar.
2. In the checkout modal:
   - **Mode 1 (Live PayPal SDK)**: Click the official yellow PayPal button to launch the PayPal login popup. Log in with your Sandbox test account (e.g. personal buyer from Developer Dashboard).
   - **Mode 2 (1-Click Test Sandbox)**: Instantly test order creation, authorization, server capture, and receipt generation.
3. Upon capture, a verified **PayPal Order ID** and **Capture ID** are registered in the payment ledger and added to your transactions list.
4. Click **"View Receipt"** to print or inspect the full transaction receipt.

---

## 🛡️ License

This project is licensed under the MIT License.

#   P a y p a l -  
 