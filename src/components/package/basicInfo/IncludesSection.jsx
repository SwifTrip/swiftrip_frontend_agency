import React from "react";
import {
  BuildingOfficeIcon,
  TruckIcon,
  HomeIcon,
  AcademicCapIcon,
  QueueListIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const INCLUDE_LABELS = {
  meals: "Meals",
  transportation: "Transportation",
  accommodation: "Accommodation",
  guide: "Guide",
  activities: "Activities",
  travelInsurance: "Travel Insurance",
};

const INCLUDE_ICONS = {
  meals: BuildingOfficeIcon, // Using BuildingOfficeIcon as generic meal/accommodation placeholder
  transportation: TruckIcon,
  accommodation: HomeIcon,
  guide: AcademicCapIcon,
  activities: QueueListIcon,
  travelInsurance: ShieldCheckIcon,
};

export default function IncludesSection({
  includes,
  onToggle,
  onDetailChange,
}) {
  return (
    <div className="mb-6">
      <label className="block mb-4 text-sm font-semibold text-gray-800">
        What's Included
      </label>
      <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
        {Object.keys(INCLUDE_LABELS).map((key) => (
          <div
            key={key}
            className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                id={`include-${key}`}
                checked={!!includes[key]}
                onChange={(e) => onToggle(key, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label
                htmlFor={`include-${key}`}
                className="flex items-center gap-2 cursor-pointer mb-2 hover:text-blue-600"
              >
                {(() => {
                  const Icon = INCLUDE_ICONS[key];
                  return <Icon className="w-5 h-5" />;
                })()}
                <span className="text-sm font-medium text-gray-700">
                  {INCLUDE_LABELS[key]}
                </span>
              </label>
              {includes[key] && (
                <input
                  type="text"
                  value={includes[key]}
                  onChange={(e) => onDetailChange(key, e.target.value)}
                  placeholder={`Describe ${INCLUDE_LABELS[
                    key
                  ].toLowerCase()}...`}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
