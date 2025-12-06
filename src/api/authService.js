import axios from "axios";

axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerUser(formData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Registration Failed" };
  }
}

export async function loginUser(formData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Login Failed" };
  }
}

export async function verifyEmail(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/verify-email?token=${token}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: "Verification Failed" };
  }
}

export async function resendVerificationEmail(email) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/resend-verification`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: "Failed to resend email" };
  }
}

export async function forgotPassword(email) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/forgot-password`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: "Failed to send reset email" };
  }
}

export async function resetPassword(token, password) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/reset-password`,
      { token, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err) {
    throw err.response?.data || { success: false, message: "Failed to reset password" };
  }
}