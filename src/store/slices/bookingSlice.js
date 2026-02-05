/**
 * Booking Redux Slice
 * Manages booking state with async thunks for API operations
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingApi from "../../api/bookingService";

// Async Thunks

/**
 * Fetch all bookings with optional filters
 */
export const fetchBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getAllBookings(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch bookings");
    }
  },
);

/**
 * Fetch single booking by ID
 */
export const fetchBookingById = createAsyncThunk(
  "bookings/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookingById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch booking");
    }
  },
);

/**
 * Update booking status
 */
export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.updateBookingStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update booking status",
      );
    }
  },
);

/**
 * Update payment status
 */
export const updatePaymentStatus = createAsyncThunk(
  "bookings/updatePayment",
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.updatePaymentStatus(id, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update payment status",
      );
    }
  },
);

/**
 * Cancel booking
 */
export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.cancelBooking(id, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to cancel booking");
    }
  },
);

/**
 * Fetch booking statistics
 */
export const fetchBookingStats = createAsyncThunk(
  "bookings/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookingStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch booking statistics",
      );
    }
  },
);

// Initial State
const initialState = {
  bookings: [],
  currentBooking: null,
  stats: {
    total: 0,
    ongoing: 0,
    completed: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    publicTours: 0,
    privateTours: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  filters: {
    status: "ALL",
    tourType: "ALL",
    paymentStatus: "ALL",
    search: "",
    startDate: null,
    endDate: null,
  },
  loading: false,
  detailsLoading: false,
  actionLoading: false,
  error: null,
};

// Slice
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    // Set current booking (for navigation)
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },

    // Clear current booking
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },

    // Update filters
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

    // Set page
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data;
        state.stats = action.payload.stats;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single booking
      .addCase(fetchBookingById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update in list
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        // Update current if same
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update payment status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update in list
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        // Update current if same
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Update in list
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        // Update current if same
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Fetch stats
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

// Export actions
export const {
  setCurrentBooking,
  clearCurrentBooking,
  setFilters,
  resetFilters,
  clearError,
  setPage,
} = bookingSlice.actions;

// Selectors
export const selectBookings = (state) => state.bookings.bookings;
export const selectCurrentBooking = (state) => state.bookings.currentBooking;
export const selectBookingStats = (state) => state.bookings.stats;
export const selectBookingPagination = (state) => state.bookings.pagination;
export const selectBookingFilters = (state) => state.bookings.filters;
export const selectBookingLoading = (state) => state.bookings.loading;
export const selectDetailsLoading = (state) => state.bookings.detailsLoading;
export const selectActionLoading = (state) => state.bookings.actionLoading;
export const selectBookingError = (state) => state.bookings.error;

export default bookingSlice.reducer;
