import axios from "axios";
import { getToken } from "../utils/auth/authHelper";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeError = (err, fallbackMessage) => {
  const data = err?.response?.data;
  return {
    message: data?.message || err?.message || fallbackMessage,
  };
};

export const getMyProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/me`, {
      headers: {
        ...getAuthHeader(),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw normalizeError(err, "Failed to fetch profile");
  }
};

export const updateMyProfile = async ({ firstName, lastName }) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/me`,
      { firstName, lastName },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err) {
    throw normalizeError(err, "Failed to update profile");
  }
};

export const getMyCompanySettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/company/me`, {
      headers: {
        ...getAuthHeader(),
      },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw normalizeError(err, "Failed to fetch company settings");
  }
};

export const updateMyCompanySettings = async ({ name, registrationNumber }) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/company/me`,
      { name, registrationNumber },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err) {
    throw normalizeError(err, "Failed to update company settings");
  }
};
