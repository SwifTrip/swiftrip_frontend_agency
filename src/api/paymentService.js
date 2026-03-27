import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch payment details for the authenticated agency.
 * Returns { pendingAmount, availableAmount, totalAmount }
 */
export const getPaymentDetails = async () => {
  const response = await apiClient.post("/payments/details");
  return response.data;
};

/**
 * Redeem (withdraw) all available balance to the connected Stripe account.
 */
export const redeemPayment = async (payload = {}) => {
  const response = await apiClient.post("/payments/redeem", payload);
  return response.data;
};

export const getStripeConnectStatus = async () => {
  const response = await apiClient.get("/payments/connect/status");
  return response.data;
};

export const createStripeConnectOnboardingLink = async () => {
  const response = await apiClient.post("/payments/connect/onboarding-link");
  return response.data;
};

export default {
  getPaymentDetails,
  redeemPayment,
  getStripeConnectStatus,
  createStripeConnectOnboardingLink,
};
