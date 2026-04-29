import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchPaymentDetails,
  fetchStripeConnectStatus,
  createStripeConnectOnboardingLink,
  redeemPayment,
  clearRedeemStatus,
  selectPendingAmount,
  selectAvailableAmount,
  selectTotalAmount,
  selectPaymentLoading,
  selectRedeemLoading,
  selectPaymentError,
  selectRedeemError,
  selectRedeemSuccess,
  selectStripeConnectStatus,
  selectStripeConnectLoading,
  selectStripeConnectError,
} from "../../store/slices/paymentSlice";

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  if (num >= 1_000_000) return `₨${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `₨${(num / 1_000).toFixed(1)}K`;
  return `₨${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function PaymentsPage() {
  const dispatch = useDispatch();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const pendingAmount = useSelector(selectPendingAmount);
  const availableAmount = useSelector(selectAvailableAmount);
  const totalAmount = useSelector(selectTotalAmount);
  const loading = useSelector(selectPaymentLoading);
  const redeemLoading = useSelector(selectRedeemLoading);
  const error = useSelector(selectPaymentError);
  const redeemError = useSelector(selectRedeemError);
  const redeemSuccess = useSelector(selectRedeemSuccess);
  const connectStatus = useSelector(selectStripeConnectStatus);
  const connectLoading = useSelector(selectStripeConnectLoading);
  const connectError = useSelector(selectStripeConnectError);

  useEffect(() => {
    dispatch(fetchPaymentDetails());
    dispatch(fetchStripeConnectStatus());

    // Check if user is returning from Stripe onboarding
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("onboarding") === "return" ||
      params.get("onboarding") === "refresh"
    ) {
      // Poll for status update after redirect (Stripe may take a moment to sync)
      const pollInterval = setInterval(() => {
        dispatch(fetchStripeConnectStatus());
      }, 2000);

      // Stop polling after 30 seconds
      const timeout = setTimeout(() => clearInterval(pollInterval), 30000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [dispatch]);

  useEffect(() => {
    if (redeemSuccess) {
      toast.success("Withdrawal completed successfully!");
      setIsWithdrawModalOpen(false);
      dispatch(clearRedeemStatus());
      dispatch(fetchStripeConnectStatus());
    }
    if (redeemError) {
      toast.error(redeemError);
      dispatch(clearRedeemStatus());
    }
  }, [redeemSuccess, redeemError, dispatch]);

  // Clean up URL after successful Stripe connection
  useEffect(() => {
    if (connectStatus?.isConnected && connectStatus?.detailsSubmitted) {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("onboarding") === "return" ||
        params.get("onboarding") === "refresh"
      ) {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        toast.success("Stripe account connected successfully!");
      }
    }
  }, [connectStatus?.isConnected, connectStatus?.detailsSubmitted]);

  const handleConnectStripe = async () => {
    const resultAction = await dispatch(createStripeConnectOnboardingLink());
    if (createStripeConnectOnboardingLink.fulfilled.match(resultAction)) {
      const url = resultAction.payload?.url;
      if (url) {
        window.location.href = url;
      }
    } else {
      toast.error(resultAction.payload || "Unable to start Stripe onboarding");
    }
  };

  const handleWithdraw = (event) => {
    event.preventDefault();

    if (!connectStatus?.isConnected || !connectStatus?.payoutsEnabled) {
      toast.error(
        "Please complete Stripe account onboarding before withdrawing",
      );
      return;
    }

    dispatch(
      redeemPayment({
        amount: availableAmount,
      }),
    );
  };

  const canWithdraw =
    availableAmount > 0 &&
    !redeemLoading &&
    !loading &&
    connectStatus?.isConnected &&
    connectStatus?.payoutsEnabled;

  const cards = [
    {
      title: "Available to Withdraw",
      value: availableAmount,
      description: "Ready to transfer to your Stripe account",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      textColor: "text-orange-600",
      icon: (
        <svg
          className="w-6 h-6 text-orange-600"
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
    },
    {
      title: "Pending",
      value: pendingAmount,
      description: "Available after tours complete",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
      icon: (
        <svg
          className="w-6 h-6 text-amber-600"
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
      ),
    },
    {
      title: "Total Withdrawn",
      value: totalAmount,
      description: "Successfully transferred to date",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
      icon: (
        <svg
          className="w-6 h-6 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Stripe Connection
            </h3>
            {connectLoading ? (
              <p className="text-sm text-gray-500">
                Checking account status...
              </p>
            ) : connectStatus?.isConnected && connectStatus?.payoutsEnabled ? (
              <p className="text-sm text-emerald-600">
                Connected and payout-ready
              </p>
            ) : (
              <p className="text-sm text-amber-600">
                Onboarding required before withdrawals
              </p>
            )}
            {connectStatus?.accountId && (
              <p className="text-xs text-gray-400 mt-1">
                Account: {connectStatus.accountId}
              </p>
            )}
            {connectError && (
              <p className="text-xs text-red-500 mt-1">{connectError}</p>
            )}
          </div>
          <button
            onClick={handleConnectStripe}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {connectStatus?.isConnected && connectStatus?.payoutsEnabled
              ? "Manage Stripe Account"
              : "Connect Stripe"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Balance cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-40" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`${card.bg} rounded-2xl p-6 border border-gray-100`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`${card.iconBg} rounded-xl p-2`}>
                  {card.icon}
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {card.title}
                </p>
              </div>
              <p className={`text-3xl font-bold ${card.textColor} mb-1`}>
                {formatCurrency(card.value)}
              </p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Withdraw section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Withdraw Funds
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Withdraw funds to your Stripe-connected bank account. Bank details are
          managed securely in Stripe onboarding.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-orange-50 rounded-xl mb-6">
          <div>
            <p className="text-sm text-gray-600">Available to Withdraw</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(availableAmount)}
            </p>
          </div>
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={!canWithdraw}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              canWithdraw
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {redeemLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
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
                Withdraw All
              </>
            )}
          </button>
        </div>

        <ul className="text-xs text-gray-400 space-y-1">
          <li>
            • Advance payments (60%) become available when a booking is
            confirmed
          </li>
          <li>
            • Final payments (40%) become available when the tour is completed
          </li>
          <li>
            • Partial withdrawal is not enabled yet, full available amount is
            withdrawn
          </li>
          <li>
            • Connect Stripe once, add bank details in Stripe, then withdraw
            from here
          </li>
        </ul>
      </div>

      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Withdrawal
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This will transfer {formatCurrency(availableAmount)} to your
                Stripe connected account.
              </p>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 px-6 py-5">
              {!connectStatus?.payoutsEnabled && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Stripe onboarding is incomplete. Please connect Stripe before
                  withdrawing.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={redeemLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                  disabled={redeemLoading || !connectStatus?.payoutsEnabled}
                >
                  {redeemLoading ? "Processing..." : "Confirm Withdraw"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
