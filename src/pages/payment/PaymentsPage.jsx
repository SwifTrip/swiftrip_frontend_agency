/**
 * Payments Page
 * Main page for agency payment management following Stripe Connect model
 * - Balance overview with available/pending/reserved breakdown
 * - Transaction history with filters
 * - Payout/withdrawal functionality
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchBalance,
  fetchBalanceSummary,
  fetchTransactions,
  fetchPayouts,
  requestPayout,
  selectBalance,
  selectBalanceSummary,
  selectTransactions,
  selectPayouts,
  selectPaymentLoading,
  selectPaymentError,
} from "../../store/slices/paymentSlice";
import {
  BalanceCard,
  BalanceSummary,
  TransactionCard,
  TransactionFilters,
  PayoutModal,
} from "../../components/payment";
import { DEFAULT_PAYMENT_FILTERS } from "../../utils/paymentConstants";
import { mockBankAccount } from "../../data/mockPayments";

export default function PaymentsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux state
  const balance = useSelector(selectBalance);
  const balanceSummary = useSelector(selectBalanceSummary);
  const transactions = useSelector(selectTransactions) || [];
  const payouts = useSelector(selectPayouts) || [];
  const loading = useSelector(selectPaymentLoading) || {};
  const error = useSelector(selectPaymentError);

  // Local state
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  // Initialize filters from URL params
  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || DEFAULT_PAYMENT_FILTERS.search,
      type: searchParams.get("type") || DEFAULT_PAYMENT_FILTERS.type,
      status: searchParams.get("status") || DEFAULT_PAYMENT_FILTERS.status,
      dateRange:
        searchParams.get("dateRange") || DEFAULT_PAYMENT_FILTERS.dateRange,
    }),
    [searchParams],
  );

  // Update URL when filters change
  const updateFilters = useCallback(
    (newFilters) => {
      const updated = { ...filters, ...newFilters };
      const params = new URLSearchParams();

      Object.entries(updated).forEach(([key, value]) => {
        if (value && value !== DEFAULT_PAYMENT_FILTERS[key]) {
          params.set(key, value);
        }
      });

      setSearchParams(params, { replace: true });
    },
    [filters, setSearchParams],
  );

  // Reset filters to default
  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Fetch data on mount and filter changes
  useEffect(() => {
    dispatch(fetchBalance());
    dispatch(fetchBalanceSummary());
    dispatch(fetchPayouts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTransactions(filters));
  }, [dispatch, filters]);

  // Handle payout request - accepts Stripe-like payout payload
  const handlePayoutRequest = async (payoutData) => {
    setIsSubmittingPayout(true);
    try {
      // Payout payload structure follows Stripe's Create Payout API
      // Reference: https://stripe.com/docs/api/payouts/create
      await dispatch(
        requestPayout({
          amount: payoutData.amount,
          currency: payoutData.currency || "pkr",
          method: payoutData.method || "standard",
          destination: payoutData.destination || mockBankAccount.id,
          description: payoutData.description,
          statement_descriptor: payoutData.statement_descriptor,
        }),
      ).unwrap();

      setIsPayoutModalOpen(false);

      // Refresh data after payout request
      dispatch(fetchBalance());
      dispatch(fetchBalanceSummary());
      dispatch(fetchPayouts());
    } catch (error) {
      console.error("Payout request failed:", error);
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  // Loading state - with null safety
  const isLoading =
    loading?.balance || loading?.balanceSummary || loading?.transactions;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your earnings, view transactions, and request withdrawals
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 font-medium">
              Error loading payment data
            </span>
          </div>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Balance Card */}
      <div className="mb-6">
        {loading?.balance ? (
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 animate-pulse">
            <div className="h-8 bg-white/20 rounded w-48 mb-4"></div>
            <div className="h-12 bg-white/20 rounded w-64"></div>
          </div>
        ) : (
          <BalanceCard
            balance={balance}
            onRequestPayout={() => setIsPayoutModalOpen(true)}
          />
        )}
      </div>

      {/* Balance Summary */}
      <div className="mb-8">
        {loading?.balanceSummary ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <BalanceSummary summary={balanceSummary} />
        )}
      </div>

      {/* Transactions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h2>
          <span className="text-sm text-gray-500">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Filters */}
        <TransactionFilters
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />

        {/* Transaction List */}
        {loading?.transactions ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No transactions found
            </h3>
            <p className="text-sm text-gray-500">
              {filters.search ||
              filters.type !== "all" ||
              filters.status !== "all"
                ? "Try adjusting your filters to see more results"
                : "Transactions will appear here when tourists make bookings"}
            </p>
            {(filters.search ||
              filters.type !== "all" ||
              filters.status !== "all") && (
              <button
                onClick={resetFilters}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Payout Modal */}
      <PayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        availableBalance={balance?.available || 0}
        bankAccount={mockBankAccount}
        onSubmit={handlePayoutRequest}
        isSubmitting={isSubmittingPayout}
      />
    </div>
  );
}
