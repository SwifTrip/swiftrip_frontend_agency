/**
 * Tour Type Badge Component
 * Displays public/private tour type
 */

import React from "react";
import { TOUR_TYPE_CONFIG } from "../../utils/bookingConstants";

export default function TourTypeBadge({
  tourType,
  size = "md",
  showIcon = true,
}) {
  const config = TOUR_TYPE_CONFIG[tourType] || TOUR_TYPE_CONFIG.PUBLIC;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${config.bgColor} ${config.textColor}
        ${sizeClasses[size]}
      `}
    >
      {showIcon && <span className="text-xs">{config.icon}</span>}
      {config.label}
    </span>
  );
}
