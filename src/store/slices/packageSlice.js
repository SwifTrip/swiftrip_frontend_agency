import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/packageService';

// Fetch all packages
export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPackages();
      return response.data; // Return the data array from API response
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch packages');
    }
  }
);

// Fetch single package by ID
export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getPackageById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch package');
    }
  }
);

// Create new package
export const createPackage = createAsyncThunk(
  'packages/create',
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await api.createPackage(packageData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create package');
    }
  }
);

// Update package
export const updatePackage = createAsyncThunk(
  'packages/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.updatePackage(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update package');
    }
  }
);

// Delete package
export const deletePackage = createAsyncThunk(
  'packages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.deletePackage(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete package');
    }
  }
);

// ============================================
// INITIAL STATE
// ============================================

const initialState = {
  packages: [],
  currentPackage: null,
  loading: false,
  error: null,
  stats: {
    total: 0,
    active: 0,
    draft: 0,
    inactive: 0,
  },
};

// ============================================
// SLICE
// ============================================

const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    setCurrentPackage: (state, action) => {
      state.currentPackage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state) => {
      state.stats.total = state.packages.length;
      state.stats.active = state.packages.filter(p => p.status === 'ACTIVE').length;
      state.stats.draft = state.packages.filter(p => p.status === 'DRAFT').length;
      state.stats.inactive = state.packages.filter(p => p.status === 'INACTIVE').length;
    },
  },
  extraReducers: (builder) => {
    // Fetch all packages
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
        packageSlice.caseReducers.updateStats(state);
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single package
    builder
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPackage = action.payload;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create package
    builder
      .addCase(createPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages.unshift(action.payload); // Add to beginning
        packageSlice.caseReducers.updateStats(state);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update package
    builder
      .addCase(updatePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.packages.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
        packageSlice.caseReducers.updateStats(state);
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete package
    builder
      .addCase(deletePackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = state.packages.filter(p => p.id !== action.payload);
        packageSlice.caseReducers.updateStats(state);
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setCurrentPackage, clearError, updateStats } = packageSlice.actions;

// Export selectors
export const selectPackages = (state) => state.packages.packages;
export const selectCurrentPackage = (state) => state.packages.currentPackage;
export const selectPackageLoading = (state) => state.packages.loading;
export const selectPackageError = (state) => state.packages.error;
export const selectPackageStats = (state) => state.packages.stats;

// Export reducer
export default packageSlice.reducer;