import React from "react";
import { TruckIcon } from "@heroicons/react/24/outline";

export default function SharedTransportsSection({
  tourTransports,
  onAddTransport,
  onUpdateTransport,
  onRemoveTransport,
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <TruckIcon className="w-5 h-5" />
          Shared Transports (optional)
        </label>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
          onClick={onAddTransport}
        >
          + Add Transport
        </button>
      </div>
      {(tourTransports || []).length > 0 && (
        <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
          {(tourTransports || []).map((transport, idx) => (
            <div
              key={idx}
              className="p-4 border border-gray-300 rounded-lg bg-white hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    value={transport.vehicleType || ""}
                    onChange={(e) =>
                      onUpdateTransport(idx, "vehicleType", e.target.value)
                    }
                    placeholder="e.g., Bus, Car, Van"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Capacity (persons)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={transport.capacity ?? ""}
                    onChange={(e) =>
                      onUpdateTransport(
                        idx,
                        "capacity",
                        Number(e.target.value || 0)
                      )
                    }
                    placeholder="e.g., 50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700 font-semibold hover:underline transition"
                  onClick={() => onRemoveTransport(idx)}
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
