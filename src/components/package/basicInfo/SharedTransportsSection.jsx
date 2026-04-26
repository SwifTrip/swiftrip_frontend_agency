import React from "react";
import { TruckIcon } from "@heroicons/react/24/outline";

export default function SharedTransportsSection({
  tourTransports,
  onAddTransport,
  onUpdateTransport,
  onRemoveTransport,
  errors = {},
}) {
  const getError = (idx, field) =>
    errors[`tourTransports.${idx}.${field}`] || "";

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <TruckIcon className="w-5 h-5" />
          Shared Transport Registry (optional)
        </label>
        <button
          type="button"
          className="text-sm text-orange-700 hover:text-orange-800 font-semibold hover:underline transition-colors"
          onClick={onAddTransport}
        >
          + Add Vehicle
        </button>
      </div>
      {(tourTransports || []).length > 0 && (
        <div className="space-y-3 bg-slate-50/70 p-3 rounded-lg border border-slate-200">
          {(tourTransports || []).map((transport, idx) => (
            <div
              key={idx}
              className="p-4 border border-slate-200 rounded-lg bg-white hover:shadow-md hover:border-orange-300/70 transition"
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
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition ${
                      getError(idx, "vehicleType")
                        ? "border-red-400 bg-red-50"
                        : "border-slate-300"
                    }`}
                  />
                  {getError(idx, "vehicleType") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "vehicleType")}
                    </p>
                  )}
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
                        Number(e.target.value || 0),
                      )
                    }
                    placeholder="e.g., 50"
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition ${
                      getError(idx, "capacity")
                        ? "border-red-400 bg-red-50"
                        : "border-slate-300"
                    }`}
                  />
                  {getError(idx, "capacity") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "capacity")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Vehicle Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={transport.vehicleCount ?? 1}
                    onChange={(e) =>
                      onUpdateTransport(
                        idx,
                        "vehicleCount",
                        Number(e.target.value || 0),
                      )
                    }
                    placeholder="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition"
                  />
                  {getError(idx, "vehicleCount") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "vehicleCount")}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Start Location (optional)
                  </label>
                  <input
                    type="text"
                    value={transport.startLocation || ""}
                    onChange={(e) =>
                      onUpdateTransport(idx, "startLocation", e.target.value)
                    }
                    placeholder="Defaults to package From location"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    End Location (optional)
                  </label>
                  <input
                    type="text"
                    value={transport.endLocation || ""}
                    onChange={(e) =>
                      onUpdateTransport(idx, "endLocation", e.target.value)
                    }
                    placeholder="Defaults to package To location"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Estimated Duration (minutes, optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={transport.estimatedDuration ?? ""}
                    onChange={(e) =>
                      onUpdateTransport(
                        idx,
                        "estimatedDuration",
                        Number(e.target.value || 0),
                      )
                    }
                    placeholder="e.g., 120"
                    className={`w-full px-3 py-2 border rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition ${
                      getError(idx, "estimatedDuration")
                        ? "border-red-400 bg-red-50"
                        : "border-slate-300"
                    }`}
                  />
                  {getError(idx, "estimatedDuration") && (
                    <p className="mt-1 text-xs text-red-600">
                      {getError(idx, "estimatedDuration")}
                    </p>
                  )}
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
