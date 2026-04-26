import React, { useState } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/**
 * SchedulePicker Component
 * Displays available schedules for a package and allows selection
 */
const SchedulePicker = ({
  schedules = [],
  selectedSchedule,
  onSelect,
  showBooking = false,
}) => {
  const [hoveredId, setHoveredId] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (schedule) => {
    const statusMap = {
      PUBLISHED: {
        label: "Available",
        class: "bg-green-100 text-green-800",
        icon: CheckCircle2,
      },
      SOLDOUT: {
        label: "Sold Out",
        class: "bg-red-100 text-red-800",
        icon: XCircle,
      },
      DRAFT: {
        label: "Draft",
        class: "bg-gray-100 text-gray-800",
        icon: Clock,
      },
      CANCELLED: {
        label: "Cancelled",
        class: "bg-red-100 text-red-800",
        icon: XCircle,
      },
      COMPLETED: {
        label: "Completed",
        class: "bg-orange-100 text-orange-800",
        icon: CheckCircle2,
      },
    };

    const status = statusMap[schedule.status] || statusMap.DRAFT;
    const Icon = status.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.class}`}
      >
        <Icon className="w-3 h-3" />
        {status.label}
      </span>
    );
  };

  const getPrice = (schedule) => {
    if (schedule.effectivePrice) return schedule.effectivePrice;
    if (schedule.priceOverride) return schedule.priceOverride;
    return schedule.tourPackage?.basePrice || 0;
  };

  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No schedules available
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Create departure dates for this package.
        </p>
      </div>
    );
  }

  // Group by month
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const date = new Date(schedule.departureDate);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthKey]) {
      acc[monthKey] = { label: monthLabel, schedules: [] };
    }

    acc[monthKey].schedules.push(schedule);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.values(groupedSchedules).map((group) => (
        <div key={group.label}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {group.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedSchedule?.id === schedule.id
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : hoveredId === schedule.id
                      ? "border-gray-400 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  schedule.status === "PUBLISHED" && onSelect(schedule)
                }
                onMouseEnter={() => setHoveredId(schedule.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(schedule)}
                </div>

                {/* Date Range */}
                <div className="flex items-start gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(schedule.departureDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {formatDate(schedule.arrivalDate)}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {schedule.seatsAvailable}
                    </span>{" "}
                    / {schedule.seatsTotal} seats
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {schedule.tourPackage?.currency || "PKR"}{" "}
                    {getPrice(schedule).toLocaleString()}
                  </span>
                  {schedule.priceOverride && (
                    <span className="text-xs text-green-600 font-medium">
                      Special Price!
                    </span>
                  )}
                </div>

                {/* Booking Info */}
                {showBooking && schedule._count?.publicTours > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-600">
                      {schedule._count.publicTours} booking
                      {schedule._count.publicTours > 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {/* Selected Indicator */}
                {selectedSchedule?.id === schedule.id && (
                  <div className="absolute inset-0 bg-orange-500 opacity-10 rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchedulePicker;
