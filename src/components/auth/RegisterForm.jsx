import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectLoading,
  selectError,
  clearError,
} from "../../store/slices/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character",
    )
    .required("Password is required"),
  companyName: yup.string().required("Company Name is required"),
  companyRegistrationNumber: yup
    .string()
    .required("Registration Number is required"),
  agree: yup.boolean().oneOf([true], "You must agree to continue"),
});

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [showPassword, setShowPassword] = useState(false);
  const [legalModal, setLegalModal] = useState(null);

  const legalContent = {
    terms: {
      title: "Terms of Service",
      items: [
        "Agency accounts must provide accurate business and registration information.",
        "You are responsible for all activity performed under your account credentials.",
        "Platform misuse, fraudulent listings, or policy violations can result in suspension.",
        "Commission, payout, and billing operations are governed by SwifTrip commercial policies.",
      ],
    },
    privacy: {
      title: "Privacy Policy",
      items: [
        "We collect account and operational data required to deliver booking and agency services.",
        "Data is processed securely and access is restricted based on business need.",
        "We do not sell personal information to third parties for marketing purposes.",
        "You can request account data updates or deletion according to applicable regulations.",
      ],
    },
  };

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
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const password = watch("password", "");

  // Password strength checker
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score <= 4) return { score, label: "Good", color: "bg-orange-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(registerUser(data));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success(
          "Registration successful! Please check your email to verify your account.",
        );
        setTimeout(() => {
          navigate("/auth/login", {
            state: {
              successMessage: null,
            },
          });
        }, 1500);
      }
      // Error handling is done in useEffect watching Redux error state
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50/70 px-3.5 py-2">
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-gray-700">
            Agency Onboarding
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-orange-700">
            Verified Workspace
          </span>
        </div>

        {/* Social buttons */}
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
        {/* <div className="relative text-center my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or register with email</span>
          </div>
        </div> */}

        {/* Name fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register("firstName")}
              autoComplete="given-name"
              placeholder="First Name"
              className="p-3 border border-gray-300 rounded-xl w-full text-sm bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName?.message}
              </p>
            )}
          </div>

          <div>
            <input {...register("role")} type="hidden" value="AGENCY_STAFF" />
            <input
              {...register("lastName")}
              autoComplete="family-name"
              placeholder="Last Name"
              className="p-3 border border-gray-300 rounded-xl w-full text-sm bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName?.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@travelagency.com"
            className="w-full p-3 border border-gray-300 rounded-xl text-sm bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            autoComplete="new-password"
            placeholder="Create a strong password"
            className="w-full p-3 pr-11 border border-gray-300 rounded-xl text-sm bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
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
        {/* Password strength indicator */}
        {password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    i <= passwordStrength.score
                      ? passwordStrength.color
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs">
              <span
                className={`font-medium ${
                  passwordStrength.score <= 2
                    ? "text-red-500"
                    : passwordStrength.score <= 3
                      ? "text-yellow-600"
                      : passwordStrength.score <= 4
                        ? "text-orange-500"
                        : "text-green-600"
                }`}
              >
                {passwordStrength.label}
              </span>
              <div className="text-gray-400 space-x-2">
                <span
                  className={/[a-z]/.test(password) ? "text-green-500" : ""}
                >
                  a-z
                </span>
                <span
                  className={/[A-Z]/.test(password) ? "text-green-500" : ""}
                >
                  A-Z
                </span>
                <span
                  className={/[0-9]/.test(password) ? "text-green-500" : ""}
                >
                  0-9
                </span>
                <span
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(password)
                      ? "text-green-500"
                      : ""
                  }
                >
                  !@#
                </span>
              </div>
            </div>
          </div>
        )}
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password?.message}
          </p>
        )}

        {/* Company details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register("companyName")}
              autoComplete="organization"
              placeholder="Your Travel Agency"
              className="p-3 border border-gray-300 rounded-xl text-sm w-full bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName?.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("companyRegistrationNumber")}
              autoComplete="off"
              placeholder="REG-123456"
              className="p-3 border border-gray-300 rounded-xl text-sm w-full bg-white/80 placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 focus:outline-none transition"
            />
            {errors.companyRegistrationNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyRegistrationNumber?.message}
              </p>
            )}
          </div>
        </div>

        {/* Agency type - Hidden */}
        {/* <select
          {...register("agencyType")}
          className="p-3.5 border border-gray-300 rounded-xl text-sm w-full bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition text-gray-600"
        >
          <option value="">Agency Type (Optional)</option>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
          <option value="corporate">Corporate</option>
        </select> */}

        {/* Terms checkbox */}
        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-3">
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              {...register("agree")}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <div className="flex-1">
              <p className="text-[13px] text-gray-700 leading-relaxed">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setLegalModal("terms")}
                  className="text-orange-700 hover:text-orange-800 font-semibold underline underline-offset-2"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => setLegalModal("privacy")}
                  className="text-orange-700 hover:text-orange-800 font-semibold underline underline-offset-2"
                >
                  Privacy Policy
                </button>
                .
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                By continuing, you confirm authority to represent your agency
                and accept compliance obligations.
              </p>
            </div>
          </div>
        </div>
        {errors.agree && (
          <p className="text-red-500 text-xs">{errors.agree?.message}</p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 transition-all shadow-[0_18px_30px_-16px_rgba(234,88,12,0.95)] hover:shadow-[0_22px_34px_-16px_rgba(234,88,12,1)] ring-1 ring-orange-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Complete Registration"}
        </button>

        {/* Sign in link */}
        <p className="text-center text-[13px] text-gray-600 mt-3">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-orange-600 font-semibold hover:text-orange-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {legalModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-orange-100 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100 bg-orange-50/60">
              <h3 className="text-base font-semibold text-gray-800">
                {legalContent[legalModal].title}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/80 transition-colors"
                aria-label="Close legal details"
              >
                x
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              {legalContent[legalModal].items.map((item) => (
                <div
                  key={item}
                  className="flex gap-2.5 text-[13px] text-gray-700"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-orange-100 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 transition-all"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
