import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import AnimatedBackground from './components/common/AnimatedBackground';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

// Pages
import Overview from './pages/Overview';
import TransactionsPage from './pages/TransactionsPage';
import PaymentsPage from './pages/PaymentsPage';
import BudgetsPage from './pages/BudgetsPage';
import AIAdvisorPage from './pages/AIAdvisorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SavingsGoalsPage from './pages/SavingsGoalsPage';
import RecurringPage from './pages/RecurringPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ProfilePage from './pages/ProfilePage';

// Modals
import AddTransactionModal from './components/modals/AddTransactionModal';
import PayPalCheckoutModal from './components/modals/PayPalCheckoutModal';
import AddBudgetModal from './components/modals/AddBudgetModal';
import AddGoalModal from './components/modals/AddGoalModal';
import DepositGoalModal from './components/modals/DepositGoalModal';
import TransactionDetailModal from './components/modals/TransactionDetailModal';
import ReceiptModal from './components/modals/ReceiptModal';

function MainLayout() {
  const { activeTab } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview key="overview" />;
      case 'transactions':
        return <TransactionsPage key="transactions" />;
      case 'payments':
        return <PaymentsPage key="payments" />;
      case 'budgets':
        return <BudgetsPage key="budgets" />;
      case 'ai-advisor':
        return <AIAdvisorPage key="ai-advisor" />;
      case 'analytics':
        return <AnalyticsPage key="analytics" />;
      case 'goals':
        return <SavingsGoalsPage key="goals" />;
      case 'recurring':
        return <RecurringPage key="recurring" />;
      case 'reports':
        return <ReportsPage key="reports" />;
      case 'settings':
        return <SettingsPage key="settings" />;
      case 'help':
        return <HelpCenterPage key="help" />;
      case 'profile':
        return <ProfilePage key="profile" />;
      default:
        return <Overview key="default-overview" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans relative selection:bg-[#38BDF8]/20 selection:text-[#38BDF8]">
      {/* Moving Ambient Glow Background */}
      <AnimatedBackground />

      {/* Fixed Frosted Glass Sidebar */}
      <Sidebar />

      {/* Top Floating Glass Navbar */}
      <Navbar />

      {/* Main Content Area with Page Motion */}
      <main className="ml-64 pt-24 px-6 sm:px-8 pb-16 flex-1 max-w-[1600px] relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActivePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Glass Modals */}
      <AddTransactionModal />
      <PayPalCheckoutModal />
      <AddBudgetModal />
      <AddGoalModal />
      <DepositGoalModal />
      <TransactionDetailModal />
      <ReceiptModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
