//src/router/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedRouter from './ProtectedRouter';
import { useAuth } from '../utils/auth/authContext';

// Placeholder for your main app pages
function Dashboard() {
  const { logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button 
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        
        {/* Protected app routes */}
        <Route 
          path="/app/*" 
          element={
            <ProtectedRouter>
              <Dashboard />
            </ProtectedRouter>
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}