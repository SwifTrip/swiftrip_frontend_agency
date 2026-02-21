/**
 * Payout Modal Component - Stripe Connect Flow
 *
 * Implements the exact Stripe Connect payout flow:
 * 1. Agency initiates payout from connected account balance
 * 2. Stripe creates a payout to the external bank account
 * 3. Payout goes through: pending → in_transit → paid
 *
 * Reference: https://stripe.com/docs/connect/payouts
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  MINIMUM_PAYOUT_AMOUNT,
  PAYOUT_CONFIG,
  PAYOUT_METHOD,
  formatCurrency,
  getEstimatedArrivalDate,
} from "../../utils/paymentConstants";

export default function PayoutModal({
  isOpen,
  onClose,
  availableBalance,
  bankAccount,
  onSubmit,
  isSubmitting,
}) {
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState(PAYOUT_METHOD.STANDARD);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Amount, 2: Confirm

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setError("");
      setStep(1);
      setPayoutMethod(PAYOUT_METHOD.STANDARD);
    }
  }, [isOpen]);

  // Calculate estimated arrival based on payout method
  const estimatedArrival = useMemo(() => {
    return getEstimatedArrivalDate(payoutMethod);
  }, [payoutMethod]);

  // Format arrival date for display
  const formatArrivalDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
    setError("");
  };

  const handleWithdrawAll = () => {
    setAmount(availableBalance.toString());
    setError("");
  };

  const validateAmount = () => {
    const numAmount = Number(amount);

    if (!amount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    if (numAmount < MINIMUM_PAYOUT_AMOUNT) {
      setError(`Minimum payout is ${formatCurrency(MINIMUM_PAYOUT_AMOUNT)}`);
      return false;
    }

    if (numAmount > availableBalance) {
      setError("Amount exceeds available balance");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateAmount()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit payout request with Stripe-like payload
    onSubmit({
      amount: Number(amount),
      currency: "pkr",
      method: payoutMethod,
      destination: bankAccount?.id,
      description: "Manual payout",
      statement_descriptor: "SWIFTRIP PAYOUT",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {step === 1 ? "Request Payout" : "Confirm Payout"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Step 1: Amount Selection */}
          {step === 1 && (
            <div className="p-6">
              {/* Available Balance Card */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(availableBalance)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    PKR
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className={`w-full pl-16 pr-4 py-4 text-2xl font-bold border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      error ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </p>
                )}

                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    onClick={handleWithdrawAll}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Withdraw all ({formatCurrency(availableBalance)})
                  </button>
                  <span className="text-xs text-gray-400">
                    Min: {formatCurrency(MINIMUM_PAYOUT_AMOUNT)}
                  </span>
                </div>
              </div>

              {/* Payout Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payout Speed
                </label>
                <div className="space-y-3">
                  {/* Standard Payout */}
                  <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      payoutMethod === PAYOUT_METHOD.STANDARD
                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payoutMethod"
                      value={PAYOUT_METHOD.STANDARD}
                      checked={payoutMethod === PAYOUT_METHOD.STANDARD}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          Standard
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          Free
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {PAYOUT_CONFIG.standardArrivalDays.min}-
                        {PAYOUT_CONFIG.standardArrivalDays.max} business days
                      </p>
                    </div>
                    {payoutMethod === PAYOUT_METHOD.STANDARD && (
                      <svg
                        className="w-5 h-5 text-orange-600 ml-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>

                  {/* Instant Payout (Disabled for PKR) */}
                  <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-not-allowed opacity-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          Instant
                        </span>
                        <span className="text-sm text-gray-400 font-medium">
                          1% fee
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Within 30 minutes
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Not available in Pakistan
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={!amount}
                className="w-full py-3.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="p-6">
              {/* Payout Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Payout Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(Number(amount))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      You'll receive
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(Number(amount))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Destination Bank Account */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <div className="flex items-center p-4 border border-gray-200 rounded-xl bg-white">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {bankAccount?.bankName}
                    </p>
                    <p className="text-sm text-gray-500">
                      •••• {bankAccount?.last4} · {bankAccount?.accountHolder}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Estimated Arrival */}
              <div className="mb-6">
                <div className="flex items-center p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Estimated arrival: {formatArrivalDate(estimatedArrival)}
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Standard bank transfer ·{" "}
                      {PAYOUT_CONFIG.standardArrivalDays.min}-
                      {PAYOUT_CONFIG.standardArrivalDays.max} business days
                    </p>
                  </div>
                </div>
              </div>

              {/* Stripe Branding */}
              <div className="flex items-center justify-center mb-6 py-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Secured by</span>
                <svg className="h-4 ml-1.5" viewBox="0 0 60 25" fill="none">
                  <path
                    d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a12.18 12.18 0 01-4.92.93c-4.13 0-6.8-2.25-6.8-6.9 0-3.97 2.35-6.98 6.25-6.98 3.65 0 6.3 2.64 6.3 7.87l-.02.16zm-4.59-2.82c0-1.42-.68-2.06-1.73-2.06-1.05 0-1.78.63-1.9 2.06h3.63zM43.3 5.1v2.62h2.2v3.48h-2.2v4.13c0 1.08.62 1.27 1.34 1.27.39 0 .79-.04.79-.04v3.72s-.68.08-1.48.08c-2.65 0-5.09-.95-5.09-4.72V11.2h-1.68V7.72h1.68V5.1h4.44zM33.27 17.96h4.44V7.72h-4.44v10.24zm2.22-11.62c-1.43 0-2.44-.89-2.44-2.22 0-1.35 1.01-2.22 2.44-2.22 1.43 0 2.45.87 2.45 2.22 0 1.33-1.02 2.22-2.45 2.22zM30.46 7.72h-4.44v10.24h4.44V12.2c0-3.3 2.9-3.97 4.15-3.97v-4.5c-1.2 0-3.21.65-4.15 1.84V7.72zM18.08 17.96h4.44v-6.24c0-1.16.72-1.72 1.54-1.72.89 0 1.41.56 1.41 1.72v6.24h4.44v-7.25c0-2.75-1.69-4.46-4.23-4.46a3.92 3.92 0 00-3.6 1.84V7.72h-4.44l.44 10.24zM4.49 12.3c0-1.89 1.49-2.7 3.09-2.7 1.3 0 2.8.6 3.58 1.58l-.02-4.75a9.92 9.92 0 00-3.74-.68c-3.86 0-7.08 1.93-7.08 5.99 0 6.07 7.52 4.82 7.52 7.27 0 .83-.74 1.37-2.06 1.37-1.62 0-3.44-.76-4.45-1.85l.24 4.86c1.06.6 2.68.86 4.09.86 3.99 0 7.33-1.75 7.33-5.98 0-6.33-8.5-5.05-8.5-7.97z"
                    fill="#6772E5"
                  />
                </svg>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Request Payout"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
