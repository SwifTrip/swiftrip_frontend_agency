/**
 * Booking Stats Cards Component
 * Displays booking statistics in a grid of cards
 */

import React from "react";

export default function BookingStats({ stats }) {
  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurrency = (amount) => {
    const normalizedAmount = toNumber(amount);

    if (normalizedAmount >= 1000000) {
      return `PKR ${(normalizedAmount / 1000000).toFixed(1)}M`;
    } else if (normalizedAmount >= 1000) {
      return `PKR ${(normalizedAmount / 1000).toFixed(0)}K`;
    }
    return `PKR ${normalizedAmount}`;
  };

  const statCards = [
    {
      title: "Total Bookings",
      value: toNumber(stats.total),
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Ongoing Tours",
      value: toNumber(stats.ongoing),
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Completed",
      value: toNumber(stats.completed),
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending",
      value: toNumber(stats.pending),
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(stats.pendingPayments),
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-5">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200/80 hover:shadow-md transition-all"
        >
          <div
            className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-2.5 ${stat.iconColor}`}
          >
            {stat.icon}
          </div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
            {stat.title}
          </p>
          <p className="text-lg font-semibold text-slate-800">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
