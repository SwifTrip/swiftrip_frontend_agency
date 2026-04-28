import axios from "axios";
import { getToken } from "../utils/auth/authHelper";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

/**
 * Create schedules for a package
 */
export const createSchedules = async (packageId, data) => {
  const response = await apiClient.post(
    `/packages/${packageId}/schedules`,
    data,
  );
  return response.data;
};

/**
 * Create recurring schedules
 */
export const createRecurringSchedules = async (packageId, recurrence) => {
  const response = await apiClient.post(`/packages/${packageId}/schedules`, {
    recurrence,
    snapshotItinerary: true,
  });
  return response.data;
};

/**
 * Get package schedules
 */
export const getPackageSchedules = async (packageId, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.fromDate) params.append("fromDate", filters.fromDate);
  if (filters.toDate) params.append("toDate", filters.toDate);
  if (filters.hasAvailability) params.append("hasAvailability", "true");

  const response = await apiClient.get(
    `/packages/${packageId}/schedules?${params}`,
  );
  return response.data;
};

/**
 * Get single schedule details
 */
export const getScheduleById = async (scheduleId) => {
  const response = await apiClient.get(`/schedules/${scheduleId}`);
  return response.data;
};

/**
 * Update schedule
 */
export const updateSchedule = async (scheduleId, data) => {
  const response = await apiClient.patch(`/schedules/${scheduleId}`, data);
  return response.data;
};

/**
 * Delete schedule
 */
export const deleteSchedule = async (scheduleId) => {
  const response = await apiClient.delete(`/schedules/${scheduleId}`);
  return response.data;
};

/**
 * Publish schedule
 */
export const publishSchedule = async (scheduleId) => {
  const response = await apiClient.post(`/schedules/${scheduleId}/publish`);
  return response.data;
};

/**
 * Create booking
 */
export const createBooking = async (scheduleId, seats) => {
  const response = await apiClient.post(`/schedules/${scheduleId}/bookings`, {
    seats,
  });
  return response.data;
};

/**
 * Confirm booking
 */
export const confirmBooking = async (bookingId, paymentData) => {
  const response = await apiClient.post(
    `/bookings/${bookingId}/confirm`,
    paymentData,
  );
  return response.data;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId, reason) => {
  const response = await apiClient.post(`/bookings/${bookingId}/cancel`, {
    reason,
  });
  return response.data;
};

/**
 * Get user bookings
 */
export const getMyBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);

  const response = await apiClient.get(`/bookings/my?${params}`);
  return response.data;
};

export default {
  createSchedules,
  createRecurringSchedules,
  getPackageSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  publishSchedule,
  createBooking,
  confirmBooking,
  cancelBooking,
  getMyBookings,
};
