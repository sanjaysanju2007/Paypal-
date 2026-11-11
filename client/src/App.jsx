import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
        return <Overview />;
      case 'transactions':
        return <TransactionsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'ai-advisor':
        return <AIAdvisorPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'goals':
        return <SavingsGoalsPage />;
      case 'recurring':
        return <RecurringPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="ml-64 pt-20 px-6 sm:px-8 pb-12 flex-1 max-w-7xl">
        {renderActivePage()}
      </main>

      {/* Global Modals */}
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
