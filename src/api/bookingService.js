/**
 * Booking API Service
 *
 * This service handles all booking-related API calls.
 * Integrated with real backend API endpoints.
 */

import axios from "axios";
import mockBookings, { calculateBookingStats } from "../data/mockBookings";
import {
  BOOKING_STATUS,
  TOUR_TYPE,
  PAYMENT_STATUS,
} from "../utils/bookingConstants";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// API Client Configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to simulate API delay for mock functions (will be removed when all endpoints are ready)
const simulateDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Transform backend booking data to frontend expected format
 * Maps the API response structure to the UI component requirements
 */
const transformBooking = (apiBooking) => {
  const customTour = apiBooking.customTour;
  const user = customTour?.user;
  const itineraries = customTour?.customItineraries || [];

  // Calculate duration from itineraries or date range
  const totalDays =
    itineraries.length ||
    Math.ceil(
      (new Date(customTour?.endDate) - new Date(customTour?.startDate)) /
        (1000 * 60 * 60 * 24),
    ) + 1;

  // Map backend status to frontend status
  const statusMap = {
    HELD: BOOKING_STATUS.PENDING,
    CONFIRMED: BOOKING_STATUS.CONFIRMED,
    CANCELLED: BOOKING_STATUS.CANCELLED,
    EXPIRED: BOOKING_STATUS.CANCELLED,
    COMPLETED: BOOKING_STATUS.COMPLETED,
  };

  // Map backend payment status to frontend payment status
  const paymentStatusMap = {
    PENDING: PAYMENT_STATUS.PENDING,
    PAID: PAYMENT_STATUS.PAID,
    REFUNDED: PAYMENT_STATUS.REFUNDED,
    FAILED: PAYMENT_STATUS.PENDING,
  };

  // Calculate current day for ongoing tours
  const today = new Date();
  const startDate = new Date(customTour?.startDate);
  const endDate = new Date(customTour?.endDate);
  let currentDay = 0;
  if (today >= startDate && today <= endDate) {
    currentDay = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Determine if tour is ongoing
  let mappedStatus = statusMap[apiBooking.status] || BOOKING_STATUS.PENDING;
  if (
    mappedStatus === BOOKING_STATUS.CONFIRMED &&
    today >= startDate &&
    today <= endDate
  ) {
    mappedStatus = BOOKING_STATUS.ONGOING;
  }

  return {
    id: `BK-${apiBooking.id}`,
    bookingDate: apiBooking.createdAt,
    tourType: TOUR_TYPE.PRIVATE, // Custom tours are private by default
    status: mappedStatus,
    paymentStatus:
      paymentStatusMap[apiBooking.paymentStatus] || PAYMENT_STATUS.PENDING,
    package: {
      id: `CT-${customTour?.id}`,
      title: `Custom Tour - ${totalDays} Days`,
      destination: getDestinationFromItineraries(itineraries),
      duration: `${totalDays} Days / ${totalDays - 1} Nights`,
      category: "CUSTOM",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    schedule: {
      id: `SCH-${customTour?.id}`,
      startDate: customTour?.startDate,
      endDate: customTour?.endDate,
      currentDay: currentDay,
    },
    tourist: {
      id: `USR-${user?.id}`,
      name: user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "Unknown Tourist"
        : "Unknown Tourist",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || null,
      cnic: user?.cnic || "",
    },
    pricing: {
      basePrice: customTour?.totalPrice || apiBooking.totalAmount,
      discount: 0,
      tax: 0,
      totalAmount: apiBooking.totalAmount,
      paidAmount:
        apiBooking.paymentStatus === "PAID" ? apiBooking.totalAmount : 0,
      currency: "PKR",
    },
    participants: customTour?.travelerCount || apiBooking.seats || 1,
    notes: apiBooking.cancellationReason || "",
    createdAt: apiBooking.createdAt,
    updatedAt: apiBooking.updatedAt,
  };
};

/**
 * Transform backend booking data to detailed frontend format
 * Includes all raw data for detailed view including itineraries
 */
const transformBookingDetails = (apiBooking) => {
  const baseTransform = transformBooking(apiBooking);
  const customTour = apiBooking.customTour;
  const itineraries = customTour?.customItineraries || [];

  // Transform itineraries for display
  const transformedItineraries = itineraries
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((itinerary) => ({
      id: itinerary.id,
      dayNumber: itinerary.dayNumber,
      estimatedCost: itinerary.estimatedCost,
      totalDuration: itinerary.totalDuration, // in minutes
      items: (itinerary.customItems || [])
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((item) => ({
          id: item.id,
          itineraryItemId: item.itineraryItemId,
          included: item.included,
          isOptional: item.isOptional,
          sortOrder: item.sortOrder,
        })),
    }));

  return {
    ...baseTransform,
    // Extended details
    rawBookingType: apiBooking.bookingType,
    rawStatus: apiBooking.status,
    rawPaymentStatus: apiBooking.paymentStatus,
    // Payment details
    payment: {
      method: apiBooking.paymentMethod,
      transactionId: apiBooking.transactionId,
      chargeId: apiBooking.chargeId,
      grossAmount: apiBooking.grossAmount,
      agencyAdvanceAmount: apiBooking.agencyAdvanceAmount,
      agencyFinalAmount: apiBooking.agencyFinalAmount,
      platformAmount: apiBooking.platformAmount,
      transferGroup: apiBooking.transferGroup,
    },
    // Payout information
    payout: {
      status: apiBooking.payoutStatus,
      advanceReleasedAt: apiBooking.advanceReleasedAt,
      finalReleasedAt: apiBooking.finalReleasedAt,
    },
    // Booking lifecycle
    lifecycle: {
      holdExpiresAt: apiBooking.holdExpiresAt,
      cancelledAt: apiBooking.cancelledAt,
      cancellationReason: apiBooking.cancellationReason,
    },
    // Custom tour specific details
    customTour: customTour
      ? {
          id: customTour.id,
          status: customTour.status,
          travelerCount: customTour.travelerCount,
          totalPrice: customTour.totalPrice,
          startDate: customTour.startDate,
          endDate: customTour.endDate,
        }
      : null,
    // Itineraries with activities
    itineraries: transformedItineraries,
    // Raw API data for debugging/reference
    _raw: apiBooking,
  };
};

/**
 * Extract destination from itineraries (best effort)
 */
const getDestinationFromItineraries = (itineraries) => {
  if (!itineraries || itineraries.length === 0) {
    return "Pakistan";
  }
  // Return a generic description based on tour length
  const days = itineraries.length;
  if (days <= 3) return "Northern Areas";
  if (days <= 5) return "Hunza Valley";
  if (days <= 7) return "Gilgit-Baltistan";
  return "Multi-Region Tour";
};

/**
 * Calculate booking statistics from transformed bookings
 */
const calculateStatsFromBookings = (bookings) => {
  return {
    total: bookings.length,
    ongoing: bookings.filter((b) => b.status === BOOKING_STATUS.ONGOING).length,
    completed: bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED)
      .length,
    pending: bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
    confirmed: bookings.filter((b) => b.status === BOOKING_STATUS.CONFIRMED)
      .length,
    cancelled: bookings.filter((b) => b.status === BOOKING_STATUS.CANCELLED)
      .length,
    publicTours: bookings.filter((b) => b.tourType === TOUR_TYPE.PUBLIC).length,
    privateTours: bookings.filter((b) => b.tourType === TOUR_TYPE.PRIVATE)
      .length,
    totalRevenue: bookings.reduce(
      (sum, b) => sum + (b.pricing?.totalAmount || 0),
      0,
    ),
    pendingPayments: bookings
      .filter((b) => b.paymentStatus !== PAYMENT_STATUS.PAID)
      .reduce(
        (sum, b) =>
          sum + (b.pricing?.totalAmount - (b.pricing?.paidAmount || 0)),
        0,
      ),
  };
};

/**
 * Get all bookings with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.status - Booking status filter
 * @param {string} filters.tourType - Tour type filter (PUBLIC/PRIVATE)
 * @param {string} filters.paymentStatus - Payment status filter
 * @param {string} filters.search - Search query
 * @param {string} filters.startDate - Start date filter
 * @param {string} filters.endDate - End date filter
 * @param {number} filters.page - Page number for pagination
 * @param {number} filters.limit - Items per page
 * @param {number} filters.companyId - Company ID (required for API)
 */
export const getAllBookings = async (filters = {}) => {
  const { companyId, page = 1, limit = 10 } = filters;

  // If no companyId, fall back to mock data for development
  if (!companyId) {
    console.warn("No companyId provided, using mock data");
    return getMockBookings(filters);
  }

  try {
    const response = await apiClient.get("/agency/bookings", {
      params: {
        companyId,
        page,
        limit,
      },
    });

    if (response.data.success) {
      // Transform API bookings to frontend format
      let transformedBookings = response.data.bookings.map(transformBooking);

      // Apply client-side filters (since backend may not support all filters yet)
      transformedBookings = applyClientFilters(transformedBookings, filters);

      return {
        success: true,
        data: transformedBookings,
        stats: calculateStatsFromBookings(transformedBookings),
        pagination: {
          total: response.data.total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(response.data.total / limit),
        },
      };
    }

    throw new Error(response.data.error || "Failed to fetch bookings");
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Fallback to mock data on error during development
    if (import.meta.env.DEV) {
      console.warn("API error, falling back to mock data");
      return getMockBookings(filters);
    }
    throw error;
  }
};

/**
 * Apply client-side filters to bookings
 * Used when backend doesn't support certain filters
 */
const applyClientFilters = (bookings, filters) => {
  let filtered = [...bookings];

  if (filters.status && filters.status !== "ALL") {
    filtered = filtered.filter((b) => b.status === filters.status);
  }

  if (filters.tourType && filters.tourType !== "ALL") {
    filtered = filtered.filter((b) => b.tourType === filters.tourType);
  }

  if (filters.paymentStatus && filters.paymentStatus !== "ALL") {
    filtered = filtered.filter(
      (b) => b.paymentStatus === filters.paymentStatus,
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.id.toLowerCase().includes(searchLower) ||
        b.tourist.name.toLowerCase().includes(searchLower) ||
        b.tourist.email.toLowerCase().includes(searchLower) ||
        b.package.title.toLowerCase().includes(searchLower) ||
        b.package.destination.toLowerCase().includes(searchLower),
    );
  }

  return filtered;
};

/**
 * Fallback to mock data for development
 */
const getMockBookings = async (filters = {}) => {
  let filteredBookings = [...mockBookings];

  // Apply filters
  if (filters.status && filters.status !== "ALL") {
    filteredBookings = filteredBookings.filter(
      (b) => b.status === filters.status,
    );
  }

  if (filters.tourType && filters.tourType !== "ALL") {
    filteredBookings = filteredBookings.filter(
      (b) => b.tourType === filters.tourType,
    );
  }

  if (filters.paymentStatus && filters.paymentStatus !== "ALL") {
    filteredBookings = filteredBookings.filter(
      (b) => b.paymentStatus === filters.paymentStatus,
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredBookings = filteredBookings.filter(
      (b) =>
        b.id.toLowerCase().includes(searchLower) ||
        b.tourist.name.toLowerCase().includes(searchLower) ||
        b.tourist.email.toLowerCase().includes(searchLower) ||
        b.package.title.toLowerCase().includes(searchLower) ||
        b.package.destination.toLowerCase().includes(searchLower),
    );
  }

  // Sort by booking date (newest first)
  filteredBookings.sort(
    (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate),
  );

  return {
    success: true,
    data: filteredBookings,
    stats: calculateBookingStats(mockBookings),
    pagination: {
      total: filteredBookings.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
      totalPages: Math.ceil(filteredBookings.length / (filters.limit || 10)),
    },
  };
};

/**
 * Get single booking by ID
 * @param {string} id - Booking ID (format: "BK-{numeric_id}" or just numeric id)
 * @param {number} companyId - Company ID (required for API)
 */
export const getBookingById = async (id, companyId) => {
  // Extract numeric ID from formatted ID (e.g., "BK-4" -> 4)
  const numericId =
    typeof id === "string" && id.startsWith("BK-")
      ? parseInt(id.replace("BK-", ""), 10)
      : parseInt(id, 10);

  // If no companyId, fall back to mock data
  if (!companyId) {
    console.warn("No companyId provided for getBookingById, using mock data");
    await simulateDelay(200);
    const booking = mockBookings.find((b) => b.id === id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return { success: true, data: booking };
  }

  try {
    // Fetch bookings list and find the specific booking
    // NOTE: When backend adds /agency/bookings/:id endpoint, update this
    const response = await apiClient.get("/agency/bookings", {
      params: {
        companyId,
        page: 1,
        limit: 100, // Fetch enough to find the booking
      },
    });

    if (response.data.success) {
      const apiBooking = response.data.bookings.find((b) => b.id === numericId);

      if (!apiBooking) {
        throw new Error("Booking not found");
      }

      // Transform with detailed data including itineraries
      const transformedBooking = transformBookingDetails(apiBooking);

      return {
        success: true,
        data: transformedBooking,
      };
    }

    throw new Error(response.data.error || "Failed to fetch booking");
  } catch (error) {
    console.error("Error fetching booking:", error);
    // Fallback to mock data on error during development
    if (import.meta.env.DEV) {
      console.warn("API error, falling back to mock data");
      await simulateDelay(200);
      const booking = mockBookings.find((b) => b.id === id);
      if (!booking) {
        throw new Error("Booking not found");
      }
      return { success: true, data: booking };
    }
    throw error;
  }
};

/**
 * Update booking status
 * @param {string} id - Booking ID
 * @param {string} status - New status
 */
export const updateBookingStatus = async (id, status) => {
  // TODO: Replace with real API call
  // const response = await apiClient.patch(`/bookings/${id}/status`, { status });
  // return response.data;

  await simulateDelay(300);

  const bookingIndex = mockBookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    throw new Error("Booking not found");
  }

  // Simulate update
  const updatedBooking = {
    ...mockBookings[bookingIndex],
    status,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: updatedBooking,
    message: "Booking status updated successfully",
  };
};

/**
 * Update payment status
 * @param {string} id - Booking ID
 * @param {Object} paymentData - Payment update data
 */
export const updatePaymentStatus = async (id, paymentData) => {
  // TODO: Replace with real API call
  // const response = await apiClient.patch(`/bookings/${id}/payment`, paymentData);
  // return response.data;

  await simulateDelay(300);

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return {
    success: true,
    data: {
      ...booking,
      paymentStatus: paymentData.status,
      pricing: {
        ...booking.pricing,
        paidAmount: paymentData.paidAmount || booking.pricing.paidAmount,
      },
      updatedAt: new Date().toISOString(),
    },
    message: "Payment status updated successfully",
  };
};

/**
 * Cancel booking
 * @param {string} id - Booking ID
 * @param {string} reason - Cancellation reason
 */
export const cancelBooking = async (id, reason) => {
  // TODO: Replace with real API call
  // const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
  // return response.data;

  await simulateDelay(300);

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    throw new Error("Booking not found");
  }

  return {
    success: true,
    data: {
      ...booking,
      status: "CANCELLED",
      notes: `${booking.notes}\nCancellation reason: ${reason}`,
      updatedAt: new Date().toISOString(),
    },
    message: "Booking cancelled successfully",
  };
};

/**
 * Get booking statistics
 */
export const getBookingStats = async () => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/bookings/stats');
  // return response.data;

  await simulateDelay(200);

  return {
    success: true,
    data: calculateBookingStats(mockBookings),
  };
};

/**
 * Export bookings data
 * @param {Object} filters - Export filters
 * @param {string} format - Export format (csv, pdf, excel)
 */
export const exportBookings = async (filters = {}, format = "csv") => {
  // TODO: Replace with real API call
  // const response = await apiClient.get('/bookings/export', {
  //   params: { ...filters, format },
  //   responseType: 'blob',
  // });
  // return response.data;

  await simulateDelay(500);

  return {
    success: true,
    message: `Export functionality will be available when API is ready`,
  };
};

export default {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  getBookingStats,
  exportBookings,
};
