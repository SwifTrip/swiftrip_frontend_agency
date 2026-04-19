/**
 * Bookings Page
 * Main page for viewing and managing all bookings
 */

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchBookings,
  setFilters,
  resetFilters,
  selectBookings,
  selectBookingStats,
  selectBookingFilters,
  selectBookingLoading,
  selectBookingError,
} from "../../store/slices/bookingSlice";
import {
  BookingCard,
  BookingFilters,
  BookingStats,
} from "../../components/booking";

// Loading Skeleton Component
const BookingCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-44 h-36 bg-slate-200" />
      <div className="flex-1 p-5">
        <div className="flex justify-between mb-4">
          <div>
            <div className="h-3.5 w-20 bg-slate-200 rounded mb-2" />
            <div className="h-5.5 w-44 bg-slate-200 rounded mb-2" />
            <div className="h-3.5 w-28 bg-slate-200 rounded" />
          </div>
          <div className="text-right">
            <div className="h-5.5 w-24 bg-slate-200 rounded mb-2" />
            <div className="h-4.5 w-20 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded" />
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="h-3.5 w-32 bg-slate-200 rounded" />
          <div className="h-8 w-24 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ hasFilters, onReset }) => (
  <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-10 text-center">
    <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-8 h-8 text-orange-500"
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
    <h3 className="text-lg font-semibold text-slate-800 mb-2">
      {hasFilters ? "No Bookings Found" : "No Bookings Yet"}
    </h3>
    <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
      {hasFilters
        ? "Try adjusting your filters or search query to find what you're looking for."
        : "When tourists book your tours, they will appear here."}
    </p>
    {hasFilters && (
      <button
        onClick={onReset}
        className="px-5 h-10 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors"
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
  const [filtersReady, setFiltersReady] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  // Redux selectors
  const bookings = useSelector(selectBookings);
  const stats = useSelector(selectBookingStats);
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
    setFiltersReady(true);
  }, []);

  // Fetch bookings when filters change
  useEffect(() => {
    if (!filtersReady) return;
    dispatch(fetchBookings(filters));
  }, [dispatch, filters, filtersReady]);

  useEffect(() => {
    if (filtersReady && !loading) {
      setHasFetchedOnce(true);
    }
  }, [filtersReady, loading]);

  // Update URL when filters change
  useEffect(() => {
    if (!filtersReady) return;
    const params = new URLSearchParams();
    if (filters.status !== "ALL") params.set("status", filters.status);
    if (filters.tourType !== "ALL") params.set("tourType", filters.tourType);
    if (filters.paymentStatus !== "ALL")
      params.set("paymentStatus", filters.paymentStatus);
    if (filters.search) params.set("search", filters.search);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams, filtersReady]);

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
      const isSame = Object.entries(newFilters).every(
        ([key, value]) => filters[key] === value,
      );

      if (isSame) return;
      dispatch(setFilters(newFilters));
    },
    [dispatch, filters],
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

  const showInitialSkeleton = !hasFetchedOnce && loading;
  const showUpdatingOverlay = hasFetchedOnce && loading;
  const showEmptyState = hasFetchedOnce && !loading && bookings.length === 0;
  const showBookings = bookings.length > 0;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            /* Export functionality */
          }}
          className="inline-flex h-10 items-center gap-2 px-4 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export Data
        </button>
      </div>

      <BookingStats stats={stats} />

      {/* Filters */}
      <BookingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
      <div className="relative">
        {showUpdatingOverlay && (
          <div className="absolute inset-0 z-10 bg-white/55 backdrop-blur-[1px] rounded-xl pointer-events-none flex items-start justify-end p-3">
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/90 border border-slate-200 rounded-md px-2.5 py-1.5 shadow-sm">
              <div className="w-3.5 h-3.5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              Updating results...
            </div>
          </div>
        )}

        <div className="space-y-4">
          {showInitialSkeleton ? (
            <>
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </>
          ) : showBookings ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : null}
        </div>

        {showEmptyState && (
          <EmptyState
            hasFilters={hasActiveFilters}
            onReset={handleResetFilters}
          />
        )}
      </div>

      {/* Results Count */}
      {!loading && bookings.length > 0 && (
        <div className="mt-5 text-center text-sm text-slate-500">
          Showing {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          {hasActiveFilters && " (filtered)"}
        </div>
      )}
    </div>
  );
}
