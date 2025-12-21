import React from "react";
import { CalendarIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function TourTypeSelector({ isPublic, onChange, error }) {
  return (
    <div className="mb-6">
      <label className="block mb-3 text-sm font-semibold text-gray-800">
        Tour Type <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label
          className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 min-h-[110px] hover:shadow-md ${
            isPublic
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:bg-white"
          }`}
        >
          <input
            type="radio"
            name="tourType"
            checked={isPublic}
            onChange={() => onChange(true)}
            className="sr-only"
          />
          <div className="text-center">
            <CalendarIcon className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold text-sm">Public Tour</div>
            <div className="text-xs mt-1 opacity-80">Fixed schedule</div>
          </div>
        </label>

        <label
          className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 min-h-[110px] hover:shadow-md ${
            !isPublic
              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300 hover:bg-white"
          }`}
        >
          <input
            type="radio"
            name="tourType"
            checked={!isPublic}
            onChange={() => onChange(false)}
            className="sr-only"
          />
          <div className="text-center">
            <SparklesIcon className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold text-sm">Private Tour</div>
            <div className="text-xs mt-1 opacity-80">Customizable</div>
          </div>
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
