/**
 * Payment API Service
 *
 * Handles all payment-related API calls following Stripe Connect model.
 * Currently uses mock data - replace with real API calls when endpoints are ready.
 *
 * Stripe Connect Flow:
 * 1. Tourist pays → Stripe platform account
 * 2. Platform deducts fee → Remaining goes to agency's connected account
 * 3. Agency requests payout → Funds transfer to bank account
 */

import axios from "axios";
import {
  mockBalance,
  mockBalanceSummary,
  mockTransactions,
  mockPayouts,
  mockBankAccount,
  calculatePaymentStats,
} from "../data/mockPayments";
import {
  MINIMUM_PAYOUT_AMOUNT,
  BALANCE_TRANSACTION_TYPE,
  PAYOUT_STATUS,
} from "../utils/paymentConstants";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// API Client Configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to simulate API delay (remove when using real API)
const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get agency balance (Stripe Connect balance)
 * Returns available, pending, and reserved amounts
 */
export const getBalance = async () => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/payments/balance');
  // return response.data;

  await simulateDelay(300);

  return {
    success: true,
    data: mockBalance,
  };
};

/**
 * Get balance summary with all financial metrics
 */
export const getBalanceSummary = async () => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/payments/balance/summary');
  // return response.data;

  await simulateDelay(300);

  return {
    success: true,
    data: mockBalanceSummary,
  };
};

/**
 * Get all transactions with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.type - Transaction type filter
 * @param {string} filters.status - Status filter
 * @param {string} filters.dateRange - Date range filter
 * @param {string} filters.search - Search query
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 */
export const getTransactions = async (filters = {}) => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/payments/transactions', { params: filters });
  // return response.data;

  await simulateDelay(400);

  let filteredTransactions = [...mockTransactions];

  // Apply filters
  if (filters.type && filters.type !== "all" && filters.type !== "ALL") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.type === filters.type,
    );
  }

  if (filters.status && filters.status !== "all" && filters.status !== "ALL") {
    filteredTransactions = filteredTransactions.filter(
      (t) => t.status === filters.status,
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredTransactions = filteredTransactions.filter(
      (t) =>
        t.id.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        // New Stripe structure: source.packageTitle, source.touristName
        t.source?.packageTitle?.toLowerCase().includes(searchLower) ||
        t.source?.touristName?.toLowerCase().includes(searchLower) ||
        // Legacy structure: booking.packageTitle, booking.touristName
        t.booking?.packageTitle?.toLowerCase().includes(searchLower) ||
        t.booking?.touristName?.toLowerCase().includes(searchLower),
    );
  }

  // Sort by date (newest first)
  // Handle both Unix timestamp (created) and ISO string (createdAt)
  filteredTransactions.sort((a, b) => {
    const dateA = a.created
      ? a.created * 1000
      : new Date(a.createdAt).getTime();
    const dateB = b.created
      ? b.created * 1000
      : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return {
    success: true,
    data: filteredTransactions,
    stats: calculatePaymentStats(mockTransactions),
    pagination: {
      total: filteredTransactions.length,
      page: filters.page || 1,
      limit: filters.limit || 20,
      totalPages: Math.ceil(
        filteredTransactions.length / (filters.limit || 20),
      ),
    },
  };
};

/**
 * Get transaction details by ID
 * @param {string} id - Transaction ID
 */
export const getTransactionById = async (id) => {
  // TODO: Replace with real API call
  // const response = await apiClient.get(`/payments/transactions/${id}`);
  // return response.data;

  await simulateDelay(200);

  const transaction = mockTransactions.find((t) => t.id === id);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return {
    success: true,
    data: transaction,
  };
};

/**
 * Get payout history
 * @param {Object} filters - Filter options
 */
export const getPayouts = async (filters = {}) => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/payments/payouts', { params: filters });
  // return response.data;

  await simulateDelay(300);

  let filteredPayouts = [...mockPayouts];

  if (filters.status && filters.status !== "ALL") {
    filteredPayouts = filteredPayouts.filter(
      (p) => p.status === filters.status,
    );
  }

  // Sort by date (newest first)
  // Handle both Unix timestamp (created) and ISO string (createdAt)
  filteredPayouts.sort((a, b) => {
    const dateA = a.created
      ? a.created * 1000
      : new Date(a.createdAt).getTime();
    const dateB = b.created
      ? b.created * 1000
      : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return {
    success: true,
    data: filteredPayouts,
  };
};

/**
 * Request a payout (withdrawal)
 * Follows Stripe's Create Payout API structure
 * Reference: https://stripe.com/docs/api/payouts/create
 *
 * @param {Object} payoutData - Payout request data
 * @param {number} payoutData.amount - Amount to withdraw (in smallest currency unit)
 * @param {string} payoutData.currency - Currency code
 * @param {string} payoutData.method - Payout method (standard/instant)
 * @param {string} payoutData.destination - Bank account ID to transfer to
 * @param {string} payoutData.description - Optional description
 * @param {string} payoutData.statement_descriptor - Statement descriptor
 */
export const requestPayout = async (payoutData) => {
  // TODO: Replace with real API call
  // const response = await apiClient.post('/payments/payouts', payoutData);
  // return response.data;

  await simulateDelay(800);

  // Validation
  if (payoutData.amount < MINIMUM_PAYOUT_AMOUNT) {
    throw new Error(
      `Minimum payout amount is PKR ${MINIMUM_PAYOUT_AMOUNT.toLocaleString()}`,
    );
  }

  if (payoutData.amount > mockBalance.available) {
    throw new Error("Insufficient available balance");
  }

  // Calculate arrival date based on payout method
  const arrivalDate = new Date();
  if (payoutData.method === "instant") {
    arrivalDate.setMinutes(arrivalDate.getMinutes() + 30);
  } else {
    // Standard: 1-3 business days
    let daysToAdd = 3;
    while (daysToAdd > 0) {
      arrivalDate.setDate(arrivalDate.getDate() + 1);
      const dayOfWeek = arrivalDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysToAdd--;
      }
    }
  }

  // Create payout following Stripe Payout object structure
  // Reference: https://stripe.com/docs/api/payouts/object
  const newPayout = {
    id: `po_${Date.now()}`,
    object: "payout",
    amount: payoutData.amount,
    currency: payoutData.currency || "pkr",
    arrival_date: Math.floor(arrivalDate.getTime() / 1000), // Unix timestamp
    created: Math.floor(Date.now() / 1000), // Unix timestamp
    description: payoutData.description || "Manual payout",
    destination: payoutData.destination || mockBankAccount.id,
    method: payoutData.method || "standard",
    status: PAYOUT_STATUS.PENDING,
    type: "bank_account",
    statement_descriptor: payoutData.statement_descriptor,
    metadata: {},
  };

  return {
    success: true,
    data: newPayout,
    message: "Payout request submitted successfully",
  };
};

/**
 * Cancel a pending payout
 * @param {string} payoutId - Payout ID to cancel
 */
export const cancelPayout = async (payoutId) => {
  // TODO: Replace with real API call
  // const response = await apiClient.post(`/payments/payouts/${payoutId}/cancel`);
  // return response.data;

  await simulateDelay(400);

  const payout = mockPayouts.find((p) => p.id === payoutId);

  if (!payout) {
    throw new Error("Payout not found");
  }

  if (payout.status !== PAYOUT_STATUS.PENDING) {
    throw new Error("Only pending payouts can be cancelled");
  }

  return {
    success: true,
    data: { ...payout, status: PAYOUT_STATUS.CANCELLED },
    message: "Payout cancelled successfully",
  };
};

/**
 * Get connected bank accounts
 */
export const getBankAccounts = async () => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/payments/bank-accounts');
  // return response.data;

  await simulateDelay(200);

  return {
    success: true,
    data: [mockBankAccount],
  };
};

/**
 * Add a new bank account
 * @param {Object} bankData - Bank account details
 */
export const addBankAccount = async (bankData) => {
  // TODO: Replace with real API call
  // const response = await apiClient.post('/payments/bank-accounts', bankData);
  // return response.data;

  await simulateDelay(500);

  return {
    success: true,
    data: {
      id: `ba_${Date.now()}`,
      ...bankData,
      isVerified: false,
      addedAt: new Date().toISOString(),
    },
    message: "Bank account added. Verification pending.",
  };
};

/**
 * Export transactions data
 * @param {Object} filters - Export filters
 * @param {string} format - Export format (csv, pdf, excel)
 */
export const exportTransactions = async (filters = {}, format = "csv") => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/payments/transactions/export', {
  //   params: { ...filters, format },
  //   responseType: 'blob',
  // });
  // return response.data;

  await simulateDelay(500);

  return {
    success: true,
    message: "Export functionality will be available when API is ready",
  };
};

export default {
  getBalance,
  getBalanceSummary,
  getTransactions,
  getTransactionById,
  getPayouts,
  requestPayout,
  cancelPayout,
  getBankAccounts,
  addBankAccount,
  exportTransactions,
};
