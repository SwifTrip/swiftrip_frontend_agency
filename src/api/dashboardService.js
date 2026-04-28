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

const numberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fallbackData = {
  metrics: {
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    averageBookingValue: 0,
    conversionRate: 0,
  },
  revenueTrend: [],
  dailyPerformance: [],
  revenueSources: [],
  topPackages: [],
  recentBookings: [],
};

const normalizeAnalytics = (analytics) => {
  if (!analytics || typeof analytics !== "object") return fallbackData;

  return {
    metrics: {
      totalBookings: numberOrZero(analytics?.metrics?.totalBookings),
      activeBookings: numberOrZero(analytics?.metrics?.activeBookings),
      completedBookings: numberOrZero(analytics?.metrics?.completedBookings),
      cancelledBookings: numberOrZero(analytics?.metrics?.cancelledBookings),
      pendingBookings: numberOrZero(analytics?.metrics?.pendingBookings),
      confirmedBookings: numberOrZero(analytics?.metrics?.confirmedBookings),
      totalRevenue: numberOrZero(analytics?.metrics?.totalRevenue),
      pendingAmount: numberOrZero(analytics?.metrics?.pendingAmount),
      averageBookingValue: numberOrZero(
        analytics?.metrics?.averageBookingValue,
      ),
      conversionRate: numberOrZero(analytics?.metrics?.conversionRate),
    },
    revenueTrend: Array.isArray(analytics?.revenueTrend)
      ? analytics.revenueTrend
      : [],
    dailyPerformance: Array.isArray(analytics?.dailyPerformance)
      ? analytics.dailyPerformance
      : [],
    revenueSources: Array.isArray(analytics?.revenueSources)
      ? analytics.revenueSources
      : [],
    topPackages: Array.isArray(analytics?.topPackages)
      ? analytics.topPackages
      : [],
    recentBookings: Array.isArray(analytics?.recentBookings)
      ? analytics.recentBookings
      : [],
  };
};

export const getDashboardAnalytics = async ({ companyId, months = 6 }) => {
  const response = await apiClient.get("/agency/dashboard", {
    params: { companyId, months },
  });

  if (!response?.data?.success) {
    throw new Error(response?.data?.error || "Failed to fetch dashboard data");
  }

  return normalizeAnalytics(response.data.analytics);
};
