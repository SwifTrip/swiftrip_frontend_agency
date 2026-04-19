import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import HeroImage from "../assets/hero.jpg";
import logoImage from "../assets/logo.png";

export default function AuthLayout({
  children,
  mode = "register",
  showFormWrapper = true,
}) {
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isVerify = mode === "verify";
  const isCompactCanvas = isLogin || isRegister || isVerify;
  const isCompactAuth = isCompactCanvas && showFormWrapper;
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/35 to-orange-100/30 relative overflow-hidden">
      {/* Decorative atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(251,146,60,0.12),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(253,186,116,0.08),transparent_37%),radial-gradient(circle_at_50%_100%,rgba(251,146,60,0.06),transparent_38%)]"></div>
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(251,146,60,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.35)_1px,transparent_1px)] [background-size:42px_42px]"></div>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white/88 backdrop-blur-xl border-b border-orange-100/60 shadow-[0_10px_30px_-22px_rgba(251,146,60,0.55)] w-full ${
          isCompactCanvas ? "h-14" : "h-16"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
        <div
          className={`px-4 sm:px-6 lg:px-8 ${isCompactCanvas ? "h-14" : "h-16"}`}
        >
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              <img
                src={logoImage}
                alt="SwifTrip Logo"
                className={`${isCompactCanvas ? "w-8 h-8" : "w-10 h-10"} object-contain`}
              />
              <div>
                <span
                  className={`${
                    isCompactCanvas ? "text-lg" : "text-xl"
                  } font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent`}
                >
                  SwifTrip
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500">AI-Powered</span>
                </div>
              </div>
            </div>

            {/* Nav Links - Desktop */}
            <div
              className={`hidden md:flex items-center flex-1 justify-center ${
                isCompactCanvas ? "gap-4" : "gap-6"
              }`}
            >
              <button
                onClick={() => handleNavigation("/")}
                className={`text-gray-600 hover:text-orange-600 transition-colors font-medium bg-transparent border-none cursor-pointer ${
                  isCompactCanvas ? "text-sm" : "text-base"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("/#features")}
                className={`text-gray-600 hover:text-orange-600 transition-colors font-medium bg-transparent border-none cursor-pointer ${
                  isCompactCanvas ? "text-sm" : "text-base"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => handleNavigation("/#use-cases")}
                className={`text-gray-600 hover:text-orange-600 transition-colors font-medium bg-transparent border-none cursor-pointer ${
                  isCompactCanvas ? "text-sm" : "text-base"
                }`}
              >
                Success Stories
              </button>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isLogin || isVerify ? (
                <>
                  <button
                    onClick={() => navigate("/auth/register")}
                    className={`text-gray-700 hover:text-orange-600 transition-colors ${
                      isCompactCanvas ? "px-4 py-1.5 text-sm" : "px-5 py-2"
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className={`bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl shadow-[0_10px_20px_-12px_rgba(234,88,12,0.8)] hover:shadow-[0_14px_26px_-12px_rgba(234,88,12,0.9)] transition-all ${
                      isCompactCanvas ? "px-4 py-2 text-sm" : "px-6 py-2.5"
                    }`}
                  >
                    Back Home
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/auth/login")}
                    className={`text-gray-700 hover:text-orange-600 transition-colors ${
                      isCompactCanvas ? "px-4 py-1.5 text-sm" : "px-5 py-2"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className={`bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl shadow-[0_10px_20px_-12px_rgba(234,88,12,0.8)] hover:shadow-[0_14px_26px_-12px_rgba(234,88,12,0.9)] transition-all ${
                      isCompactCanvas ? "px-4 py-2 text-sm" : "px-6 py-2.5"
                    }`}
                  >
                    Back Home
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className={`relative z-10 ${
          isCompactCanvas
            ? "px-4 sm:px-6 pt-16 pb-4"
            : "px-6 pt-24 pb-8 lg:pb-12"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center ${
            isCompactCanvas
              ? "gap-7 lg:gap-10 lg:min-h-[calc(100vh-4.75rem)]"
              : "gap-12"
          }`}
        >
          {/* Left side - Form or Custom Content */}
          <div
            className={`w-full max-w-md mx-auto lg:mx-0 ${
              isCompactCanvas ? "mt-1 lg:mt-0 lg:ml-3" : "mt-8 ml-6"
            }`}
          >
            {showFormWrapper ? (
              <div
                className={`bg-white/85 backdrop-blur-2xl rounded-3xl border border-orange-100/90 shadow-[0_30px_60px_-30px_rgba(234,88,12,0.45)] relative overflow-hidden ${
                  isCompactAuth ? "p-6 lg:p-7" : "p-8 lg:p-10"
                }`}
              >
                <div className="absolute -top-20 -right-14 w-48 h-48 rounded-full bg-gradient-to-br from-orange-300/30 to-amber-200/10 blur-2xl"></div>
                <div
                  className={`relative inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700 bg-orange-100/70 border border-orange-200/80 rounded-full px-3 py-1 ${
                    isCompactAuth ? "mb-3" : "mb-5"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Agency Portal
                </div>
                <h1
                  className={`${isCompactAuth ? "text-2xl" : "text-3xl"} font-bold text-gray-800`}
                >
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p
                  className={`text-gray-600 ${isCompactAuth ? "text-[13px] mt-1.5" : "text-sm mt-2"}`}
                >
                  {isLogin
                    ? "Sign in to continue your journey with SwiftTrip"
                    : "Join SwiftTrip and transform your travel agency"}
                </p>

                <div className={isCompactAuth ? "mt-5" : "mt-8"}>
                  {children ? children : <RegisterForm />}
                </div>
              </div>
            ) : (
              // For verify email page - no wrapper
              children
            )}
          </div>

          {/* Right side - Hero Image */}
          <div
            className={`hidden lg:block w-full ${
              isCompactCanvas ? "mt-2 -ml-2" : "mt-10 -ml-5"
            }`}
          >
            <div className="relative max-w-xl mx-auto">
              {/* Main image card with overlay text */}
              <div
                className={`relative rounded-3xl overflow-hidden border border-white/70 shadow-[0_35px_65px_-28px_rgba(15,23,42,0.45)] ${
                  isCompactCanvas ? "-mt-1" : "-mt-5"
                }`}
              >
                <img
                  src={HeroImage}
                  alt="Travel destination"
                  className={`w-full object-cover ${
                    isCompactCanvas ? "h-[440px]" : "h-[550px]"
                  }`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop";
                  }}
                />

                {/* Text overlay at bottom */}
                <div
                  className={`absolute ${isCompactCanvas ? "bottom-5 left-5 right-5" : "bottom-8 left-8 right-8"}`}
                >
                  <div
                    className={`bg-white/92 backdrop-blur-md rounded-2xl border border-orange-100/70 shadow-xl ${isCompactCanvas ? "p-4" : "p-6"}`}
                  >
                    <h2
                      className={`${isCompactCanvas ? "text-xl" : "text-2xl"} font-bold text-gray-800`}
                    >
                      Start Your Journey
                    </h2>
                    <p
                      className={`text-gray-600 ${isCompactCanvas ? "text-sm mt-0.5" : "mt-1"}`}
                    >
                      Discover amazing destinations with SwiftTrip
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div
                className={`absolute px-4 py-3 bg-white/95 border border-orange-100 rounded-2xl shadow-xl flex items-center gap-2 transform rotate-[-8deg] ${isCompactCanvas ? "-top-3 -left-3" : "-top-6 -left-6"}`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-xs font-semibold text-gray-700">
                  AI Routing
                </span>
              </div>
              <div
                className={`absolute px-4 py-3 bg-orange-500 text-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-[8deg] ${isCompactCanvas ? "top-1/4 -right-4" : "top-1/4 -right-6"}`}
              >
                <span className="text-xs font-semibold tracking-wide">
                  Live Analytics
                </span>
              </div>
              <div
                className={`absolute px-3 py-2 bg-white/95 border border-orange-100 rounded-full shadow-lg flex items-center justify-center ${isCompactCanvas ? "-bottom-4 right-1/4" : "-bottom-6 right-1/4"}`}
              >
                <span className="text-[11px] font-semibold text-orange-700">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative icons in corners */}
      {!isCompactCanvas && (
        <>
          <div className="absolute bottom-8 left-8 px-4 py-2 bg-white/90 border border-orange-100 rounded-full shadow-lg flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              Trusted by Agencies
            </span>
          </div>
          <div className="absolute bottom-8 right-8 w-12 h-12 bg-orange-500 rounded-full shadow-lg flex items-center justify-center">
            <span className="text-white text-lg">✦</span>
          </div>
        </>
      )}
    </div>
  );
}
