import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/packageService";

// Fetch all packages
export const fetchPackages = createAsyncThunk(
  "packages/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPackages();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch packages");
    }
  },
);

// Fetch single package by ID
export const fetchPackageById = createAsyncThunk(
  "packages/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getPackageById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch package");
    }
  },
);

// Create new package
export const createPackage = createAsyncThunk(
  "packages/create",
  async (packageData, { rejectWithValue }) => {
    try {
      const response = await api.createPackage(packageData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(
        error?.message
          ? error
          : { message: "Failed to create package", fieldErrors: [] },
      );
    }
  },
);

// Update package
export const updatePackage = createAsyncThunk(
  "packages/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log("🟦 Redux updatePackage thunk called with id:", id);
      const response = await api.updatePackage(id, data);
      console.log("🟩 Redux received response:", response);
      // FIX: Extract the data property if needed
      const result = response.data || response;
      console.log("🟩 Redux returning result:", result);
      return result;
    } catch (error) {
      console.error("🟥 Redux updatePackage error caught:", error);
      console.error("🟥 Error object:", error);
      // Handle axios error response structure
      const normalizedError = error?.message
        ? error
        : { message: "Failed to update package", fieldErrors: [] };
      console.error("🟥 Redux rejecting with message:", normalizedError);
      return rejectWithValue(normalizedError);
    }
  },
);

// Delete package
export const deletePackage = createAsyncThunk(
  "packages/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.deletePackage(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete package");
    }
  },
);

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

const packageSlice = createSlice({
  name: "packages",
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
      state.stats.active = state.packages.filter(
        (p) => p.status === "ACTIVE",
      ).length;
      state.stats.draft = state.packages.filter(
        (p) => p.status === "DRAFT",
      ).length;
      state.stats.inactive = state.packages.filter(
        (p) => p.status === "INACTIVE",
      ).length;
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
        // Now action.payload contains the actual package data
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
        state.packages.unshift(action.payload);
        packageSlice.caseReducers.updateStats(state);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update package
    builder
      .addCase(updatePackage.pending, (state) => {
        console.log("🟦 updatePackage.pending triggered");
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        console.log("🟩 updatePackage.fulfilled triggered");
        console.log("🟩 Action payload:", action.payload);
        state.loading = false;
        state.error = null;
        // Handle both direct payload and nested data structure
        const updatedPackage = action.payload?.data || action.payload;
        console.log("🟩 Updated package to store:", updatedPackage);
        if (updatedPackage?.id) {
          const index = state.packages.findIndex(
            (p) => p.id === updatedPackage.id,
          );
          if (index !== -1) {
            state.packages[index] = updatedPackage;
            console.log("🟩 Updated package at index:", index);
          }
          // Also update currentPackage if it's the same package
          if (state.currentPackage?.id === updatedPackage.id) {
            state.currentPackage = updatedPackage;
            console.log("🟩 Updated currentPackage");
          }
        } else {
          console.warn("⚠️ Updated package has no id:", updatedPackage);
        }
        packageSlice.caseReducers.updateStats(state);
      })
      .addCase(updatePackage.rejected, (state, action) => {
        console.error("🟥 updatePackage.rejected triggered");
        console.error("🟥 Error payload:", action.payload);
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
        state.packages = state.packages.filter((p) => p.id !== action.payload);
        // Clear currentPackage if it was deleted
        if (state.currentPackage?.id === action.payload) {
          state.currentPackage = null;
        }
        packageSlice.caseReducers.updateStats(state);
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setCurrentPackage, clearError, updateStats } =
  packageSlice.actions;

// Export selectors
export const selectPackages = (state) => state.packages.packages;
export const selectCurrentPackage = (state) => state.packages.currentPackage;
export const selectPackageLoading = (state) => state.packages.loading;
export const selectPackageError = (state) => state.packages.error;
export const selectPackageStats = (state) => state.packages.stats;

// Export reducer
export default packageSlice.reducer;
