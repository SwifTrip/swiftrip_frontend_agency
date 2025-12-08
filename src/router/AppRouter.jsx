//src/router/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PackagesPage from '../pages/dashboard/PackagesPage';
import CreatePackagePage from '../pages/dashboard/CreatePackagePage';
import PackageDetailsPage from '../pages/dashboard/PackageDetailsPage';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRouter from './ProtectedRouter';
import AuthRedirect from './AuthRedirect';
import LandingPage from '../pages/landingPage/LandingPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import UsersPage from '../pages/user/UsersPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

        
        {/* Protected app routes */}
        <Route 
          path="/app/*" 
          element={
            <ProtectedRouter>
              <DashboardLayout>
                <Routes>
                  {/* Dashboard routes */}
                  <Route path="dashboard" element={<PackagesPage />} />
                  <Route path="packages" element={<PackagesPage />} />
                  <Route path="packages/create" element={<CreatePackagePage />} />
                  <Route path="packages/:id" element={<PackageDetailsPage />} />
                  <Route path="packages/edit/:id" element={<CreatePackagePage />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="payments" element={<div className="p-8"><h1>Payments Page</h1></div>} />
                  <Route path="analytics" element={<div className="p-8"><h1>Analytics Page</h1></div>} />
                  <Route path="settings" element={<div className="p-8"><h1>Settings Page</h1></div>} />
                  
                  {/* Default redirect to packages */}
                  <Route path="" element={<Navigate to="/app/packages" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRouter>
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}