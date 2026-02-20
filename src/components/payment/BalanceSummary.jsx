/**
 * Balance Summary Component
 * Displays financial metrics: Total Earnings, Refunds, Payouts
 */

import React from "react";

export default function BalanceSummary({ summary, loading }) {
  const formatCurrency = (amount, currency = "PKR") => {
    if (amount >= 1000000) {
      return `${currency} ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${currency} ${(amount / 1000).toFixed(0)}K`;
    }
    return `${currency} ${amount?.toLocaleString() || 0}`;
  };

  // Guard against null/undefined summary
  if (!summary) {
    return null;
  }

  const summaryCards = [
    {
      title: "Total Earnings",
      value: summary.totalEarnings,
      description: "Gross revenue from bookings",
      icon: (
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      title: "Net Earnings",
      value: summary.netEarnings,
      description: "After platform fees",
      icon: (
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
            d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      title: "Total Refunds",
      value: summary.totalRefunds,
      description: "Refunded to tourists",
      icon: (
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
            d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
          />
        </svg>
      ),
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
    {
      title: "Total Withdrawals",
      value: summary.totalPayouts,
      description: "Transferred to your bank",
      icon: (
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
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600",
    },
    {
      title: "Platform Fees",
      value: summary.totalPlatformFees,
      description: "10% service charge",
      icon: (
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
            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"
          />
        </svg>
      ),
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
      valueColor: "text-gray-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full mb-3" />
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-28 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
        >
          <div
            className={`w-10 h-10 ${card.bgColor} rounded-full flex items-center justify-center mb-3 ${card.iconColor}`}
          >
            {card.icon}
          </div>
          <p className="text-sm text-gray-600 mb-1">{card.title}</p>
          <p className={`text-lg font-bold ${card.valueColor}`}>
            {formatCurrency(card.value, summary.currency)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
