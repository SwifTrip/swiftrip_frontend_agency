import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword } from "../../api/authService";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const data = await forgotPassword(email);

      if (data.success) {
        toast.success("Password reset link sent to your email");
        setSuccess(true);
      } else {
        toast.error(data.message || "Failed to send reset email");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout mode="login" showFormWrapper={false}>
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-orange-100/90 shadow-[0_30px_60px_-30px_rgba(234,88,12,0.45)] p-6 lg:p-7 text-center max-w-md mx-auto">
          {/* Success Icon */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20"></div>
            <div className="absolute inset-2 bg-white border border-orange-200 rounded-full flex items-center justify-center">
              <svg
                className="w-9 h-9 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            We've sent a password reset link to{" "}
            <span className="font-medium text-gray-800">{email}</span>. Please
            check your inbox and spam folder.
          </p>

          <button
            onClick={() => navigate("/auth/login")}
            className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 transition-all shadow-[0_18px_30px_-16px_rgba(234,88,12,0.95)] hover:shadow-[0_22px_34px_-16px_rgba(234,88,12,1)] ring-1 ring-orange-300/30"
          >
            Back to Login
          </button>

          <div className="mt-6">
            <button
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
              className="text-[13px] text-orange-600 hover:text-orange-700 font-medium"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout mode="login" showFormWrapper={false}>
      <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-orange-100/90 shadow-[0_30px_60px_-30px_rgba(234,88,12,0.45)] p-6 lg:p-7 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-orange-200">
            <svg
              className="w-7 h-7 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
          <p className="text-[13px] text-gray-600 mt-1.5">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] font-semibold text-gray-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 transition-all shadow-[0_18px_30px_-16px_rgba(234,88,12,0.95)] hover:shadow-[0_22px_34px_-16px_rgba(234,88,12,1)] ring-1 ring-orange-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="text-[13px] text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
