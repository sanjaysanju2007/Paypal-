// SpendWise AI API Service Client

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `HTTP error ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Transactions
  getTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/transactions${query ? `?${query}` : ''}`);
  },
  getTransactionSummary: () => request('/transactions/summary'),
  addTransaction: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransaction: (id, data) => request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  // Budgets
  getBudgets: () => request('/budgets'),
  addBudget: (data) => request('/budgets', { method: 'POST', body: JSON.stringify(data) }),
  updateBudget: (id, data) => request(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBudget: (id) => request(`/budgets/${id}`, { method: 'DELETE' }),

  // Goals
  getGoals: () => request('/goals'),
  addGoal: (data) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  depositGoal: (id, data) => request(`/goals/${id}/deposit`, { method: 'POST', body: JSON.stringify(data) }),
  updateGoal: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),

  // Recurring
  getRecurring: () => request('/recurring'),
  addRecurring: (data) => request('/recurring', { method: 'POST', body: JSON.stringify(data) }),
  updateRecurring: (id, data) => request(`/recurring/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRecurring: (id) => request(`/recurring/${id}`, { method: 'DELETE' }),

  // PayPal Sandbox Payments
  getPayPalConfig: () => request('/paypal/config'),
  createPayPalOrder: (data) => request('/paypal/create-order', { method: 'POST', body: JSON.stringify(data) }),
  capturePayPalOrder: (data) => request('/paypal/capture-order', { method: 'POST', body: JSON.stringify(data) }),
  getPaymentHistory: () => request('/paypal/history'),
  simulateTestPayment: (data) => request('/paypal/simulate-test-payment', { method: 'POST', body: JSON.stringify(data) }),

  // AI Financial Advisor
  chatAI: (data) => request('/ai/chat', { method: 'POST', body: JSON.stringify(data) }),
  categorizeWithAI: (data) => request('/ai/categorize', { method: 'POST', body: JSON.stringify(data) }),
  getHealthScore: () => request('/ai/health-score'),
  getAISummary: () => request('/ai/summary'),

  // Analytics
  getAnalytics: () => request('/analytics'),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export default api;
