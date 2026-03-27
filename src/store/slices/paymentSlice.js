import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as paymentApi from "../../api/paymentService";

export const fetchPaymentDetails = createAsyncThunk(
  "payments/fetchPaymentDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentDetails();
      return response.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch payment details",
      );
    }
  },
);

export const fetchStripeConnectStatus = createAsyncThunk(
  "payments/fetchStripeConnectStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getStripeConnectStatus();
      return response.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch Stripe connection status",
      );
    }
  },
);

export const createStripeConnectOnboardingLink = createAsyncThunk(
  "payments/createStripeConnectOnboardingLink",
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createStripeConnectOnboardingLink();
      if (!response.success || !response.result?.url) {
        return rejectWithValue(
          response.error || "Failed to create onboarding link",
        );
      }
      return response.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.message ||
          "Failed to create onboarding link",
      );
    }
  },
);

export const redeemPayment = createAsyncThunk(
  "payments/redeemPayment",
  async (payload = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await paymentApi.redeemPayment(payload);
      if (!response.success || response?.result?.success === false) {
        return rejectWithValue(
          response.error || response.result?.error || "Withdrawal failed",
        );
      }
      await dispatch(fetchPaymentDetails());
      return response.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.result?.error ||
          error.message ||
          "Failed to withdraw funds",
      );
    }
  },
);

const initialState = {
  pendingAmount: 0,
  availableAmount: 0,
  totalAmount: 0,
  loading: false,
  redeemLoading: false,
  error: null,
  redeemError: null,
  redeemSuccess: false,
  connectStatus: {
    isConnected: false,
    payoutsEnabled: false,
    detailsSubmitted: false,
    accountId: null,
  },
  connectLoading: false,
  connectError: null,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearRedeemStatus: (state) => {
      state.redeemError = null;
      state.redeemSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingAmount = action.payload?.pendingAmount ?? 0;
        state.availableAmount =
          action.payload?.availableAmount ??
          action.payload?.avaiableAmount ??
          0;
        state.totalAmount = action.payload?.totalAmount ?? 0;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStripeConnectStatus.pending, (state) => {
        state.connectLoading = true;
        state.connectError = null;
      })
      .addCase(fetchStripeConnectStatus.fulfilled, (state, action) => {
        state.connectLoading = false;
        state.connectStatus = {
          isConnected: !!action.payload?.isConnected,
          payoutsEnabled: !!action.payload?.payoutsEnabled,
          detailsSubmitted: !!action.payload?.detailsSubmitted,
          accountId: action.payload?.accountId || null,
        };
      })
      .addCase(fetchStripeConnectStatus.rejected, (state, action) => {
        state.connectLoading = false;
        state.connectError = action.payload;
      })
      .addCase(redeemPayment.pending, (state) => {
        state.redeemLoading = true;
        state.redeemError = null;
        state.redeemSuccess = false;
      })
      .addCase(redeemPayment.fulfilled, (state) => {
        state.redeemLoading = false;
        state.redeemSuccess = true;
      })
      .addCase(redeemPayment.rejected, (state, action) => {
        state.redeemLoading = false;
        state.redeemError = action.payload;
      });
  },
});

export const { clearRedeemStatus } = paymentSlice.actions;

export const selectPendingAmount = (state) => state.payments.pendingAmount;
export const selectAvailableAmount = (state) => state.payments.availableAmount;
export const selectTotalAmount = (state) => state.payments.totalAmount;
export const selectPaymentLoading = (state) => state.payments.loading;
export const selectRedeemLoading = (state) => state.payments.redeemLoading;
export const selectPaymentError = (state) => state.payments.error;
export const selectRedeemError = (state) => state.payments.redeemError;
export const selectRedeemSuccess = (state) => state.payments.redeemSuccess;
export const selectStripeConnectStatus = (state) =>
  state.payments.connectStatus;
export const selectStripeConnectLoading = (state) =>
  state.payments.connectLoading;
export const selectStripeConnectError = (state) => state.payments.connectError;

export default paymentSlice.reducer;
