/**
 * Bookings Page
 * Main page for viewing and managing all bookings
 */

import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchBookings,
  setFilters,
  resetFilters,
  selectBookings,
  selectBookingFilters,
  selectBookingLoading,
  selectBookingError,
} from "../../store/slices/bookingSlice";
import { BookingCard, BookingFilters } from "../../components/booking";

// Loading Skeleton Component
const BookingCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-48 h-40 bg-gray-200" />
      <div className="flex-1 p-5">
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="text-right">
            <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ hasFilters, onReset }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-10 h-10 text-orange-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {hasFilters ? "No Bookings Found" : "No Bookings Yet"}
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      {hasFilters
        ? "Try adjusting your filters or search query to find what you're looking for."
        : "When tourists book your tours, they will appear here."}
    </p>
    {hasFilters && (
      <button
        onClick={onReset}
        className="px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
      >
        Clear Filters
      </button>
    )}
  </div>
);

export default function BookingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux selectors
  const bookings = useSelector(selectBookings);
  const filters = useSelector(selectBookingFilters);
  const loading = useSelector(selectBookingLoading);
  const error = useSelector(selectBookingError);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      status: searchParams.get("status") || "ALL",
      tourType: searchParams.get("tourType") || "ALL",
      paymentStatus: searchParams.get("paymentStatus") || "ALL",
      search: searchParams.get("search") || "",
    };
    dispatch(setFilters(urlFilters));
  }, []);

  // Fetch bookings when filters change
  useEffect(() => {
    dispatch(fetchBookings(filters));
  }, [dispatch, filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status !== "ALL") params.set("status", filters.status);
    if (filters.tourType !== "ALL") params.set("tourType", filters.tourType);
    if (filters.paymentStatus !== "ALL")
      params.set("paymentStatus", filters.paymentStatus);
    if (filters.search) params.set("search", filters.search);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.status !== "ALL" ||
      filters.tourType !== "ALL" ||
      filters.paymentStatus !== "ALL" ||
      filters.search !== ""
    );
  }, [filters]);

  // Handlers
  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handleViewDetails = useCallback(
    (bookingId) => {
      navigate(`/app/bookings/${bookingId}`);
    },
    [navigate],
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Booking Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all tour bookings
            </p>
          </div>
          <button
            onClick={() => {
              /* Export functionality */
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Booking List */}
      <div className="space-y-4">
        {loading ? (
          // Loading Skeletons
          <>
            <BookingCardSkeleton />
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </>
        ) : bookings.length > 0 ? (
          // Booking Cards
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          // Empty State
          <EmptyState
            hasFilters={hasActiveFilters}
            onReset={handleResetFilters}
          />
        )}
      </div>

      {/* Results Count */}
      {!loading && bookings.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          {hasActiveFilters && " (filtered)"}
        </div>
      )}
    </div>
  );
}
