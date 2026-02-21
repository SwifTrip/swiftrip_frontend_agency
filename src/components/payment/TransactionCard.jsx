/**
 * Transaction Card Component
 * Displays individual balance transaction details following Stripe's data structure
 * Reference: https://stripe.com/docs/api/balance_transactions/object
 */

import React from "react";
import {
  BALANCE_TRANSACTION_TYPE,
  BALANCE_TRANSACTION_TYPE_CONFIG,
  BALANCE_TRANSACTION_STATUS_CONFIG,
  PAYOUT_STATUS_CONFIG,
} from "../../utils/paymentConstants";

// Transaction Type Icon Component - Following Stripe Balance Transaction types
const TransactionIcon = ({ type }) => {
  const icons = {
    // Payment/Charge - Money received from customer
    [BALANCE_TRANSACTION_TYPE.CHARGE]: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    // PaymentIntent (alias for charge)
    [BALANCE_TRANSACTION_TYPE.PAYMENT]: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    // Refund - Money returned to customer
    [BALANCE_TRANSACTION_TYPE.REFUND]: (
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
          d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
        />
      </svg>
    ),
    // Payout - Withdrawal to bank account
    [BALANCE_TRANSACTION_TYPE.PAYOUT]: (
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
    ),
    // Application Fee - Platform commission (Stripe Connect)
    [BALANCE_TRANSACTION_TYPE.APPLICATION_FEE]: (
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
          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
        />
      </svg>
    ),
    // Stripe Processing Fee
    [BALANCE_TRANSACTION_TYPE.STRIPE_FEE]: (
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
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
    // Adjustment
    [BALANCE_TRANSACTION_TYPE.ADJUSTMENT]: (
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
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
  };

  return icons[type] || icons[BALANCE_TRANSACTION_TYPE.CHARGE];
};

export default function TransactionCard({ transaction, onClick }) {
  // Get type configuration (Stripe Balance Transaction type)
  const typeConfig =
    BALANCE_TRANSACTION_TYPE_CONFIG[transaction.type] ||
    BALANCE_TRANSACTION_TYPE_CONFIG[BALANCE_TRANSACTION_TYPE.CHARGE];

  // Get status config based on transaction type
  // Payouts have their own status lifecycle (pending → in_transit → paid)
  // Balance transactions have available/pending status
  const getStatusConfig = () => {
    if (transaction.type === BALANCE_TRANSACTION_TYPE.PAYOUT) {
      return (
        PAYOUT_STATUS_CONFIG[transaction.status] || PAYOUT_STATUS_CONFIG.pending
      );
    }
    return (
      BALANCE_TRANSACTION_STATUS_CONFIG[transaction.status] ||
      BALANCE_TRANSACTION_STATUS_CONFIG.available
    );
  };

  const statusConfig = getStatusConfig();

  const formatCurrency = (amount, currency = "PKR") => {
    return `${currency.toUpperCase()} ${Math.abs(amount)?.toLocaleString() || 0}`;
  };

  // Handle both Unix timestamp (seconds) and ISO date string
  const parseDate = (value) => {
    if (!value) return new Date();
    // If it's a number (Unix timestamp in seconds), convert to milliseconds
    if (typeof value === "number") {
      return new Date(value * 1000);
    }
    return new Date(value);
  };

  const formatDate = (dateValue) => {
    return parseDate(dateValue).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateValue) => {
    return parseDate(dateValue).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Determine if amount should show as positive or negative
  // In Stripe: charge/payment = positive, refund/payout/fees = negative
  const isIncoming =
    transaction.type === BALANCE_TRANSACTION_TYPE.CHARGE ||
    transaction.type === BALANCE_TRANSACTION_TYPE.PAYMENT ||
    (transaction.amount && transaction.amount > 0);

  const amountClass = isIncoming ? "text-green-600" : "text-red-600";
  const amountPrefix = isIncoming ? "+" : "-";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-12 h-12 ${typeConfig.bgColor} rounded-full flex items-center justify-center shrink-0 ${typeConfig.textColor}`}
        >
          <TransactionIcon type={transaction.type} />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800 truncate">
                  {transaction.description}
                </h4>
                <span
                  className={`shrink-0 px-2 py-0.5 text-xs rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Source Info (booking, charge reference, etc.) */}
              {transaction.source && (
                <p className="text-sm text-gray-600 truncate">
                  {transaction.source.type === "booking"
                    ? `${transaction.source.packageTitle} • ${transaction.source.touristName}`
                    : transaction.source.id}
                </p>
              )}
              {/* Legacy booking support */}
              {!transaction.source && transaction.booking && (
                <p className="text-sm text-gray-600 truncate">
                  {transaction.booking.packageTitle} •{" "}
                  {transaction.booking.touristName}
                </p>
              )}

              {/* Bank Account Info for Payouts */}
              {transaction.destination &&
                transaction.type === BALANCE_TRANSACTION_TYPE.PAYOUT && (
                  <p className="text-sm text-gray-600">
                    Bank transfer • {transaction.destination}
                  </p>
                )}
              {/* Legacy bank account support */}
              {!transaction.destination && transaction.bankAccount && (
                <p className="text-sm text-gray-600">
                  {transaction.bankAccount.bankName} ••••{" "}
                  {transaction.bankAccount.accountLast4}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-1">
                {formatDate(transaction.created || transaction.createdAt)} at{" "}
                {formatTime(transaction.created || transaction.createdAt)}
              </p>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p className={`text-lg font-bold ${amountClass}`}>
                {amountPrefix}
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
              {/* Show net amount and fees for payments (charges) */}
              {transaction.net &&
                (transaction.type === BALANCE_TRANSACTION_TYPE.CHARGE ||
                  transaction.type === BALANCE_TRANSACTION_TYPE.PAYMENT) && (
                  <p className="text-xs text-gray-500">
                    Net: {formatCurrency(transaction.net, transaction.currency)}
                  </p>
                )}
              {transaction.fee > 0 && (
                <p className="text-xs text-gray-500">
                  Fee: {formatCurrency(transaction.fee, transaction.currency)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
