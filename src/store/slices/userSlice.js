import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userService from "../../api/userService";

export const fetchUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.fetchUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Create a new user
 */
export const createUserAsync = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Update an existing user
 */
export const updateUserAsync = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(userId, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Delete a user
 */
export const deleteUserAsync = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser(userId);
      return { userId, ...response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Fetch a single user by ID
 */
export const fetchUserByIdAsync = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.fetchUserById(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ===== INITIAL STATE =====
const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  success: null,
};

// ===== SLICE =====
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserSuccess: (state) => {
      state.success = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      });

    // Create User
    builder
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.success = "User created successfully";
        state.error = null;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create user";
        state.success = null;
      });

    // Update User
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.success = "User updated successfully";
        state.error = null;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update user";
        state.success = null;
      });

    // Delete User
    builder
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.userId
        );
        state.success = "User deleted successfully";
        state.error = null;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete user";
        state.success = null;
      });

    // Fetch User By ID
    builder
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user";
      });
  },
});

// ===== ACTIONS =====
export const { clearUserError, clearUserSuccess, clearSelectedUser } =
  userSlice.actions;

// ===== SELECTORS =====
export const selectUsers = (state) => state.users.users;
export const selectSelectedUser = (state) => state.users.selectedUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersSuccess = (state) => state.users.success;

// ===== REDUCER =====
export default userSlice.reducer;