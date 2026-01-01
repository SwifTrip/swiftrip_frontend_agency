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
 * Get all packages
 */
export const getAllPackages = async (filters = {}) => {
  const response = await apiClient.get("/packages", { params: filters });
  return response.data;
};

/**
 * Get package by ID
 */
export const getPackageById = async (id) => {
  const response = await apiClient.get(`/package/${id}`);
  return response.data;
};

/**
 * Create package
 */
export const createPackage = async (formData) => {
  const response = await apiClient.post("/package/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Update package
 */
export const updatePackage = async (id, formData) => {
  const response = await apiClient.put(`/package/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Delete package
 */
export const deletePackage = async (id) => {
  const response = await apiClient.delete(`/package/${id}`);
  return response.data;
};

/**
 * Extract package from PDF
 */
export const extractFromPDF = async (formData) => {
  const response = await apiClient.post("/package/extract-from-pdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  extractFromPDF,
};
