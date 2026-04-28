import axios from "axios";
import { getToken } from "../utils/auth/authHelper";

axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetch all roles
 * GET /api/roles
 */
export async function fetchRoles() {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to fetch roles" }
    );
  }
}

/**
 * Create a new role
 * POST /api/role/create
 * @param {Object} roleData - { name, permissionIds: [1,2,3], description? }
 */
export async function createRole(roleData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/role/create`, roleData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to create role" }
    );
  }
}

/**
 * Update an existing role
 * PUT /api/role/update/:id (FIXED: Changed from POST to PUT)
 * @param {number} roleId - Role ID
 * @param {Object} roleData - { name, permissionIds: [1,2,3], description? }
 */
export async function updateRole(roleId, roleData) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/role/update/${roleId}`,
      roleData,
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
      err.response?.data || { success: false, message: "Failed to update role" }
    );
  }
}

/**
 * Delete a role
 * DELETE /api/role/:id (FIXED: Removed /delete from path)
 * @param {number} roleId - Role ID
 */
export async function deleteRole(roleId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/role/${roleId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to delete role" }
    );
  }
}

/**
 * Fetch a single role by ID
 * GET /api/role/:id
 * @param {number} roleId - Role ID
 */
export async function fetchRoleById(roleId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/role/${roleId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || { success: false, message: "Failed to fetch role" }
    );
  }
}

// ===== PERMISSION OPERATIONS =====

/**
 * Fetch all available permissions
 * GET /api/permissions
 * NOTE: This endpoint needs to be created in your backend
 */
export async function fetchPermissions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/permissions`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (err) {
    throw (
      err.response?.data || {
        success: false,
        message: "Failed to fetch permissions",
      }
    );
  }
}
