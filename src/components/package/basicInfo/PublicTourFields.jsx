import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

export default function PublicTourFields({
  maxGroupSize,
  arrivalDate,
  departureDate,
  onMaxGroupSizeChange,
  onArrivalDateChange,
  onDepartureDateChange,
  errors,
  onBlur,
}) {
  const todayStr = new Date().toISOString().split("T")[0];
  const nextDayStr = (dateStr) => {
    if (!dateStr) return todayStr;
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" /> Public Tour Details
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Max Group Size <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={maxGroupSize ?? ""}
            onChange={(e) =>
              onMaxGroupSizeChange(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            onBlur={() => onBlur && onBlur("maxGroupSize")}
            placeholder="e.g., 20"
            min="1"
            className={`w-full px-3 py-2 bg-white border rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors?.maxGroupSize ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.maxGroupSize && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.maxGroupSize}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Departure Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={departureDate ?? ""}
            onChange={(e) => onDepartureDateChange(e.target.value)}
            onBlur={() => onBlur && onBlur("departureDate")}
            min={todayStr}
            className={`w-full px-3 py-2 bg-white border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors?.departureDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.departureDate && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.departureDate}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Arrival Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={arrivalDate ?? ""}
            onChange={(e) => onArrivalDateChange(e.target.value)}
            onBlur={() => onBlur && onBlur("arrivalDate")}
            min={departureDate ? nextDayStr(departureDate) : todayStr}
            className={`w-full px-3 py-2 bg-white border rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors?.arrivalDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.arrivalDate && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.arrivalDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
