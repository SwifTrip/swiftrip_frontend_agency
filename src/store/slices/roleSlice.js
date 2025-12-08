import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as roleService from "../../api/roleService";

export const fetchRolesAsync = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.fetchRoles();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Create a new role
 */
export const createRoleAsync = createAsyncThunk(
  "roles/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Update an existing role
 */
export const updateRoleAsync = createAsyncThunk(
  "roles/updateRole",
  async ({ roleId, roleData }, { rejectWithValue }) => {
    try {
      const response = await roleService.updateRole(roleId, roleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Delete a role
 */
export const deleteRoleAsync = createAsyncThunk(
  "roles/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await roleService.deleteRole(roleId);
      return { roleId, ...response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Fetch a single role by ID
 */
export const fetchRoleByIdAsync = createAsyncThunk(
  "roles/fetchRoleById",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await roleService.fetchRoleById(roleId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Fetch all permissions
 */
export const fetchPermissionsAsync = createAsyncThunk(
  "roles/fetchPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await roleService.fetchPermissions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  roles: [],
  permissions: [],
  selectedRole: null,
  loading: false,
  error: null,
  success: null,
};

// ===== SLICE =====
const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    clearRoleSuccess: (state) => {
      state.success = null;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Roles
    builder
      .addCase(fetchRolesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRolesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch roles";
      });

    // Create Role
    builder
      .addCase(createRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
        state.success = "Role created successfully";
        state.error = null;
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create role";
        state.success = null;
      });

    // Update Role
    builder
      .addCase(updateRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(
          (role) => role.id === action.payload.id
        );
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.success = "Role updated successfully";
        state.error = null;
      })
      .addCase(updateRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update role";
        state.success = null;
      });

    // Delete Role
    builder
      .addCase(deleteRoleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteRoleAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter(
          (role) => role.id !== action.payload.roleId
        );
        state.success = "Role deleted successfully";
        state.error = null;
      })
      .addCase(deleteRoleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete role";
        state.success = null;
      });

    // Fetch Role By ID
    builder
      .addCase(fetchRoleByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRole = action.payload;
        state.error = null;
      })
      .addCase(fetchRoleByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch role";
      });

    // Fetch Permissions
    builder
      .addCase(fetchPermissionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
        state.error = null;
      })
      .addCase(fetchPermissionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch permissions";
      });
  },
});

// ===== ACTIONS =====
export const { clearRoleError, clearRoleSuccess, clearSelectedRole } =
  roleSlice.actions;

// ===== SELECTORS =====
export const selectRoles = (state) => state.roles.roles;
export const selectPermissions = (state) => state.roles.permissions;
export const selectSelectedRole = (state) => state.roles.selectedRole;
export const selectRolesLoading = (state) => state.roles.loading;
export const selectRolesError = (state) => state.roles.error;
export const selectRolesSuccess = (state) => state.roles.success;

// ===== REDUCER =====
export default roleSlice.reducer;