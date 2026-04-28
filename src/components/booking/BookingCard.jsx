/**
 * Booking Card Component
 * Displays booking information in a card format for the list view
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import BookingStatusBadge from "./BookingStatusBadge";
import TourTypeBadge from "./TourTypeBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function BookingCard({ booking, onViewDetails }) {
  const navigate = useNavigate();
  const isGroupedPublic =
    booking.tourType === "PUBLIC" &&
    booking.isGroupedPublic &&
    Array.isArray(booking.groupedBookings) &&
    booking.groupedBookings.length > 1;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "PKR") => {
    return `${currency} ${amount?.toLocaleString() || 0}`;
  };

  const handleViewClick = () => {
    if (isGroupedPublic) {
      if (onViewDetails) {
        onViewDetails(booking.id, { groupedPublicBooking: booking });
      } else {
        navigate(`/app/bookings/${booking.id}`, {
          state: { groupedPublicBooking: booking },
        });
      }
      return;
    }

    if (onViewDetails) {
      onViewDetails(booking.id);
    } else {
      navigate(`/app/bookings/${booking.id}`);
    }
  };

  const getProgressPercentage = () => {
    if (!booking.schedule?.currentDay) return 0;
    const totalDays = parseInt(booking.package?.duration) || 1;
    return Math.min((booking.schedule.currentDay / totalDays) * 100, 100);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Tour Image */}
        <div className="relative w-full md:w-44 h-36 md:h-auto flex-shrink-0">
          <img
            src={booking.package?.image}
            alt={booking.package?.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
            }}
          />
          <div className="absolute top-2 left-2">
            <TourTypeBadge tourType={booking.tourType} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-4.5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold tracking-wide text-slate-500">
                  {isGroupedPublic
                    ? `${booking.groupedCount} PUBLIC BOOKINGS`
                    : booking.id}
                </span>
                {isGroupedPublic ? (
                  <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                    Grouped
                  </span>
                ) : (
                  <BookingStatusBadge status={booking.status} size="sm" />
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-800 line-clamp-1">
                {booking.package?.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {booking.package?.destination}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-orange-600">
                {formatCurrency(
                  booking.pricing?.totalAmount,
                  booking.pricing?.currency,
                )}
              </p>
              {isGroupedPublic ? (
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                  Multiple Payments
                </span>
              ) : (
                <PaymentStatusBadge status={booking.paymentStatus} size="sm" />
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
            {/* Tourist */}
            <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">
                  {isGroupedPublic ? "Latest Tourist" : "Tourist"}
                </p>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {booking.tourist?.name}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-slate-500"
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
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Duration</p>
                <p className="text-xs font-semibold text-slate-800">
                  {booking.package?.duration}
                </p>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Starts</p>
                <p className="text-xs font-semibold text-slate-800">
                  {formatDate(booking.schedule?.startDate)}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Guests</p>
                <p className="text-xs font-semibold text-slate-800">
                  {booking.participants} persons
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar (for ongoing tours) */}
          {booking.status === "ONGOING" && (
            <div className="mb-3.5">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1.5">
                <span>Tour Progress</span>
                <span>
                  Day {booking.schedule?.currentDay} of{" "}
                  {booking.package?.duration?.split(" ")[0]}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">
              {isGroupedPublic
                ? `${booking.groupedCount} people booked this public package`
                : `Booked on ${formatDate(booking.bookingDate)}`}
            </p>
            <button
              onClick={handleViewClick}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-sm font-semibold text-orange-700 border border-orange-200 hover:bg-orange-50 rounded-lg transition-colors"
            >
              {isGroupedPublic
                ? "View Users"
                : "View Details"}
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
                  d={
                    "M9 5l7 7-7 7"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
