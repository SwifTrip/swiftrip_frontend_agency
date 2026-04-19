import React from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function SharedStaysSection({
  tourStays,
  onAddStay,
  onUpdateStay,
  onRemoveStay,
  errors = {},
}) {
  const getError = (idx, field) => errors[`tourStays.${idx}.${field}`] || "";

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <BuildingOfficeIcon className="w-5 h-5" />
          Shared Stays (optional)
        </label>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          onClick={onAddStay}
        >
          + Add Stay
        </button>
      </div>
      {(tourStays || []).length > 0 && (
        <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          {(tourStays || []).map((stay, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-300 rounded-lg bg-white hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Stay Type
                  </label>
                  <select
                    value={stay.stayType}
                    onChange={(e) =>
                      onUpdateStay(idx, "stayType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="HOTEL">Hotel</option>
                    <option value="GUESTHOUSE">Guesthouse</option>
                    <option value="CAMP">Camp</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={stay.hotelName}
                    onChange={(e) =>
                      onUpdateStay(idx, "hotelName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      getError(idx, "hotelName")
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Stay name"
                  />
                  {getError(idx, "hotelName") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "hotelName")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={stay.rating ?? ""}
                    onChange={(e) =>
                      onUpdateStay(idx, "rating", Number(e.target.value || 0))
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      getError(idx, "rating")
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="4.5"
                  />
                  {getError(idx, "rating") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "rating")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Check-in Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stay.checkInDay ?? 1}
                    onChange={(e) =>
                      onUpdateStay(
                        idx,
                        "checkInDay",
                        Number(e.target.value || 1),
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      getError(idx, "checkInDay")
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {getError(idx, "checkInDay") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "checkInDay")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Check-out Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stay.checkOutDay ?? 1}
                    onChange={(e) =>
                      onUpdateStay(
                        idx,
                        "checkOutDay",
                        Number(e.target.value || 1),
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      getError(idx, "checkOutDay")
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {getError(idx, "checkOutDay") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "checkOutDay")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stay.rooms ?? 1}
                    onChange={(e) =>
                      onUpdateStay(idx, "rooms", Number(e.target.value || 1))
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      getError(idx, "rooms")
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {getError(idx, "rooms") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "rooms")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Beds/Room
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stay.bedsPerRoom ?? 2}
                    onChange={(e) =>
                      onUpdateStay(
                        idx,
                        "bedsPerRoom",
                        Number(e.target.value || 2),
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      getError(idx, "bedsPerRoom")
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {getError(idx, "bedsPerRoom") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "bedsPerRoom")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 pb-3 border-b border-gray-200">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Room Type
                  </label>
                  <input
                    type="text"
                    value={stay.stayDetails?.roomType || ""}
                    onChange={(e) =>
                      onUpdateStay(idx, "stayDetails.roomType", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      getError(idx, "stayDetails.roomType")
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="e.g., Deluxe"
                  />
                  {getError(idx, "stayDetails.roomType") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "stayDetails.roomType")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    value={stay.stayDetails?.checkInTime || ""}
                    onChange={(e) =>
                      onUpdateStay(
                        idx,
                        "stayDetails.checkInTime",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    value={stay.stayDetails?.checkOutTime || ""}
                    onChange={(e) =>
                      onUpdateStay(
                        idx,
                        "stayDetails.checkOutTime",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline transition"
                  onClick={() => onRemoveStay(idx)}
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
