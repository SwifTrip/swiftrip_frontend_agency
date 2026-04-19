import React from "react";
import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();

  const pageMeta = [
    {
      match: "/app/dashboard",
      title: "Agency Dashboard",
      subtitle: "Real-time performance and booking intelligence",
    },
    {
      match: "/app/packages",
      title: "Package Management",
      subtitle: "Create, edit, and publish travel packages",
    },
    {
      match: "/app/users",
      title: "User Management",
      subtitle: "Manage travelers, agencies, and access",
    },
    {
      match: "/app/bookings",
      title: "Booking Management",
      subtitle: "Track reservations and booking lifecycle",
    },
    {
      match: "/app/payments",
      title: "Payment Management",
      subtitle: "Monitor transactions and settlement status",
    },
    {
      match: "/app/chat",
      title: "Chat Management",
      subtitle: "Handle conversations and support responses",
    },
    {
      match: "/app/profile",
      title: "Profile Settings",
      subtitle: "Manage account details and contact information",
    },
    {
      match: "/app/company-settings",
      title: "Company Settings",
      subtitle: "Configure agency profile and operational preferences",
    },
  ];

  const currentPage = pageMeta.find((page) =>
    location.pathname.startsWith(page.match),
  ) || {
    title: "Agency Portal",
    subtitle: "Operational dashboard",
  };

  return (
    <header className="h-14 bg-white/84 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_10px_24px_-22px_rgba(251,146,60,0.4)] px-6 py-0">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-300/70 to-transparent"></div>
      <div className="h-full flex items-center justify-between">
        <div className="leading-tight">
          <h1 className="text-sm lg:text-base font-semibold text-slate-800 tracking-[0.01em]">
            {currentPage.title}
          </h1>
          <p className="text-[11px] text-slate-500">{currentPage.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="hidden md:inline">Agency Portal</span>
          <span className="hidden md:inline text-slate-300">/</span>
          <span className="text-orange-700">{currentPage.title}</span>

          {/* Notifications */}
          <button className="relative p-1.5 hover:bg-orange-50/60 rounded-lg transition-all duration-300 ease-in-out text-gray-600 hover:text-orange-700">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
