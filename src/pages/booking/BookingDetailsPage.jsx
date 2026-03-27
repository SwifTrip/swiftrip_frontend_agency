/**
 * Booking Details Page
 * Displays comprehensive details of a single booking
 */

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookingById,
  selectCurrentBooking,
  selectDetailsLoading,
  selectBookingError,
  clearCurrentBooking,
} from "../../store/slices/bookingSlice";
import {
  BookingStatusBadge,
  TourTypeBadge,
  PaymentStatusBadge,
} from "../../components/booking";
import { BOOKING_STATUS, PAYMENT_STATUS } from "../../utils/bookingConstants";

// Info Card Component
const InfoCard = ({ title, icon, children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
  >
    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// Detail Row Component
const DetailRow = ({ label, value, className = "" }) => (
  <div
    className={`flex justify-between py-2 border-b border-gray-50 last:border-0 ${className}`}
  >
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="text-gray-800 font-medium text-sm text-right">
      {value}
    </span>
  </div>
);

// Itinerary Day Card Component
const ItineraryDayCard = ({ itinerary, dayNumber }) => {
  const formatDuration = (minutes) => {
    if (!minutes) return "-";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    return `PKR ${amount?.toLocaleString() || 0}`;
  };

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      {/* Day Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
            {dayNumber}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Day {dayNumber}</h4>
            <p className="text-xs text-gray-500">
              {itinerary.items?.length || 0} activities
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Duration</p>
          <p className="text-sm font-medium text-gray-700">
            {formatDuration(itinerary.totalDuration)}
          </p>
        </div>
      </div>

      {/* Day Content */}
      <div className="p-4">
        {/* Activities List */}
        {itinerary.items && itinerary.items.length > 0 ? (
          <div className="space-y-2">
            {itinerary.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  item.included
                    ? "bg-green-50 border border-green-100"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    item.included
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${item.included ? "text-gray-800" : "text-gray-500 line-through"}`}
                  >
                    Activity #{item.itineraryItemId}
                  </p>
                  {item.isOptional && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      Optional
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.included
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.included ? "Included" : "Excluded"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic text-center py-4">
            No activities scheduled for this day
          </p>
        )}

        {/* Day Summary */}
        {itinerary.estimatedCost > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-600">Estimated Cost</span>
            <span className="text-sm font-semibold text-orange-600">
              {formatCurrency(itinerary.estimatedCost)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Transaction Info Component
const TransactionInfo = ({ payment, lifecycle }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-3">
      {payment?.method && (
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-gray-600 text-sm">Payment Method</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800">
            {payment.method === "card" && (
              <svg
                className="w-4 h-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
          </span>
        </div>
      )}

      {payment?.transactionId && (
        <div className="flex items-center justify-between py-2 border-b border-gray-50">
          <span className="text-gray-600 text-sm">Transaction ID</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {payment.transactionId.length > 20
                ? `${payment.transactionId.slice(0, 10)}...${payment.transactionId.slice(-8)}`
                : payment.transactionId}
            </span>
            <button
              onClick={() => copyToClipboard(payment.transactionId)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Copy Transaction ID"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {lifecycle?.cancelledAt && (
        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
          <p className="text-sm font-medium text-red-700 mb-1">
            Booking Cancelled
          </p>
          <p className="text-xs text-red-600">
            {new Date(lifecycle.cancelledAt).toLocaleString()}
          </p>
          {lifecycle?.cancellationReason && (
            <p className="text-sm text-red-600 mt-2 italic">
              "{lifecycle.cancellationReason}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Loading Skeleton
const DetailsSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl h-64" />
        <div className="bg-white rounded-xl h-48" />
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-xl h-48" />
        <div className="bg-white rounded-xl h-48" />
      </div>
    </div>
  </div>
);

export default function BookingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const booking = useSelector(selectCurrentBooking);
  const loading = useSelector(selectDetailsLoading);
  const error = useSelector(selectBookingError);

  // Fetch booking details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(id));
    }
    return () => {
      dispatch(clearCurrentBooking());
    };
  }, [dispatch, id]);

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount, currency = "PKR") => {
    return `${currency} ${amount?.toLocaleString() || 0}`;
  };

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Booking Not Found
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/app/bookings")}
          className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/app/bookings")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Bookings
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{booking.id}</h1>
              <BookingStatusBadge status={booking.status} size="lg" />
              <TourTypeBadge tourType={booking.tourType} size="md" />
            </div>
            <p className="text-gray-600">
              Booked on {formatDateTime(booking.bookingDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Overview */}
          <InfoCard
            title="Tour Overview"
            icon={
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Tour Title</p>
                <p className="text-sm font-medium text-gray-800">
                  {booking.package?.title || "Custom Tour"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Destination</p>
                <p className="text-sm font-medium text-gray-800">
                  {booking.package?.destination || "-"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-medium text-gray-800">
                  {booking.package?.duration || "-"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Participants</p>
                <p className="text-sm font-medium text-gray-800">
                  {booking.participants}{" "}
                  {booking.participants === 1 ? "Person" : "People"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Type</p>
                <p className="text-sm font-medium text-gray-800">
                  <TourTypeBadge tourType={booking.tourType} size="sm" />
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  {booking.package?.category || "Custom"}
                </span>
              </div>
            </div>
          </InfoCard>

          {/* Schedule */}
          <InfoCard
            title="Schedule"
            icon={
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 font-medium mb-1">
                  START DATE
                </p>
                <p className="text-gray-800 font-semibold">
                  {formatDate(booking.schedule?.startDate)}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 font-medium mb-1">
                  END DATE
                </p>
                <p className="text-gray-800 font-semibold">
                  {formatDate(booking.schedule?.endDate)}
                </p>
              </div>
            </div>

            {/* Progress for ongoing tours */}
            {booking.status === BOOKING_STATUS.ONGOING && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Tour Progress</span>
                  <span className="font-medium">
                    Day {booking.schedule?.currentDay} of{" "}
                    {booking.package?.duration?.split(" ")[0]}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (booking.schedule?.currentDay /
                          parseInt(booking.package?.duration || 1)) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </InfoCard>

          {/* Notes */}
          {booking.notes && (
            <InfoCard
              title="Notes"
              icon={
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            >
              <p className="text-gray-700 whitespace-pre-wrap">
                {booking.notes}
              </p>
            </InfoCard>
          )}

          {/* Tour Itinerary */}
          {booking.itineraries && booking.itineraries.length > 0 && (
            <InfoCard
              title="Tour Itinerary"
              icon={
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              }
            >
              <div className="space-y-4">
                {/* Itinerary Summary */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-orange-600"
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
                    <span className="text-sm font-medium text-orange-700">
                      {booking.itineraries.length} Day
                      {booking.itineraries.length !== 1 ? "s" : ""} Tour
                    </span>
                  </div>
                  <span className="text-sm text-orange-600">
                    {booking.itineraries.reduce(
                      (sum, it) => sum + (it.items?.length || 0),
                      0,
                    )}{" "}
                    Total Activities
                  </span>
                </div>

                {/* Day-by-Day Itinerary */}
                {booking.itineraries.map((itinerary) => (
                  <ItineraryDayCard
                    key={itinerary.id}
                    itinerary={itinerary}
                    dayNumber={itinerary.dayNumber}
                  />
                ))}
              </div>
            </InfoCard>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Tourist Information */}
          <InfoCard
            title="Tourist Information"
            icon={
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-orange-600">
                  {booking.tourist?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {booking.tourist?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {booking.tourist?.email}
                </p>
              </div>
            </div>
            <DetailRow label="Phone" value={booking.tourist?.phone} />
            <DetailRow label="CNIC" value={booking.tourist?.cnic} />
          </InfoCard>

          {/* Payment Details */}
          <InfoCard
            title="Payment Details"
            icon={
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
            }
          >
            <div className="mb-4">
              <PaymentStatusBadge status={booking.paymentStatus} size="md" />
            </div>

            {/* Transaction Info (when available from API) */}
            {(booking.payment?.method || booking.payment?.transactionId) && (
              <div className="mb-4 pb-4 border-b border-gray-100">
                <TransactionInfo
                  payment={booking.payment}
                  lifecycle={booking.lifecycle}
                />
              </div>
            )}

            <DetailRow
              label="Base Price"
              value={formatCurrency(
                booking.pricing?.basePrice,
                booking.pricing?.currency,
              )}
            />
            {booking.pricing?.discount > 0 && (
              <DetailRow
                label="Discount"
                value={`-${formatCurrency(booking.pricing?.discount, booking.pricing?.currency)}`}
                className="text-green-600"
              />
            )}
            <DetailRow
              label="Tax"
              value={formatCurrency(
                booking.pricing?.tax,
                booking.pricing?.currency,
              )}
            />
            <div className="pt-2 mt-2 border-t border-gray-200">
              <DetailRow
                label="Total Amount"
                value={
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(
                      booking.pricing?.totalAmount,
                      booking.pricing?.currency,
                    )}
                  </span>
                }
              />
              <DetailRow
                label="Paid Amount"
                value={formatCurrency(
                  booking.pricing?.paidAmount,
                  booking.pricing?.currency,
                )}
              />
              {booking.paymentStatus === PAYMENT_STATUS.PARTIAL && (
                <DetailRow
                  label="Remaining"
                  value={
                    <span className="text-red-600">
                      {formatCurrency(
                        booking.pricing?.totalAmount -
                          booking.pricing?.paidAmount,
                        booking.pricing?.currency,
                      )}
                    </span>
                  }
                />
              )}
            </div>
          </InfoCard>

          {/* Timeline */}
          <InfoCard
            title="Activity Timeline"
            icon={
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            <div className="relative">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
              <div className="space-y-4">
                <div className="flex gap-3 relative">
                  <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow z-10" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Booking Created
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                </div>
                {booking.status !== BOOKING_STATUS.PENDING && (
                  <div className="flex gap-3 relative">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow z-10" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Status Updated
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(booking.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
