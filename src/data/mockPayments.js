/**
 * Mock Payment Data - Stripe Connect Format
 *
 * This mock data follows Stripe's exact API structure for easy integration.
 * Reference: https://stripe.com/docs/api
 *
 * When backend is ready, replace mock calls with actual API calls.
 * The data structure will remain the same.
 */

import {
  BALANCE_TRANSACTION_TYPE,
  BALANCE_TRANSACTION_STATUS,
  PAYOUT_STATUS,
  PAYOUT_METHOD,
  PAYOUT_DESTINATION_TYPE,
} from "../utils/paymentConstants";

/**
 * Mock Stripe Balance Object
 * Reference: https://stripe.com/docs/api/balance/balance_object
 *
 * In Stripe Connect, this represents the connected account's balance
 * after platform fees have been deducted.
 */
export const mockBalance = {
  object: "balance",
  available: [
    {
      amount: 245000,
      currency: "pkr",
      source_types: {
        card: 245000,
      },
    },
  ],
  pending: [
    {
      amount: 78500,
      currency: "pkr",
      source_types: {
        card: 78500,
      },
    },
  ],
  connect_reserved: [
    {
      amount: 15000,
      currency: "pkr",
    },
  ],
  livemode: false,
  // Simplified format for UI consumption
  available: 245000,
  pending: 78500,
  reserved: 15000,
  currency: "PKR",
  lastUpdated: "2026-02-23T10:00:00Z",
};

/**
 * Mock Balance Summary (Custom aggregation)
 * This is a custom summary object for the dashboard
 */
export const mockBalanceSummary = {
  totalEarnings: 892500,
  totalRefunds: 45000,
  totalPayouts: 525000,
  totalPlatformFees: 89250,
  totalStripeFees: 25875,
  netEarnings: 732375,
  availableBalance: 245000,
  pendingBalance: 78500,
  reservedBalance: 15000,
  currency: "PKR",
  period: {
    start: "2026-01-01T00:00:00Z",
    end: "2026-02-23T23:59:59Z",
  },
};

/**
 * Mock Balance Transactions
 * Reference: https://stripe.com/docs/api/balance_transactions/object
 */
export const mockTransactions = [
  {
    id: "txn_3OhK2eKCIzU6K5NB1ABC",
    object: "balance_transaction",
    amount: 44000,
    available_on: 1708473600,
    created: 1708422600,
    currency: "pkr",
    description: "Payment for Northern Areas Adventure",
    fee: 4400,
    fee_details: [
      {
        amount: 4400,
        application: "ca_SwifTripPlatform",
        currency: "pkr",
        description: "SwifTrip platform fee (10%)",
        type: "application_fee",
      },
    ],
    net: 39600,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.CHARGE,
    source: "ch_3OhK2eKCIzU6K5NB1PaymentIntent",
    booking: {
      id: "BK-2026-001",
      packageTitle: "Northern Areas Adventure",
      touristName: "Ahmed Khan",
      touristEmail: "ahmed.khan@email.com",
    },
    reporting_category: "charge",
    createdAt: "2026-02-20T10:30:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB2DEF",
    object: "balance_transaction",
    amount: 66000,
    available_on: 1708387200,
    created: 1708350000,
    currency: "pkr",
    description: "Partial payment for Skardu Explorer",
    fee: 6600,
    fee_details: [
      {
        amount: 6600,
        application: "ca_SwifTripPlatform",
        currency: "pkr",
        description: "SwifTrip platform fee (10%)",
        type: "application_fee",
      },
    ],
    net: 59400,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.CHARGE,
    source: "ch_3OhK2eKCIzU6K5NB2PaymentIntent",
    booking: {
      id: "BK-2026-002",
      packageTitle: "Skardu Explorer - Private",
      touristName: "Sarah Williams",
      touristEmail: "sarah.w@email.com",
    },
    reporting_category: "charge",
    createdAt: "2026-02-19T14:20:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB3GHI",
    object: "balance_transaction",
    amount: -150000,
    available_on: 1708300800,
    created: 1708243200,
    currency: "pkr",
    description: "STRIPE PAYOUT",
    fee: 0,
    fee_details: [],
    net: -150000,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.PAYOUT,
    source: "po_1OhK2eKCIzU6K5NB3Payout",
    payout: {
      id: "po_1OhK2eKCIzU6K5NB3Payout",
      status: PAYOUT_STATUS.PAID,
      arrival_date: 1708300800,
      destination: "ba_1OhK2eKCIzU6K5NB3Bank",
    },
    bankAccount: {
      bankName: "Allied Bank",
      last4: "4521",
    },
    reporting_category: "payout",
    createdAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB4JKL",
    object: "balance_transaction",
    amount: 8800,
    available_on: 1707782400,
    created: 1707724800,
    currency: "pkr",
    description: "Payment for Lahore Heritage Walk",
    fee: 880,
    fee_details: [
      {
        amount: 880,
        application: "ca_SwifTripPlatform",
        currency: "pkr",
        description: "SwifTrip platform fee (10%)",
        type: "application_fee",
      },
    ],
    net: 7920,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.CHARGE,
    source: "ch_3OhK2eKCIzU6K5NB4PaymentIntent",
    booking: {
      id: "BK-2026-003",
      packageTitle: "Lahore Heritage Walk",
      touristName: "Michael Chen",
      touristEmail: "m.chen@email.com",
    },
    reporting_category: "charge",
    createdAt: "2026-02-12T08:00:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB5MNO",
    object: "balance_transaction",
    amount: -104500,
    available_on: 1708300800,
    created: 1708268400,
    currency: "pkr",
    description: "Refund for cancelled Fairy Meadows tour",
    fee: 0,
    fee_details: [],
    net: -104500,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.REFUND,
    source: "re_3OhK2eKCIzU6K5NB5Refund",
    booking: {
      id: "BK-2026-005",
      packageTitle: "Fairy Meadows Expedition",
      touristName: "John Smith",
      touristEmail: "john.smith@email.com",
    },
    refund: {
      id: "re_3OhK2eKCIzU6K5NB5Refund",
      charge: "ch_original_charge_id",
      reason: "requested_by_customer",
    },
    reporting_category: "refund",
    createdAt: "2026-02-18T14:00:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB6PQR",
    object: "balance_transaction",
    amount: 27720,
    available_on: 1708560000,
    created: 1708534800,
    currency: "pkr",
    description: "Payment for Neelum Valley Escape",
    fee: 2772,
    fee_details: [
      {
        amount: 2772,
        application: "ca_SwifTripPlatform",
        currency: "pkr",
        description: "SwifTrip platform fee (10%)",
        type: "application_fee",
      },
    ],
    net: 24948,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.CHARGE,
    source: "ch_3OhK2eKCIzU6K5NB6PaymentIntent",
    booking: {
      id: "BK-2026-006",
      packageTitle: "Neelum Valley Escape",
      touristName: "Zainab Malik",
      touristEmail: "zainab.m@email.com",
    },
    reporting_category: "charge",
    createdAt: "2026-02-21T16:00:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB7STU",
    object: "balance_transaction",
    amount: 178200,
    available_on: 1708473600,
    created: 1708422000,
    currency: "pkr",
    description: "Payment for Corporate Retreat",
    fee: 17820,
    fee_details: [
      {
        amount: 17820,
        application: "ca_SwifTripPlatform",
        currency: "pkr",
        description: "SwifTrip platform fee (10%)",
        type: "application_fee",
      },
    ],
    net: 160380,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.CHARGE,
    source: "ch_3OhK2eKCIzU6K5NB7PaymentIntent",
    booking: {
      id: "BK-2026-007",
      packageTitle: "Corporate Retreat - Murree",
      touristName: "Usman Ghani",
      touristEmail: "usman.ghani@company.com",
    },
    reporting_category: "charge",
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB8VWX",
    object: "balance_transaction",
    amount: -200000,
    available_on: 1708732800,
    created: 1708599600,
    currency: "pkr",
    description: "STRIPE PAYOUT",
    fee: 0,
    fee_details: [],
    net: -200000,
    status: BALANCE_TRANSACTION_STATUS.PENDING,
    type: BALANCE_TRANSACTION_TYPE.PAYOUT,
    source: "po_1OhK2eKCIzU6K5NB8Payout",
    payout: {
      id: "po_1OhK2eKCIzU6K5NB8Payout",
      status: PAYOUT_STATUS.IN_TRANSIT,
      arrival_date: 1708732800,
      destination: "ba_1OhK2eKCIzU6K5NB3Bank",
    },
    bankAccount: {
      bankName: "Allied Bank",
      last4: "4521",
    },
    reporting_category: "payout",
    createdAt: "2026-02-22T11:00:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NB9YZA",
    object: "balance_transaction",
    amount: 34650,
    available_on: 1708905600,
    created: 1708672500,
    currency: "pkr",
    description: "Payment for Swat Valley Tour",
    fee: 3465,
    fee_details: [
      {
        amount: 3465,
        application: "ca_SwifTripPlatform",
        currency: "pkr",
        description: "SwifTrip platform fee (10%)",
        type: "application_fee",
      },
    ],
    net: 31185,
    status: BALANCE_TRANSACTION_STATUS.PENDING,
    type: BALANCE_TRANSACTION_TYPE.CHARGE,
    source: "ch_3OhK2eKCIzU6K5NB9PaymentIntent",
    booking: {
      id: "BK-2026-004",
      packageTitle: "Swat Valley Tour",
      touristName: "Fatima Ali",
      touristEmail: "fatima.ali@email.com",
    },
    reporting_category: "charge",
    createdAt: "2026-02-23T08:15:00Z",
  },
  {
    id: "txn_3OhK2eKCIzU6K5NBABC",
    object: "balance_transaction",
    amount: 4950,
    available_on: 1708300800,
    created: 1708260600,
    currency: "pkr",
    description: "Payment for Karachi City Tour",
    fee: 495,
    fee_details: [
      {
        amount: 495,
        application: "ca_SwifTripPlatform",
        currency: "pkr",
        description: "SwifTrip platform fee (10%)",
        type: "application_fee",
      },
    ],
    net: 4455,
    status: BALANCE_TRANSACTION_STATUS.AVAILABLE,
    type: BALANCE_TRANSACTION_TYPE.CHARGE,
    source: "ch_3OhK2eKCIzU6K5NBAPaymentIntent",
    booking: {
      id: "BK-2026-008",
      packageTitle: "Karachi City Tour",
      touristName: "Ali Raza",
      touristEmail: "ali.raza@email.com",
    },
    reporting_category: "charge",
    createdAt: "2026-02-18T12:30:00Z",
  },
];

/**
 * Mock Payouts List
 * Reference: https://stripe.com/docs/api/payouts/object
 */
export const mockPayouts = [
  {
    id: "po_1OhK2eKCIzU6K5NB3Payout",
    object: "payout",
    amount: 150000,
    arrival_date: 1708300800,
    automatic: false,
    balance_transaction: "txn_3OhK2eKCIzU6K5NB3GHI",
    created: 1708243200,
    currency: "pkr",
    description: "Manual payout",
    destination: "ba_1OhK2eKCIzU6K5NB3Bank",
    failure_code: null,
    failure_message: null,
    livemode: false,
    method: PAYOUT_METHOD.STANDARD,
    original_payout: null,
    reconciliation_status: "completed",
    source_type: "card",
    statement_descriptor: "SWIFTRIP PAYOUT",
    status: PAYOUT_STATUS.PAID,
    type: PAYOUT_DESTINATION_TYPE.BANK_ACCOUNT,
    bankAccount: {
      bankName: "Allied Bank",
      last4: "4521",
      accountHolderName: "SwifTrip Tours",
    },
    createdAt: "2026-02-18T09:00:00Z",
    arrival_date_formatted: "2026-02-19",
  },
  {
    id: "po_1OhK2eKCIzU6K5NB8Payout",
    object: "payout",
    amount: 200000,
    arrival_date: 1708732800,
    automatic: false,
    balance_transaction: "txn_3OhK2eKCIzU6K5NB8VWX",
    created: 1708599600,
    currency: "pkr",
    description: "Manual payout",
    destination: "ba_1OhK2eKCIzU6K5NB3Bank",
    failure_code: null,
    failure_message: null,
    livemode: false,
    method: PAYOUT_METHOD.STANDARD,
    original_payout: null,
    reconciliation_status: "in_progress",
    source_type: "card",
    statement_descriptor: "SWIFTRIP PAYOUT",
    status: PAYOUT_STATUS.IN_TRANSIT,
    type: PAYOUT_DESTINATION_TYPE.BANK_ACCOUNT,
    bankAccount: {
      bankName: "Allied Bank",
      last4: "4521",
      accountHolderName: "SwifTrip Tours",
    },
    createdAt: "2026-02-22T11:00:00Z",
    arrival_date_formatted: "2026-02-24",
  },
  {
    id: "po_1OhK2eKCIzU6K5NB0Old",
    object: "payout",
    amount: 175000,
    arrival_date: 1707091200,
    automatic: false,
    balance_transaction: "txn_old_balance_txn",
    created: 1706918400,
    currency: "pkr",
    description: "Manual payout",
    destination: "ba_1OhK2eKCIzU6K5NB3Bank",
    failure_code: null,
    failure_message: null,
    livemode: false,
    method: PAYOUT_METHOD.STANDARD,
    original_payout: null,
    reconciliation_status: "completed",
    source_type: "card",
    statement_descriptor: "SWIFTRIP PAYOUT",
    status: PAYOUT_STATUS.PAID,
    type: PAYOUT_DESTINATION_TYPE.BANK_ACCOUNT,
    bankAccount: {
      bankName: "Allied Bank",
      last4: "4521",
      accountHolderName: "SwifTrip Tours",
    },
    createdAt: "2026-02-03T10:00:00Z",
    arrival_date_formatted: "2026-02-05",
  },
];

/**
 * Mock External Bank Account
 * Reference: https://stripe.com/docs/api/external_accounts/object
 */
export const mockBankAccount = {
  id: "ba_1OhK2eKCIzU6K5NB3Bank",
  object: "bank_account",
  account_holder_name: "SwifTrip Tours",
  account_holder_type: "company",
  account_type: null,
  bank_name: "Allied Bank Limited",
  bankName: "Allied Bank", // Short name for UI
  country: "PK",
  currency: "pkr",
  default_for_currency: true,
  fingerprint: "ABC123XYZ",
  last4: "4521",
  routing_number: "ABPAPKKA",
  status: "verified",
  displayName: "Allied Bank ****4521",
  isDefault: true,
  accountHolder: "SwifTrip Tours",
};

/**
 * Mock list of external accounts
 */
export const mockExternalAccounts = [mockBankAccount];

/**
 * Calculate payment statistics from transactions
 */
export const calculatePaymentStats = (transactions) => {
  const stats = {
    totalCharges: 0,
    totalRefunds: 0,
    totalPayouts: 0,
    totalFees: 0,
    chargeCount: 0,
    refundCount: 0,
    payoutCount: 0,
  };

  transactions.forEach((txn) => {
    const amount = Math.abs(txn.amount);

    switch (txn.type) {
      case BALANCE_TRANSACTION_TYPE.CHARGE:
      case BALANCE_TRANSACTION_TYPE.PAYMENT:
        stats.totalCharges += amount;
        stats.totalFees += txn.fee || 0;
        stats.chargeCount++;
        break;
      case BALANCE_TRANSACTION_TYPE.REFUND:
        stats.totalRefunds += amount;
        stats.refundCount++;
        break;
      case BALANCE_TRANSACTION_TYPE.PAYOUT:
        stats.totalPayouts += amount;
        stats.payoutCount++;
        break;
      default:
        break;
    }
  });

  stats.netRevenue = stats.totalCharges - stats.totalRefunds - stats.totalFees;

  return stats;
};

/**
 * Get pending payout amount
 */
export const getPendingPayoutAmount = (payouts) => {
  return payouts
    .filter(
      (p) =>
        p.status === PAYOUT_STATUS.PENDING ||
        p.status === PAYOUT_STATUS.IN_TRANSIT,
    )
    .reduce((sum, p) => sum + p.amount, 0);
};

export default {
  mockBalance,
  mockBalanceSummary,
  mockTransactions,
  mockPayouts,
  mockBankAccount,
  calculatePaymentStats,
};
