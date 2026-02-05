/**
 * Booking Status Badge Component
 * A reusable badge component for displaying booking status
 */

import React from "react";
import { BOOKING_STATUS_CONFIG } from "../../utils/bookingConstants";

export default function BookingStatusBadge({
  status,
  size = "md",
  showDot = true,
}) {
  const config = BOOKING_STATUS_CONFIG[status] || BOOKING_STATUS_CONFIG.PENDING;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${config.bgColor} ${config.textColor}
        ${sizeClasses[size]}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      )}
      {config.label}
    </span>
  );
}
