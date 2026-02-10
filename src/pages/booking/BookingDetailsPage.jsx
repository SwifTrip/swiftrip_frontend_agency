/**
 * Booking Details Page
 * Displays comprehensive details of a single booking
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchBookingById,
  updateBookingStatus,
  cancelBooking,
  selectCurrentBooking,
  selectDetailsLoading,
  selectActionLoading,
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

// Cancel Modal Component
const CancelModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Cancel Booking
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter cancellation reason..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={loading || !reason.trim()}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        </div>
      </div>
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
  const actionLoading = useSelector(selectActionLoading);
  const error = useSelector(selectBookingError);

  const [showCancelModal, setShowCancelModal] = useState(false);

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

  // Status update handler
  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(
        updateBookingStatus({ id: booking.id, status: newStatus }),
      ).unwrap();
      toast.success(`Booking status updated to ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update booking status");
    }
  };

  // Cancel handler
  const handleCancelBooking = async (reason) => {
    try {
      await dispatch(cancelBooking({ id: booking.id, reason })).unwrap();
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  // Quick status actions based on current status
  const getAvailableActions = () => {
    if (!booking) return [];

    const actions = [];

    switch (booking.status) {
      case BOOKING_STATUS.PENDING:
        actions.push({
          label: "Confirm Booking",
          status: BOOKING_STATUS.CONFIRMED,
          color: "bg-blue-600 hover:bg-blue-700",
        });
        actions.push({
          label: "Cancel",
          action: () => setShowCancelModal(true),
          color: "bg-red-600 hover:bg-red-700",
        });
        break;
      case BOOKING_STATUS.CONFIRMED:
        actions.push({
          label: "Start Tour",
          status: BOOKING_STATUS.ONGOING,
          color: "bg-orange-600 hover:bg-orange-700",
        });
        actions.push({
          label: "Cancel",
          action: () => setShowCancelModal(true),
          color: "bg-red-600 hover:bg-red-700",
        });
        break;
      case BOOKING_STATUS.ONGOING:
        actions.push({
          label: "Complete Tour",
          status: BOOKING_STATUS.COMPLETED,
          color: "bg-green-600 hover:bg-green-700",
        });
        break;
      default:
        break;
    }

    return actions;
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

  const availableActions = getAvailableActions();

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

          {/* Action Buttons */}
          {availableActions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableActions.map((action, index) => (
                <button
                  key={index}
                  onClick={
                    action.action || (() => handleStatusUpdate(action.status))
                  }
                  disabled={actionLoading}
                  className={`px-4 py-2.5 text-white font-medium rounded-lg transition-colors disabled:opacity-50 ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Package Info */}
          <InfoCard
            title="Tour Package"
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
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={booking.package?.image}
                alt={booking.package?.title}
                className="w-full sm:w-40 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
                }}
              />
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                  {booking.package?.title}
                </h4>
                <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
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
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {booking.package?.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {booking.participants} Participants
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {booking.package?.category}
                  </span>
                </div>
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

      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelBooking}
        loading={actionLoading}
      />
    </div>
  );
}
