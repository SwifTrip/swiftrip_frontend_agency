import axios from "axios";
import { getToken } from "../utils/auth/authHelper";

axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch all users
 * GET /api/users
 */
export async function fetchUsers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to fetch users" }
    );
  }
}

/**
 * Create a new user
 * POST /api/user/create
 */
export async function createUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/create`, userData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to create user" }
    );
  }
}

/**
 * Update an existing user
 * PUT /api/user/update/:id (FIXED: Changed from POST to PUT)
 */
export async function updateUser(userId, userData) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/update/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      },
    );
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to update user" }
    );
  }
}

/**
 * Delete a user
 * DELETE /api/user/:id (FIXED: Removed /delete from path)
 */
export async function deleteUser(userId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to delete user" }
    );
  }
}

/**
 * Fetch a single user by ID
 * GET /api/user/:id
 */
export async function fetchUserById(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to fetch user" }
    );
  }
}
