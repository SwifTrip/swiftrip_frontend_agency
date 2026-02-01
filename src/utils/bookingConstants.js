/**
 * Booking Module Constants
 * Centralized constants for booking-related functionality
 */

// Booking Status Types
export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

// Tour Types
export const TOUR_TYPE = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
};

// Status Color Configurations
export const BOOKING_STATUS_CONFIG = {
  [BOOKING_STATUS.PENDING]: {
    label: "Pending",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    dotColor: "bg-yellow-500",
  },
  [BOOKING_STATUS.CONFIRMED]: {
    label: "Confirmed",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  [BOOKING_STATUS.ONGOING]: {
    label: "Ongoing",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    dotColor: "bg-orange-500",
  },
  [BOOKING_STATUS.COMPLETED]: {
    label: "Completed",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    dotColor: "bg-green-500",
  },
  [BOOKING_STATUS.CANCELLED]: {
    label: "Cancelled",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    dotColor: "bg-red-500",
  },
};

export const PAYMENT_STATUS_CONFIG = {
  [PAYMENT_STATUS.PENDING]: {
    label: "Payment Pending",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
  },
  [PAYMENT_STATUS.PARTIAL]: {
    label: "Partially Paid",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  [PAYMENT_STATUS.PAID]: {
    label: "Fully Paid",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  [PAYMENT_STATUS.REFUNDED]: {
    label: "Refunded",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
};

export const TOUR_TYPE_CONFIG = {
  [TOUR_TYPE.PUBLIC]: {
    label: "Public Tour",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    icon: "🌍",
  },
  [TOUR_TYPE.PRIVATE]: {
    label: "Private Tour",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    icon: "🔒",
  },
};

// Filter Options
export const BOOKING_FILTER_OPTIONS = {
  status: [
    { value: "ALL", label: "All Status" },
    { value: BOOKING_STATUS.PENDING, label: "Pending" },
    { value: BOOKING_STATUS.CONFIRMED, label: "Confirmed" },
    { value: BOOKING_STATUS.ONGOING, label: "Ongoing" },
    { value: BOOKING_STATUS.COMPLETED, label: "Completed" },
    { value: BOOKING_STATUS.CANCELLED, label: "Cancelled" },
  ],
  tourType: [
    { value: "ALL", label: "All Tours" },
    { value: TOUR_TYPE.PUBLIC, label: "Public Tours" },
    { value: TOUR_TYPE.PRIVATE, label: "Private Tours" },
  ],
  paymentStatus: [
    { value: "ALL", label: "All Payments" },
    { value: PAYMENT_STATUS.PENDING, label: "Pending" },
    { value: PAYMENT_STATUS.PARTIAL, label: "Partial" },
    { value: PAYMENT_STATUS.PAID, label: "Paid" },
    { value: PAYMENT_STATUS.REFUNDED, label: "Refunded" },
  ],
  dateRange: [
    { value: "ALL", label: "All Time" },
    { value: "TODAY", label: "Today" },
    { value: "THIS_WEEK", label: "This Week" },
    { value: "THIS_MONTH", label: "This Month" },
    { value: "LAST_MONTH", label: "Last Month" },
    { value: "CUSTOM", label: "Custom Range" },
  ],
};
