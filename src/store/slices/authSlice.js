import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/authService';
import { saveToken, getToken, clearToken } from '../../utils/auth/authHelper';

// Register user - async action
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.registerUser(userData);
      if (response.token) {
        saveToken(response.token);
      }
      return response; // This becomes action.payload in fulfilled
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login user - async action
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.loginUser(credentials);
      if (response.token) {
        saveToken(response.token);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const initialState = {
  user: null,
  token: getToken(),
  loading: false,
  error: null,
  isAuthenticated: !!getToken(),
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    logout: (state) => {
      clearToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Register cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || { email: action.payload.email };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        
        // Save full user from data field
        const userData = action.payload.data;
        
        state.user = {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          companyId: userData.companyId,
          role: userData.role,
        };
        
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { logout, clearError, setUser } = authSlice.actions;

// Export selectors (functions to read state)
export const selectUser = (state) => state.auth.user;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Export reducer
export default authSlice.reducer;