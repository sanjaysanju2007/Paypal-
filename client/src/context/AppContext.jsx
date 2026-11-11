import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state: 'light' (Frosted Blue) or 'dark' (Midnight Navy)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('spendwise-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch (e) {
      // fallback
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('spendwise-theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // System preference listener when user hasn't manually overridden
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const saved = localStorage.getItem('spendwise-theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);
  
  // Data states
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    monthlySavings: 0,
    savingsRate: 0,
    categoryTotals: {}
  });
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState({
    currency: 'INR',
    currencySymbol: '₹',
    appName: 'SpendWise AI',
    paypalAppName: 'acsPaypal',
    paypalClientId: 'BAAmDmQ9iyFIWvwF3CYwoqPk6itcyayF1KmLuoOqD23jaXrKaPddNrU4N1Tig3_p8OBaKKh1Uc0ipt-rC4',
    user: {
      name: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      accountNumber: '•••• •••• 8829',
      tier: 'SpendWise Pro'
    }
  });
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Salary Credited', message: 'TechCorp direct deposit of ₹1,25,000 processed.', time: '2h ago', unread: true },
    { id: 2, title: 'PayPal Sandbox Ready', message: 'acsPaypal client connected in sandbox mode.', time: '5h ago', unread: true },
    { id: 3, title: 'Budget On Track', message: 'Housing and Groceries are within target limits.', time: '1d ago', unread: false }
  ]);

  // Modal states
  const [modalState, setModalState] = useState({
    addTransaction: false,
    editTransaction: null,
    viewTransaction: null,
    paypalCheckout: false,
    paypalInitialData: null,
    addBudget: false,
    editBudget: null,
    addGoal: false,
    depositGoal: null,
    receiptModal: null
  });

  const currencySymbol = settings?.currencySymbol || '₹';

  const formatCurrency = useCallback((amount) => {
    const num = Number(amount || 0);
    return `${currencySymbol}${num.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    })}`;
  }, [currencySymbol]);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        txData,
        sumData,
        budData,
        goalData,
        recData,
        payData,
        setData,
        ppConf,
        healthData,
        aiSumData,
        anaData
      ] = await Promise.allSettled([
        api.getTransactions(),
        api.getTransactionSummary(),
        api.getBudgets(),
        api.getGoals(),
        api.getRecurring(),
        api.getPaymentHistory(),
        api.getSettings(),
        api.getPayPalConfig(),
        api.getHealthScore(),
        api.getAISummary(),
        api.getAnalytics()
      ]);

      if (txData.status === 'fulfilled' && txData.value?.data) setTransactions(txData.value.data);
      if (sumData.status === 'fulfilled' && sumData.value?.data) setSummary(sumData.value.data);
      if (budData.status === 'fulfilled' && budData.value?.data) setBudgets(budData.value.data);
      if (goalData.status === 'fulfilled' && goalData.value?.data) setGoals(goalData.value.data);
      if (recData.status === 'fulfilled' && recData.value?.data) setRecurring(recData.value.data);
      if (payData.status === 'fulfilled' && payData.value?.data) setPayments(payData.value.data);
      if (setData.status === 'fulfilled' && setData.value?.data) setSettings(setData.value.data);
      if (ppConf.status === 'fulfilled') setPaypalConfig(ppConf.value);
      if (healthData.status === 'fulfilled' && healthData.value?.data) setHealthScore(healthData.value.data);
      if (aiSumData.status === 'fulfilled' && aiSumData.value?.data) setAiSummary(aiSumData.value.data);
      if (anaData.status === 'fulfilled' && anaData.value?.data) setAnalytics(anaData.value.data);
    } catch (err) {
      console.error('Failed to load SpendWise data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const openModal = (name, payload = true) => {
    setModalState(prev => ({ ...prev, [name]: payload }));
  };

  const closeModal = (name) => {
    setModalState(prev => ({ ...prev, [name]: false }));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const value = {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    transactions,
    summary,
    budgets,
    goals,
    recurring,
    payments,
    settings,
    paypalConfig,
    healthScore,
    aiSummary,
    analytics,
    loading,
    notifications,
    markAllNotificationsRead,
    refreshAll: loadAllData,
    currencySymbol,
    formatCurrency,
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
    modalState,
    openModal,
    closeModal,
    setSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;

