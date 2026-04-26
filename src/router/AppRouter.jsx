//src/router/AppRouter.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logoImage from "../assets/logo.png";

// Loading spinner component
const PageLoader = () => (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/35 backdrop-blur-md">
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-orange-200/70 bg-white/75 px-8 py-7 shadow-2xl">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-orange-300 border-t-orange-600 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-white shadow-inner flex items-center justify-center">
          <img
            src={logoImage}
            alt="SwifTrip"
            className="h-9 w-9 object-contain animate-pulse"
          />
        </div>
      </div>
      <p className="text-orange-800 text-sm font-semibold tracking-wide">
        Loading SwifTrip...
      </p>
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
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const ProfilePage = lazy(() => import("../pages/settings/ProfilePage"));
const CompanySettingsPage = lazy(
  () => import("../pages/settings/CompanySettingsPage"),
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
const KnowledgeBasePage = lazy(
  () => import("../pages/knowledgeBase/KnowledgeBasePage"),
);

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
                    <Route path="dashboard" element={<DashboardPage />} />
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
                      path="knowledge-base"
                      element={<KnowledgeBasePage />}
                    />

                    {/* Account settings routes */}
                    <Route path="profile" element={<ProfilePage />} />
                    <Route
                      path="company-settings"
                      element={<CompanySettingsPage />}
                    />

                    {/* Default redirect to dashboard */}
                    <Route
                      path=""
                      element={<Navigate to="/app/dashboard" replace />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/app/dashboard" replace />}
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
                to={isAuthenticated ? "/app/dashboard" : "/auth/login"}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
