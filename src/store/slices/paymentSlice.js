/**
 * Payment Redux Slice
 * Manages payment state with async thunks for Stripe Connect operations
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as paymentApi from "../../api/paymentService";

// Async Thunks

/**
 * Fetch agency balance
 */
export const fetchBalance = createAsyncThunk(
  "payments/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getBalance();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch balance");
    }
  },
);

/**
 * Fetch balance summary with all metrics
 */
export const fetchBalanceSummary = createAsyncThunk(
  "payments/fetchBalanceSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getBalanceSummary();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch balance summary",
      );
    }
  },
);

/**
 * Fetch all transactions
 */
export const fetchTransactions = createAsyncThunk(
  "payments/fetchTransactions",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getTransactions(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch transactions");
    }
  },
);

/**
 * Fetch transaction details
 */
export const fetchTransactionById = createAsyncThunk(
  "payments/fetchTransactionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getTransactionById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch transaction");
    }
  },
);

/**
 * Fetch payout history
 */
export const fetchPayouts = createAsyncThunk(
  "payments/fetchPayouts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPayouts(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch payouts");
    }
  },
);

/**
 * Request a payout (withdrawal)
 */
export const requestPayout = createAsyncThunk(
  "payments/requestPayout",
  async (payoutData, { rejectWithValue, dispatch }) => {
    try {
      const response = await paymentApi.requestPayout(payoutData);
      // Refresh balance after successful payout request
      dispatch(fetchBalance());
      dispatch(fetchBalanceSummary());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to request payout");
    }
  },
);

/**
 * Cancel a pending payout
 */
export const cancelPayout = createAsyncThunk(
  "payments/cancelPayout",
  async (payoutId, { rejectWithValue, dispatch }) => {
    try {
      const response = await paymentApi.cancelPayout(payoutId);
      // Refresh balance after cancellation
      dispatch(fetchBalance());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to cancel payout");
    }
  },
);

/**
 * Fetch bank accounts
 */
export const fetchBankAccounts = createAsyncThunk(
  "payments/fetchBankAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getBankAccounts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch bank accounts");
    }
  },
);

// Initial State
const initialState = {
  // Balance data
  balance: {
    available: 0,
    pending: 0,
    reserved: 0,
    currency: "PKR",
  },
  balanceSummary: {
    totalEarnings: 0,
    totalRefunds: 0,
    totalPayouts: 0,
    totalPlatformFees: 0,
    netEarnings: 0,
    availableBalance: 0,
    pendingBalance: 0,
  },

  // Transactions
  transactions: [],
  currentTransaction: null,
  transactionStats: {},

  // Payouts
  payouts: [],

  // Bank accounts
  bankAccounts: [],

  // Pagination
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },

  // Filters
  filters: {
    type: "ALL",
    status: "ALL",
    dateRange: "ALL",
    search: "",
  },

  // Loading states
  loading: false,
  balanceLoading: false,
  transactionsLoading: false,
  payoutLoading: false,

  // Error state
  error: null,
};

// Slice
const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set current transaction
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
    },

    // Clear current transaction
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch balance
      .addCase(fetchBalance.pending, (state) => {
        state.balanceLoading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.balanceLoading = false;
        state.error = action.payload;
      })

      // Fetch balance summary
      .addCase(fetchBalanceSummary.pending, (state) => {
        state.balanceLoading = true;
      })
      .addCase(fetchBalanceSummary.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.balanceSummary = action.payload;
      })
      .addCase(fetchBalanceSummary.rejected, (state, action) => {
        state.balanceLoading = false;
        state.error = action.payload;
      })

      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactions = action.payload.data;
        state.transactionStats = action.payload.stats;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.error = action.payload;
      })

      // Fetch transaction by ID
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch payouts
      .addCase(fetchPayouts.pending, (state) => {
        state.payoutLoading = true;
      })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        state.payoutLoading = false;
        state.payouts = action.payload;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.payoutLoading = false;
        state.error = action.payload;
      })

      // Request payout
      .addCase(requestPayout.pending, (state) => {
        state.payoutLoading = true;
        state.error = null;
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.payoutLoading = false;
        state.payouts = [action.payload, ...state.payouts];
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.payoutLoading = false;
        state.error = action.payload;
      })

      // Cancel payout
      .addCase(cancelPayout.pending, (state) => {
        state.payoutLoading = true;
      })
      .addCase(cancelPayout.fulfilled, (state, action) => {
        state.payoutLoading = false;
        const index = state.payouts.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.payouts[index] = action.payload;
        }
      })
      .addCase(cancelPayout.rejected, (state, action) => {
        state.payoutLoading = false;
        state.error = action.payload;
      })

      // Fetch bank accounts
      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.bankAccounts = action.payload;
      });
  },
});

// Export actions
export const {
  setFilters,
  resetFilters,
  clearError,
  setCurrentTransaction,
  clearCurrentTransaction,
} = paymentSlice.actions;

// Selectors
export const selectBalance = (state) => state.payments.balance;
export const selectBalanceSummary = (state) => state.payments.balanceSummary;
export const selectTransactions = (state) => state.payments.transactions;
export const selectCurrentTransaction = (state) =>
  state.payments.currentTransaction;
export const selectTransactionStats = (state) =>
  state.payments.transactionStats;
export const selectPayouts = (state) => state.payments.payouts;
export const selectBankAccounts = (state) => state.payments.bankAccounts;
export const selectPaymentFilters = (state) => state.payments.filters;
export const selectPaymentPagination = (state) => state.payments.pagination;
export const selectBalanceLoading = (state) => state.payments.balanceLoading;
export const selectTransactionsLoading = (state) =>
  state.payments.transactionsLoading;
export const selectPayoutLoading = (state) => state.payments.payoutLoading;
export const selectPaymentLoading = (state) => ({
  balance: state.payments.balanceLoading,
  balanceSummary: state.payments.balanceLoading,
  transactions: state.payments.transactionsLoading,
  payout: state.payments.payoutLoading,
});
export const selectPaymentError = (state) => state.payments.error;

export default paymentSlice.reducer;
