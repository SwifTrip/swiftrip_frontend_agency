//src/router/AppRouter.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Loading spinner component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white text-sm">Loading...</p>
    </div>
  </div>
);

// Lazy load all pages for better performance
const LandingPage = lazy(() => import("../pages/landingPage/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const VerifyEmailPage = lazy(() => import("../pages/auth/VerifyEmailPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const PackagesPage = lazy(() => import("../pages/dashboard/PackagesPage"));
const CreatePackagePage = lazy(
  () => import("../pages/dashboard/CreatePackagePage"),
);
const EditPackagePage = lazy(
  () => import("../pages/dashboard/EditPackagePage"),
);
const PackageDetailsPage = lazy(
  () => import("../pages/dashboard/PackageDetailsPage"),
);
const PackageSchedules = lazy(
  () => import("../pages/package/PackageSchedules"),
);
const UsersPage = lazy(() => import("../pages/user/UsersPage"));

// Booking pages
const BookingsPage = lazy(() => import("../pages/booking/BookingsPage"));
const BookingDetailsPage = lazy(
  () => import("../pages/booking/BookingDetailsPage"),
);

// Payment pages
const PaymentsPage = lazy(() => import("../pages/payment/PaymentsPage"));

// Chat page
const ChatPage = lazy(() => import("../pages/chat/ChatPage"));

// Keep these as regular imports (needed immediately)
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRouter from "./ProtectedRouter";
import AuthRedirect from "./AuthRedirect";
import { selectIsAuthenticated } from "../store/slices/authSlice";

export default function AppRouter() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Auth routes */}
          <Route
            path="/auth/login"
            element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/auth/register"
            element={
              <AuthRedirect>
                <RegisterPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/auth/verify-email"
            element={
              <AuthRedirect>
                <VerifyEmailPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <AuthRedirect>
                <ForgotPasswordPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <AuthRedirect>
                <ResetPasswordPage />
              </AuthRedirect>
            }
          />

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
                    <Route
                      path="packages/create"
                      element={<CreatePackagePage />}
                    />
                    <Route
                      path="packages/:id"
                      element={<PackageDetailsPage />}
                    />
                    <Route
                      path="packages/:packageId/schedules"
                      element={<PackageSchedules />}
                    />
                    <Route
                      path="packages/edit/:id"
                      element={<EditPackagePage />}
                    />
                    <Route path="users" element={<UsersPage />} />

                    {/* Booking routes */}
                    <Route path="bookings" element={<BookingsPage />} />
                    <Route
                      path="bookings/:id"
                      element={<BookingDetailsPage />}
                    />

                    {/* Payment routes */}
                    <Route path="payments" element={<PaymentsPage />} />

                    {/* Chat routes */}
                    <Route path="chat" element={<ChatPage />} />

                    <Route
                      path="analytics"
                      element={
                        <div className="p-8">
                          <h1>Analytics Page</h1>
                        </div>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <div className="p-8">
                          <h1>Settings Page</h1>
                        </div>
                      }
                    />

                    {/* Default redirect to packages */}
                    <Route
                      path=""
                      element={<Navigate to="/app/packages" replace />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/app/packages" replace />}
                    />
                  </Routes>
                </DashboardLayout>
              </ProtectedRouter>
            }
          />

          {/* Catch all */}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? "/app/packages" : "/auth/login"}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
