import React, { useState } from "react";
import { Plus, Repeat, X } from "lucide-react";

/**
 * ScheduleForm Component
 * Form for creating single or recurring schedules
 */
const ScheduleForm = ({ packageData, onSubmit, onCancel }) => {
  const [mode, setMode] = useState("single"); // 'single' or 'recurring'
  const [schedules, setSchedules] = useState([
    {
      departureDate: "",
      seatsTotal: packageData?.maxGroupSize || 10,
      priceOverride: null,
    },
  ]);

  const [recurrence, setRecurrence] = useState({
    startDate: "",
    frequency: "WEEKLY",
    count: 5,
    until: "",
    seatsTotal: packageData?.maxGroupSize || 10,
    priceOverride: null,
  });

  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      {
        departureDate: "",
        seatsTotal: packageData?.maxGroupSize || 10,
        priceOverride: null,
      },
    ]);
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleRecurrenceChange = (field, value) => {
    setRecurrence({ ...recurrence, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "single") {
      const validSchedules = schedules.filter((s) => s.departureDate);
      if (validSchedules.length === 0) {
        alert("Please add at least one departure date");
        return;
      }
      onSubmit({ schedules: validSchedules, snapshotItinerary: true });
    } else {
      if (!recurrence.startDate) {
        alert("Please select a start date");
        return;
      }
      onSubmit({ recurrence });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create Departure Schedules
      </h2>

      {/* Mode Selection */}
      <div className="mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            type="button"
            className={`pb-3 px-4 font-medium transition-colors relative ${
              mode === "single"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setMode("single")}
          >
            Single Dates
          </button>
          <button
            type="button"
            className={`pb-3 px-4 font-medium transition-colors relative ${
              mode === "recurring"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setMode("recurring")}
          >
            <Repeat className="inline w-4 h-4 mr-1" />
            Recurring
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "single" ? (
          <div className="space-y-4">
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    value={schedule.departureDate}
                    onChange={(e) =>
                      handleScheduleChange(
                        index,
                        "departureDate",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seats
                  </label>
                  <input
                    type="number"
                    value={schedule.seatsTotal}
                    onChange={(e) =>
                      handleScheduleChange(
                        index,
                        "seatsTotal",
                        parseInt(e.target.value)
                      )
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="w-40">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Override
                  </label>
                  <input
                    type="number"
                    value={schedule.priceOverride || ""}
                    onChange={(e) =>
                      handleScheduleChange(
                        index,
                        "priceOverride",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSchedule(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddSchedule}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Another Date
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={recurrence.startDate}
                  onChange={(e) =>
                    handleRecurrenceChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <select
                  value={recurrence.frequency}
                  onChange={(e) =>
                    handleRecurrenceChange("frequency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="BIWEEKLY">Bi-Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Occurrences *
                </label>
                <input
                  type="number"
                  value={recurrence.count}
                  onChange={(e) =>
                    handleRecurrenceChange("count", parseInt(e.target.value))
                  }
                  min="1"
                  max="52"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or Until Date
                </label>
                <input
                  type="date"
                  value={recurrence.until}
                  onChange={(e) =>
                    handleRecurrenceChange("until", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats per Departure *
                </label>
                <input
                  type="number"
                  value={recurrence.seatsTotal}
                  onChange={(e) =>
                    handleRecurrenceChange(
                      "seatsTotal",
                      parseInt(e.target.value)
                    )
                  }
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Override
                </label>
                <input
                  type="number"
                  value={recurrence.priceOverride || ""}
                  onChange={(e) =>
                    handleRecurrenceChange(
                      "priceOverride",
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                  }
                  placeholder="Optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                This will create <strong>{recurrence.count}</strong> departures,{" "}
                <strong>{recurrence.frequency.toLowerCase()}</strong> starting
                from <strong>{recurrence.startDate || "[select date]"}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create Schedules
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
