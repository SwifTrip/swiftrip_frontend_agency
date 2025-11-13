import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import packageReducer from './slices/packageSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    packages: packageReducer,
    // Add more reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if you store non-serializable data
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools
});
