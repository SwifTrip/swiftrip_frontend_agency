import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logoImage from "../../assets/logo.png";
import { verifyEmail, resendVerificationEmail } from "../../api/authService";
import { toast } from "react-toastify";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "Invalid verification link. Please check your email for the correct link.",
      );
      return;
    }

    // Use a flag to prevent double execution in StrictMode
    let isVerifying = false;

    const verify = async () => {
      // Prevent multiple simultaneous calls
      if (isVerifying) return;
      isVerifying = true;

      try {
        const data = await verifyEmail(token);

        console.log("Verification response data:", data);

        // Your backend returns: { success: true, message: "Email verified successfully" }
        if (data.success === true || data.success === "true") {
          setStatus("success");
          setMessage(
            data.message || "Your email has been verified successfully!",
          );
        } else {
          setStatus("error");
          setMessage(
            data.message ||
              "Invalid or expired verification token. Please request a new one.",
          );
        }
      } catch (err) {
        console.error("Verification catch block error:", err);

        // err should contain { success: false, message: "..." } from backend
        setStatus("error");
        setMessage(
          err.message ||
            "Unable to verify email. Please check your connection and try again.",
        );
      } finally {
        isVerifying = false;
      }
    };

    verify();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isVerifying = true; // Prevent any pending calls
    };
  }, [location]);

  const handleResendEmail = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setResending(true);
    try {
      const data = await resendVerificationEmail(email);

      if (data.success) {
        toast.success("Verification email sent! Check inbox and spam.");
        setEmail("");
      } else {
        toast.error(
          data.message ||
            "Failed to send verification email. Please try again.",
        );
      }
    } catch (err) {
      console.error("Resend error:", err);
      toast.error(err.message || "Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout mode="verify" showFormWrapper={false}>
      <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-orange-100/90 shadow-[0_30px_60px_-30px_rgba(234,88,12,0.45)] p-6 lg:p-7 text-center max-w-md mx-auto">
        {/* Logo */}
        {/* <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg">
            <img
              src={logoImage}
              alt="SwifTrip"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div> */}

        {/* Verifying State */}
        {status === "verifying" && (
          <div className="py-5">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-orange-600 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-sm text-gray-600">Please wait a moment...</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="py-5">
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
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Email Verified
            </h2>
            <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
              Your account is now active. You can start exploring amazing travel
              destinations with SwiftTrip.
            </p>

            <button
              onClick={() => navigate("/auth/login")}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 transition-all shadow-[0_18px_30px_-16px_rgba(234,88,12,0.95)] hover:shadow-[0_22px_34px_-16px_rgba(234,88,12,1)] ring-1 ring-orange-300/30"
            >
              Continue to Login →
            </button>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="py-5">
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-500 rounded-full opacity-20"></div>
              <div className="absolute inset-2 bg-white rounded-full border-4 border-red-500 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h2>
            <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
              {message}
            </p>

            {/* Resend Section */}
            <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-4 mb-5 border border-orange-100">
              <p className="text-[13px] font-medium text-gray-700 mb-3">
                Need a new verification link?
              </p>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100/80 mb-3"
              />
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full py-2.5 bg-white border border-orange-300 text-orange-700 text-sm font-semibold rounded-xl hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>

            <button
              onClick={() => navigate("/auth/login")}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:via-orange-600 hover:to-amber-600 transition-all shadow-[0_18px_30px_-16px_rgba(234,88,12,0.95)] hover:shadow-[0_22px_34px_-16px_rgba(234,88,12,1)] ring-1 ring-orange-300/30"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
