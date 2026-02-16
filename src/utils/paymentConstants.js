/**
 * Payment Module Constants
 * Following Stripe Connect API exactly for marketplace payments
 * Reference: https://stripe.com/docs/connect/payouts
 */

/**
 * Stripe Balance Transaction Types
 * These are the types returned by Stripe's Balance Transactions API
 * Reference: https://stripe.com/docs/api/balance_transactions/object
 */
export const BALANCE_TRANSACTION_TYPE = {
  CHARGE: "charge", // Payment from customer
  PAYMENT: "payment", // Alias for charge (PaymentIntent)
  REFUND: "refund", // Refund to customer
  PAYOUT: "payout", // Withdrawal to bank account
  APPLICATION_FEE: "application_fee", // Platform fee (Stripe Connect)
  ADJUSTMENT: "adjustment", // Manual adjustment by Stripe
  STRIPE_FEE: "stripe_fee", // Stripe processing fee
  TRANSFER: "transfer", // Transfer between accounts
};

/**
 * Stripe Balance Transaction Status
 * Reference: https://stripe.com/docs/api/balance_transactions/object#balance_transaction_object-status
 */
export const BALANCE_TRANSACTION_STATUS = {
  AVAILABLE: "available", // Funds available for use
  PENDING: "pending", // Funds not yet available
};

/**
 * Stripe Payout Status
 * These are the exact statuses from Stripe Payout API
 * Reference: https://stripe.com/docs/api/payouts/object#payout_object-status
 */
export const PAYOUT_STATUS = {
  PENDING: "pending", // Payout created, not yet submitted to bank
  IN_TRANSIT: "in_transit", // Submitted to bank, on the way
  PAID: "paid", // Successfully deposited in bank
  FAILED: "failed", // Failed to reach bank
  CANCELED: "canceled", // Payout was canceled
};

/**
 * Stripe Payout Method
 * Reference: https://stripe.com/docs/api/payouts/object#payout_object-method
 */
export const PAYOUT_METHOD = {
  STANDARD: "standard", // Standard bank transfer (1-3 business days)
  INSTANT: "instant", // Instant payout (supported cards/banks only)
};

/**
 * Stripe Payout Type (destination type)
 * Reference: https://stripe.com/docs/api/payouts/object#payout_object-type
 */
export const PAYOUT_DESTINATION_TYPE = {
  BANK_ACCOUNT: "bank_account",
  CARD: "card",
};

/**
 * Payout Schedule Types
 * Reference: https://stripe.com/docs/connect/manage-payout-schedule
 */
export const PAYOUT_SCHEDULE = {
  MANUAL: "manual", // Agency requests payouts manually
  AUTOMATIC: "automatic", // Stripe auto-pays on schedule
};

export const PAYOUT_SCHEDULE_INTERVAL = {
  MANUAL: "manual",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
};

/**
 * Balance Transaction Type Configuration
 * UI display settings for each transaction type
 */
export const BALANCE_TRANSACTION_TYPE_CONFIG = {
  [BALANCE_TRANSACTION_TYPE.CHARGE]: {
    label: "Payment",
    description: "Customer payment received",
    icon: "payment",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    sign: "+",
  },
  [BALANCE_TRANSACTION_TYPE.PAYMENT]: {
    label: "Payment",
    description: "Customer payment received",
    icon: "payment",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    sign: "+",
  },
  [BALANCE_TRANSACTION_TYPE.REFUND]: {
    label: "Refund",
    description: "Refund issued to customer",
    icon: "refund",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    sign: "-",
  },
  [BALANCE_TRANSACTION_TYPE.PAYOUT]: {
    label: "Payout",
    description: "Withdrawal to bank account",
    icon: "payout",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    sign: "-",
  },
  [BALANCE_TRANSACTION_TYPE.APPLICATION_FEE]: {
    label: "Platform Fee",
    description: "SwifTrip platform commission",
    icon: "fee",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    sign: "-",
  },
  [BALANCE_TRANSACTION_TYPE.STRIPE_FEE]: {
    label: "Stripe Fee",
    description: "Stripe processing fee",
    icon: "stripe",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    sign: "-",
  },
  [BALANCE_TRANSACTION_TYPE.ADJUSTMENT]: {
    label: "Adjustment",
    description: "Manual balance adjustment",
    icon: "adjustment",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    sign: "±",
  },
  [BALANCE_TRANSACTION_TYPE.TRANSFER]: {
    label: "Transfer",
    description: "Account transfer",
    icon: "transfer",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-700",
    sign: "±",
  },
};

/**
 * Balance Transaction Status Configuration
 */
export const BALANCE_TRANSACTION_STATUS_CONFIG = {
  [BALANCE_TRANSACTION_STATUS.AVAILABLE]: {
    label: "Available",
    description: "Funds available for payout",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    dotColor: "bg-green-500",
  },
  [BALANCE_TRANSACTION_STATUS.PENDING]: {
    label: "Pending",
    description: "Funds not yet available",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-500",
  },
};

/**
 * Stripe Payout Status Configuration
 * Reference: https://stripe.com/docs/payouts#payout-statuses
 */
export const PAYOUT_STATUS_CONFIG = {
  [PAYOUT_STATUS.PENDING]: {
    label: "Pending",
    description: "Payout is being prepared",
    longDescription:
      "The payout has been created and is waiting to be submitted to the bank.",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-500",
    icon: "clock",
  },
  [PAYOUT_STATUS.IN_TRANSIT]: {
    label: "In Transit",
    description: "On the way to your bank",
    longDescription:
      "The payout has been submitted to the bank and is in transit. This typically takes 1-3 business days.",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    icon: "truck",
  },
  [PAYOUT_STATUS.PAID]: {
    label: "Paid",
    description: "Deposited to your bank",
    longDescription:
      "The payout has been successfully deposited into your bank account.",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    dotColor: "bg-green-500",
    icon: "check",
  },
  [PAYOUT_STATUS.FAILED]: {
    label: "Failed",
    description: "Payout failed",
    longDescription:
      "The payout failed to reach your bank account. The funds have been returned to your Stripe balance.",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    dotColor: "bg-red-500",
    icon: "x",
  },
  [PAYOUT_STATUS.CANCELED]: {
    label: "Canceled",
    description: "Payout was canceled",
    longDescription:
      "The payout was canceled before it was submitted to the bank.",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
    dotColor: "bg-gray-500",
    icon: "ban",
  },
};

/**
 * Filter Options for UI
 */
export const PAYMENT_FILTER_OPTIONS = {
  transactionType: [
    { value: "all", label: "All Types" },
    { value: BALANCE_TRANSACTION_TYPE.CHARGE, label: "Payments" },
    { value: BALANCE_TRANSACTION_TYPE.REFUND, label: "Refunds" },
    { value: BALANCE_TRANSACTION_TYPE.PAYOUT, label: "Payouts" },
    { value: BALANCE_TRANSACTION_TYPE.APPLICATION_FEE, label: "Platform Fees" },
  ],
  status: [
    { value: "all", label: "All Status" },
    { value: BALANCE_TRANSACTION_STATUS.AVAILABLE, label: "Available" },
    { value: BALANCE_TRANSACTION_STATUS.PENDING, label: "Pending" },
  ],
  payoutStatus: [
    { value: "all", label: "All Status" },
    { value: PAYOUT_STATUS.PENDING, label: "Pending" },
    { value: PAYOUT_STATUS.IN_TRANSIT, label: "In Transit" },
    { value: PAYOUT_STATUS.PAID, label: "Paid" },
    { value: PAYOUT_STATUS.FAILED, label: "Failed" },
  ],
  dateRange: [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "this_week", label: "This Week" },
    { value: "this_month", label: "This Month" },
    { value: "last_month", label: "Last Month" },
    { value: "last_3_months", label: "Last 3 Months" },
  ],
};

/**
 * Stripe Platform Fee Configuration
 * Application fee is the platform's cut on each transaction
 */
export const PLATFORM_FEE_PERCENTAGE = 10; // 10% platform fee
export const STRIPE_FEE_PERCENTAGE = 2.9; // Stripe's processing fee (~2.9% + fixed)
export const STRIPE_FIXED_FEE = 30; // Stripe fixed fee in smallest currency unit

// Minimum Payout Threshold (in PKR)
export const MINIMUM_PAYOUT_AMOUNT = 5000;

// Currency Configuration
export const CURRENCY_CONFIG = {
  PKR: {
    code: "PKR",
    symbol: "Rs.",
    name: "Pakistani Rupee",
    decimals: 0,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    decimals: 2,
  },
};

// Default Currency
export const DEFAULT_CURRENCY = "PKR";

// Default Filter Values
export const DEFAULT_PAYMENT_FILTERS = {
  search: "",
  type: "all",
  status: "all",
  dateRange: "all",
};

/**
 * Stripe Payout Configuration
 * Reference: https://stripe.com/docs/payouts#payout-speed
 */
export const PAYOUT_CONFIG = {
  // Standard payout timing (varies by country)
  standardArrivalDays: {
    min: 1,
    max: 3,
  },
  // Instant payout timing
  instantArrivalMinutes: 30,
  // Minimum payout threshold
  minimumAmount: MINIMUM_PAYOUT_AMOUNT,
  // Instant payout fee (1% capped at specific amount)
  instantPayoutFeePercent: 1,
  instantPayoutFeeCap: 500, // PKR
};

/**
 * Stripe Payout Failure Codes
 * Reference: https://stripe.com/docs/api/payouts/object#payout_object-failure_code
 */
export const PAYOUT_FAILURE_CODE = {
  ACCOUNT_CLOSED: "account_closed",
  ACCOUNT_FROZEN: "account_frozen",
  BANK_ACCOUNT_RESTRICTED: "bank_account_restricted",
  BANK_OWNERSHIP_CHANGED: "bank_ownership_changed",
  COULD_NOT_PROCESS: "could_not_process",
  DEBIT_NOT_AUTHORIZED: "debit_not_authorized",
  DECLINED: "declined",
  INSUFFICIENT_FUNDS: "insufficient_funds",
  INVALID_ACCOUNT_NUMBER: "invalid_account_number",
  INCORRECT_ACCOUNT_HOLDER_NAME: "incorrect_account_holder_name",
  INVALID_CURRENCY: "invalid_currency",
  NO_ACCOUNT: "no_account",
  UNSUPPORTED_CARD: "unsupported_card",
};

export const PAYOUT_FAILURE_MESSAGES = {
  [PAYOUT_FAILURE_CODE.ACCOUNT_CLOSED]: "The bank account has been closed.",
  [PAYOUT_FAILURE_CODE.ACCOUNT_FROZEN]: "The bank account has been frozen.",
  [PAYOUT_FAILURE_CODE.BANK_ACCOUNT_RESTRICTED]:
    "The bank account has restrictions preventing this payout.",
  [PAYOUT_FAILURE_CODE.COULD_NOT_PROCESS]:
    "The bank could not process this payout.",
  [PAYOUT_FAILURE_CODE.DECLINED]: "The bank declined this payout.",
  [PAYOUT_FAILURE_CODE.INSUFFICIENT_FUNDS]:
    "Your Stripe balance has insufficient funds.",
  [PAYOUT_FAILURE_CODE.INVALID_ACCOUNT_NUMBER]:
    "The bank account number is invalid.",
  [PAYOUT_FAILURE_CODE.INCORRECT_ACCOUNT_HOLDER_NAME]:
    "The account holder name doesn't match bank records.",
  [PAYOUT_FAILURE_CODE.NO_ACCOUNT]: "The bank account doesn't exist.",
};

// Utility Functions
export const formatCurrency = (amount, currency = DEFAULT_CURRENCY) => {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.PKR;
  const formatted = new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);
  return `${config.symbol} ${formatted}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Calculate estimated arrival date for payout
 * @param {string} method - 'standard' or 'instant'
 * @returns {Date} Estimated arrival date
 */
export const getEstimatedArrivalDate = (method = PAYOUT_METHOD.STANDARD) => {
  const now = new Date();
  if (method === PAYOUT_METHOD.INSTANT) {
    now.setMinutes(now.getMinutes() + PAYOUT_CONFIG.instantArrivalMinutes);
  } else {
    // Add business days (skip weekends)
    let daysToAdd = PAYOUT_CONFIG.standardArrivalDays.max;
    while (daysToAdd > 0) {
      now.setDate(now.getDate() + 1);
      const dayOfWeek = now.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysToAdd--;
      }
    }
  }
  return now;
};

/**
 * Backward Compatibility Aliases
 * These maintain compatibility with existing code while using new Stripe types
 */
export const TRANSACTION_TYPE = BALANCE_TRANSACTION_TYPE;
export const TRANSACTION_STATUS = BALANCE_TRANSACTION_STATUS;
export const TRANSACTION_TYPE_CONFIG = BALANCE_TRANSACTION_TYPE_CONFIG;
export const TRANSACTION_STATUS_CONFIG = BALANCE_TRANSACTION_STATUS_CONFIG;
