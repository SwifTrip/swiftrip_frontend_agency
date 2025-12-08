import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getPackages() {
  try {
    const response = await axios.get(`${API_BASE_URL}/packages`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch packages" };
  }
}

// Get single package by ID
export async function getPackageById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/package/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch package" };
  }
}

// src/api/packageService.js
export const createPackage = async (packageData) => {
  const formData = new FormData();

  formData.append('companyId', packageData.companyId);
  formData.append('title', packageData.title);
  formData.append('description', packageData.description || 'A beautiful tour package');
  formData.append('category', packageData.category);
  formData.append('basePrice', packageData.basePrice);
  formData.append('currency', packageData.currency);
  formData.append('maxGroupSize', packageData.maxGroupSize);
  formData.append('status', packageData.status);

  // SAFE JSON
  formData.append('includes', JSON.stringify(packageData.includes || {}));
  formData.append('itineraries', JSON.stringify(packageData.itineraries || []));
  formData.append("fromLocation", packageData.fromLocation);
  formData.append("toLocation", packageData.toLocation);
  // Media
  packageData.media?.forEach(m => m.file && formData.append('media', m.file));

  const res = await axios.post('http://localhost:3000/api/package/create', formData, {
    headers: { 
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

// Update package
export const updatePackage = async (id, formData) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/package/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to update package" };
  }
};

// Delete package
export async function deletePackage(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/package/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete package" };
  }
}