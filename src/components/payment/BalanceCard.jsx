/**
 * Balance Overview Card Component
 * Displays available, pending, and reserved balances
 */

import React from "react";
import { MINIMUM_PAYOUT_AMOUNT } from "../../utils/paymentConstants";

export default function BalanceCard({ balance, onRequestPayout, loading }) {
  const formatCurrency = (amount, currency = "PKR") => {
    if (amount >= 1000000) {
      return `${currency} ${(amount / 1000000).toFixed(2)}M`;
    }
    return `${currency} ${amount?.toLocaleString() || 0}`;
  };

  // Guard against null/undefined balance
  if (!balance) {
    return null;
  }

  const canPayout = (balance.available || 0) >= MINIMUM_PAYOUT_AMOUNT;

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-white/80 text-sm">Available Balance</p>
            <p className="text-xs text-white/60">Ready for withdrawal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
            Stripe Connect
          </span>
        </div>
      </div>

      {/* Available Balance */}
      <div className="mb-6">
        <p className="text-4xl font-bold">
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            formatCurrency(balance.available, balance.currency)
          )}
        </p>
      </div>

      {/* Other Balances */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-white/70"
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
            <p className="text-white/70 text-xs">Pending</p>
          </div>
          <p className="text-lg font-semibold">
            {formatCurrency(balance.pending, balance.currency)}
          </p>
          <p className="text-xs text-white/60 mt-1">7-14 days hold</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4 text-white/70"
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
            <p className="text-white/70 text-xs">Reserved</p>
          </div>
          <p className="text-lg font-semibold">
            {formatCurrency(balance.reserved, balance.currency)}
          </p>
          <p className="text-xs text-white/60 mt-1">For refunds</p>
        </div>
      </div>

      {/* Payout Button */}
      <button
        onClick={onRequestPayout}
        disabled={!canPayout || loading}
        className={`
          w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
          ${
            canPayout
              ? "bg-white text-orange-600 hover:bg-white/90 shadow-lg"
              : "bg-white/20 text-white/60 cursor-not-allowed"
          }
        `}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        Withdraw Funds
      </button>

      {/* Minimum Payout Info */}
      {!canPayout && (
        <p className="text-center text-white/60 text-xs mt-3">
          Minimum withdrawal:{" "}
          {formatCurrency(MINIMUM_PAYOUT_AMOUNT, balance.currency)}
        </p>
      )}
    </div>
  );
}
