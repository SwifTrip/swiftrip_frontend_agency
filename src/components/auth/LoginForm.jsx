import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectLoading,
  selectError,
  clearError,
} from "../../store/slices/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || null,
  );

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage(null);
      window.history.replaceState({}, document.title);
    }
  }, [successMessage]);

  // Show auth errors as toasts and clear state to avoid duplicate popups.
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));

      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/app/dashboard");
      } else {
        console.error("Login failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 lg:space-y-3.5">
        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50/70 px-3.5 py-2">
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-gray-700">
            Secure Sign In
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-orange-700">
            Encrypted Session
          </span>
        </div>

        {/* Social login buttons */}
        {/* <button 
            type="button" 
            className="w-full border border-gray-300 rounded-xl p-3.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <span className="text-xl font-bold text-[#EA4335]">G</span>
            <span>Continue with Google</span>
        </button>

        <button 
          type="button" 
          className="w-full bg-[#1877F2] text-white rounded-xl p-3.5 flex items-center justify-center gap-3 hover:bg-[#166FE5] transition font-medium"
        >
          <span className="text-xl font-bold">f</span>
          <span>Continue with Facebook</span>
        </button> */}

        {/* Divider */}
        {/* <div className="relative text-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div> */}

        {/* Email field */}
        <div>
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400"
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
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-3.5 py-3 border border-gray-300 rounded-xl text-sm bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.email?.message}
            </span>
          )}
        </div>

        {/* Password field */}
        <div>
          <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl text-sm bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.password?.message}
            </span>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-[13px]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2 text-[11px] text-gray-500">
          Use your agency email account to access bookings, invoices, and
          traveler insights.
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 transition-all shadow-[0_18px_30px_-16px_rgba(234,88,12,0.95)] hover:shadow-[0_22px_34px_-16px_rgba(234,88,12,1)] ring-1 ring-orange-300/30 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Sign up link */}
        <p className="text-center text-[13px] text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-orange-600 font-semibold hover:text-orange-700 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </form>
  );
}
