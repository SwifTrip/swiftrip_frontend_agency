/**
 * Booking API Service
 *
 * This service handles all booking-related API calls.
 * Currently uses mock data - replace with real API calls when endpoints are ready.
 *
 * To switch to real API:
 * 1. Uncomment the axios calls
 * 2. Remove the mock data imports and simulated delays
 * 3. Update endpoint URLs as needed
 */

import axios from "axios";
import mockBookings, { calculateBookingStats } from "../data/mockBookings";

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
 * Get all bookings with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.status - Booking status filter
 * @param {string} filters.tourType - Tour type filter (PUBLIC/PRIVATE)
 * @param {string} filters.paymentStatus - Payment status filter
 * @param {string} filters.search - Search query
 * @param {string} filters.startDate - Start date filter
 * @param {string} filters.endDate - End date filter
 * @param {number} filters.page - Page number for pagination
 * @param {number} filters.limit - Items per page
 */
export const getAllBookings = async (filters = {}) => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/bookings', { params: filters });
  // return response.data;

  await simulateDelay(300);

  let filteredBookings = [...mockBookings];

  // Apply filters
  if (filters.status && filters.status !== "ALL") {
    filteredBookings = filteredBookings.filter(
      (b) => b.status === filters.status,
    );
  }

  if (filters.tourType && filters.tourType !== "ALL") {
    filteredBookings = filteredBookings.filter(
      (b) => b.tourType === filters.tourType,
    );
  }

  if (filters.paymentStatus && filters.paymentStatus !== "ALL") {
    filteredBookings = filteredBookings.filter(
      (b) => b.paymentStatus === filters.paymentStatus,
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredBookings = filteredBookings.filter(
      (b) =>
        b.id.toLowerCase().includes(searchLower) ||
        b.tourist.name.toLowerCase().includes(searchLower) ||
        b.tourist.email.toLowerCase().includes(searchLower) ||
        b.package.title.toLowerCase().includes(searchLower) ||
        b.package.destination.toLowerCase().includes(searchLower),
    );
  }

  // Sort by booking date (newest first)
  filteredBookings.sort(
    (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate),
  );

  return {
    success: true,
    data: filteredBookings,
    stats: calculateBookingStats(mockBookings),
    pagination: {
      total: filteredBookings.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(filteredBookings.length / (filters.limit || 10)),
    },
  };
};

/**
 * Get single booking by ID
 * @param {string} id - Booking ID
 */
export const getBookingById = async (id) => {
  // TODO: Replace with real API call
  // const response = await apiClient.get(`/bookings/${id}`);
  // return response.data;

  await simulateDelay(200);

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return {
    success: true,
    data: booking,
  };
};

/**
 * Update booking status
 * @param {string} id - Booking ID
 * @param {string} status - New status
 */
export const updateBookingStatus = async (id, status) => {
  // TODO: Replace with real API call
  // const response = await apiClient.patch(`/bookings/${id}/status`, { status });
  // return response.data;

  await simulateDelay(300);

  const bookingIndex = mockBookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    throw new Error("Booking not found");
  }

  // Simulate update
  const updatedBooking = {
    ...mockBookings[bookingIndex],
    status,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: updatedBooking,
    message: "Booking status updated successfully",
  };
};

/**
 * Update payment status
 * @param {string} id - Booking ID
 * @param {Object} paymentData - Payment update data
 */
export const updatePaymentStatus = async (id, paymentData) => {
  // TODO: Replace with real API call
  // const response = await apiClient.patch(`/bookings/${id}/payment`, paymentData);
  // return response.data;

  await simulateDelay(300);

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return {
    success: true,
    data: {
      ...booking,
      paymentStatus: paymentData.status,
      pricing: {
        ...booking.pricing,
        paidAmount: paymentData.paidAmount || booking.pricing.paidAmount,
      },
      updatedAt: new Date().toISOString(),
    },
    message: "Payment status updated successfully",
  };
};

/**
 * Cancel booking
 * @param {string} id - Booking ID
 * @param {string} reason - Cancellation reason
 */
export const cancelBooking = async (id, reason) => {
  // TODO: Replace with real API call
  // const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
  // return response.data;

  await simulateDelay(300);

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return {
    success: true,
    data: {
      ...booking,
      status: "CANCELLED",
      notes: `${booking.notes}\nCancellation reason: ${reason}`,
      updatedAt: new Date().toISOString(),
    },
    message: "Booking cancelled successfully",
  };
};

/**
 * Get booking statistics
 */
export const getBookingStats = async () => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/bookings/stats');
  // return response.data;

  await simulateDelay(200);

  return {
    success: true,
    data: calculateBookingStats(mockBookings),
  };
};

/**
 * Export bookings data
 * @param {Object} filters - Export filters
 * @param {string} format - Export format (csv, pdf, excel)
 */
export const exportBookings = async (filters = {}, format = "csv") => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/bookings/export', {
  //   params: { ...filters, format },
  //   responseType: 'blob',
  // });
  // return response.data;

  await simulateDelay(500);

  return {
    success: true,
    message: `Export functionality will be available when API is ready`,
  };
};

export default {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  getBookingStats,
  exportBookings,
};
