import React, { useState } from "react";
import Select from "react-select";
import pakistanLocations from "../../data/pakistanLocations.json";
import TourTypeSelector from "./basicInfo/TourTypeSelector";
import PublicTourFields from "./basicInfo/PublicTourFields";
import IncludesSection from "./basicInfo/IncludesSection";
import SharedStaysSection from "./basicInfo/SharedStaysSection";
import SharedTransportsSection from "./basicInfo/SharedTransportsSection";
import PDFUploadModal from "./PDFUploadModal";
import {
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const CATEGORIES = [
  "ADVENTURE",
  "FAMILY",
  "ROMANTIC",
  "CULTURAL",
  "RELIGIOUS",
  "OTHER",
];
const STATUSES = ["DRAFT", "ACTIVE", "INACTIVE"];
const CURRENCIES = ["PKR", "USD", "EUR", "GBP"];

export default function BasicInfoStep({ formData, updateFormData, onNext }) {
  const [errors, setErrors] = useState({});
  const [showPDFModal, setShowPDFModal] = useState(false);

  // ----- REQUIRED FIELDS -----
  const getRequiredFields = () => {
    const baseRequired = [
      "title",
      "category",
      "basePrice",
      "fromLocation",
      "toLocation",
      "description",
    ];

    // Add public tour specific fields
    if (formData.isPublic) {
      return [...baseRequired, "maxGroupSize", "arrivalDate", "departureDate"];
    }

    return baseRequired;
  };

  // ----- VALIDATION -----
  const validateField = (name, value) => {
    const required = getRequiredFields();

    if (required.includes(name) && !value?.toString().trim()) {
      const label =
        name === "fromLocation"
          ? "From Location"
          : name === "toLocation"
          ? "To Location"
          : name === "basePrice"
          ? "Base Price"
          : name === "maxGroupSize"
          ? "Max Group Size"
          : name === "arrivalDate"
          ? "Arrival Date"
          : name === "departureDate"
          ? "Departure Date"
          : name === "description"
          ? "Description"
          : name.charAt(0).toUpperCase() +
            name.slice(1).replace(/([A-Z])/g, " $1");
      return `${label} is required`;
    }
    if (name === "basePrice" && value <= 0)
      return "Base price must be greater than 0";
    if (name === "maxGroupSize" && value <= 0)
      return "Max group size must be greater than 0";

    // Date validations for public tours (departure before arrival; arrival strictly after)
    if (formData.isPublic) {
      if (name === "departureDate" && formData.arrivalDate && value) {
        if (new Date(value) >= new Date(formData.arrivalDate)) {
          return "Departure date must be before arrival date";
        }
      }
      if (name === "arrivalDate" && formData.departureDate && value) {
        if (new Date(value) <= new Date(formData.departureDate)) {
          return "Arrival date must be after departure date";
        }
      }
    }

    return "";
  };

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });

    // Regular field validation
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));

    // Extra check: From & To cannot be same
    if (field === "fromLocation" || field === "toLocation") {
      const newFromLocation =
        field === "fromLocation" ? value : formData.fromLocation;
      const newToLocation =
        field === "toLocation" ? value : formData.toLocation;

      if (
        newFromLocation &&
        newToLocation &&
        newFromLocation === newToLocation
      ) {
        setErrors((prev) => ({
          ...prev,
          fromLocation: "From and To location cannot be the same",
          toLocation: "From and To location cannot be the same",
        }));
      } else {
        // Clear the location duplicate errors if locations are now different
        setErrors((prev) => ({
          ...prev,
          fromLocation:
            prev.fromLocation === "From and To location cannot be the same"
              ? ""
              : prev.fromLocation,
          toLocation:
            prev.toLocation === "From and To location cannot be the same"
              ? ""
              : prev.toLocation,
        }));
      }
    }

    // Revalidate dates if changing either date field
    if (field === "arrivalDate" && formData.departureDate) {
      const depErr = validateField("departureDate", formData.departureDate);
      setErrors((prev) => ({ ...prev, departureDate: depErr }));

      // Auto-calculate duration for public tours
      if (formData.isPublic && value && formData.departureDate) {
        const depDate = new Date(formData.departureDate);
        const arrDate = new Date(value);
        const durationDays = Math.ceil(
          (arrDate - depDate) / (1000 * 60 * 60 * 24)
        );
        if (durationDays > 0) {
          updateFormData({ duration: durationDays });
        }
      }
    }
    if (field === "departureDate" && formData.arrivalDate) {
      const arrErr = validateField("arrivalDate", formData.arrivalDate);
      setErrors((prev) => ({ ...prev, arrivalDate: arrErr }));

      // Auto-calculate duration for public tours
      if (formData.isPublic && value && formData.arrivalDate) {
        const depDate = new Date(value);
        const arrDate = new Date(formData.arrivalDate);
        const durationDays = Math.ceil(
          (arrDate - depDate) / (1000 * 60 * 60 * 24)
        );
        if (durationDays > 0) {
          updateFormData({ duration: durationDays });
        }
      }
    }
  };

  const handleBlur = (field) => {
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAll = () => {
    const required = getRequiredFields();
    const newErr = {};
    required.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErr[f] = err;
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) onNext();
  };

  // ----- TOUR TYPE HANDLER -----
  const handleTourTypeChange = (isPublic) => {
    // Clear public-specific fields when switching to private
    if (!isPublic) {
      updateFormData({
        isPublic: false,
        maxGroupSize: undefined,
        arrivalDate: undefined,
        departureDate: undefined,
      });
      // Clear related errors
      setErrors((prev) => {
        const { maxGroupSize, arrivalDate, departureDate, ...rest } = prev;
        return rest;
      });
    } else {
      updateFormData({ isPublic: true });
    }
  };

  // ----- SELECT STYLES -----
  const selectBase = `
    w-full px-3 py-2 pr-8 bg-white border rounded-md
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    appearance-none cursor-pointer text-sm
  `;

  // ----- SHARED STAYS HANDLERS -----
  const handleAddStay = () => {
    const next = [
      ...(formData.tourStays || []),
      {
        stayType: "HOTEL",
        hotelName: "",
        rating: 4,
        checkInDay: 1,
        checkOutDay: 1,
        rooms: 1,
        bedsPerRoom: 2,
        stayDetails: { roomType: "", checkInTime: "", checkOutTime: "" },
      },
    ];
    updateFormData({ tourStays: next });
  };

  const handleUpdateStay = (idx, field, value) => {
    const next = [...(formData.tourStays || [])];
    const target = { ...(next[idx] || {}) };
    if (field.startsWith("stayDetails.")) {
      const key = field.split(".")[1];
      target.stayDetails = { ...(target.stayDetails || {}), [key]: value };
    } else {
      target[field] = value;
    }
    next[idx] = target;
    updateFormData({ tourStays: next });
  };

  const handleRemoveStay = (idx) => {
    const next = (formData.tourStays || []).filter((_, i) => i !== idx);
    updateFormData({ tourStays: next });
  };

  // ----- SHARED TRANSPORTS HANDLERS -----
  const handleAddTransport = () => {
    const next = [
      ...(formData.tourTransports || []),
      {
        vehicleType: "",
        capacity: undefined,
      },
    ];
    updateFormData({ tourTransports: next });
  };

  const handleUpdateTransport = (idx, field, value) => {
    const next = [...(formData.tourTransports || [])];
    const target = { ...(next[idx] || {}) };
    target[field] = value;
    next[idx] = target;
    updateFormData({ tourTransports: next });
  };

  const handleRemoveTransport = (idx) => {
    const next = (formData.tourTransports || []).filter((_, i) => i !== idx);
    updateFormData({ tourTransports: next });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 bg-white rounded-lg shadow-sm w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">
          Basic Package Information
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Provide essential details about your tour package
        </p>

        {/* PDF Upload Button */}
        <button
          type="button"
          onClick={() => setShowPDFModal(true)}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition border border-blue-200 font-medium"
        >
          <DocumentArrowUpIcon className="w-5 h-5" />
           Generate from PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-5">
          {/* TOUR TYPE SELECTOR */}
          <TourTypeSelector
            isPublic={formData.isPublic ?? true}
            onChange={handleTourTypeChange}
            error={errors.isPublic}
          />

          {/* From / To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                From Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Select
                  options={pakistanLocations.map((loc) => ({
                    label: loc,
                    value: loc,
                  }))}
                  value={
                    formData.fromLocation
                      ? {
                          label: formData.fromLocation,
                          value: formData.fromLocation,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleChange("fromLocation", selected?.value || "")
                  }
                  onBlur={() => handleBlur("fromLocation")}
                  placeholder="Search & select starting point"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: "0.375rem 0rem",
                      paddingLeft: "1rem",
                      fontSize: "0.875rem",
                      backgroundColor: errors.fromLocation
                        ? "#fef2f2"
                        : "white",
                      borderColor: errors.fromLocation ? "#ef4444" : "#d1d5db",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#9ca3af",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                />
              </div>
              {errors.fromLocation && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.fromLocation}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                To Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Select
                  options={pakistanLocations.map((loc) => ({
                    label: loc,
                    value: loc,
                  }))}
                  value={
                    formData.toLocation
                      ? {
                          label: formData.toLocation,
                          value: formData.toLocation,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    handleChange("toLocation", selected?.value || "")
                  }
                  onBlur={() => handleBlur("toLocation")}
                  placeholder="Search & select destination"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: "0.375rem 0rem",
                      paddingLeft: "1.75rem",
                      fontSize: "0.875rem",
                      backgroundColor: errors.toLocation ? "#fef2f2" : "white",
                      borderColor: errors.toLocation ? "#ef4444" : "#d1d5db",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#9ca3af",
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                />
              </div>
              {errors.toLocation && (
                <p className="mt-1 text-xs text-red-600">{errors.toLocation}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              placeholder="e.g., Northern Pakistan Explorer"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400 ${
                errors.title
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                onBlur={() => handleBlur("category")}
                className={`
                  ${selectBase}
                  ${
                    errors.category
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }
                `}
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e")',
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "12px",
                }}
              >
                <option value="" disabled className="text-gray-400">
                  Select category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0) + c.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.basePrice ?? ""}
                onChange={(e) =>
                  handleChange(
                    "basePrice",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                onBlur={() => handleBlur("basePrice")}
                placeholder="5000"
                min="0"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400 ${
                  errors.basePrice
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {errors.basePrice && (
                <p className="mt-1 text-xs text-red-600">{errors.basePrice}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Currency
              </label>
              <div className="relative">
                <select
                  value={formData.currency || "PKR"}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className={`${selectBase} border-gray-300 bg-white`}
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e")',
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "12px",
                  }}
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Public Tour Fields (Conditional) */}
          {formData.isPublic && (
            <PublicTourFields
              maxGroupSize={formData.maxGroupSize}
              arrivalDate={formData.arrivalDate}
              departureDate={formData.departureDate}
              onMaxGroupSizeChange={(value) =>
                handleChange("maxGroupSize", value)
              }
              onArrivalDateChange={(value) =>
                handleChange("arrivalDate", value)
              }
              onDepartureDateChange={(value) =>
                handleChange("departureDate", value)
              }
              errors={errors}
              onBlur={handleBlur}
            />
          )}

          {/* Duration - Only for Public Tours, Auto-calculated */}
          {formData.isPublic && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Duration (Days)
              </label>
              <input
                type="number"
                value={formData.duration ?? ""}
                readOnly
                placeholder="Auto-calculated from dates"
                className="w-full px-3 py-2 text-sm border border-gray-300 bg-gray-50 rounded-lg cursor-not-allowed placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">
                Automatically calculated from departure and arrival dates
              </p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="relative">
              <select
                value={formData.status || "DRAFT"}
                onChange={(e) => handleChange("status", e.target.value)}
                className={`${selectBase} border-gray-300 bg-white`}
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e")',
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "12px",
                }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              placeholder="Describe your tour package..."
              rows={5}
              className={`mt-1 w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400 resize-none ${
                errors.description
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Includes Section */}
          <IncludesSection
            includes={formData.includes || {}}
            onToggle={(key, checked) => {
              const defaults = {
                meals: "3 meals per day",
                transportation: "Included",
                accommodation: "4‑star hotel",
                guide: "Professional tour guide",
                activities: "All activities",
                travelInsurance: "Basic coverage",
              };
              updateFormData({
                includes: {
                  ...formData.includes,
                  [key]: checked ? defaults[key] : "",
                },
              });
            }}
            onDetailChange={(key, value) => {
              updateFormData({
                includes: { ...formData.includes, [key]: value },
              });
            }}
          />

          {/* Shared Stays Section */}
          <SharedStaysSection
            tourStays={formData.tourStays || []}
            onAddStay={handleAddStay}
            onUpdateStay={handleUpdateStay}
            onRemoveStay={handleRemoveStay}
          />

          {/* Shared Transports Section */}
          <SharedTransportsSection
            tourTransports={formData.tourTransports || []}
            onAddTransport={handleAddTransport}
            onUpdateTransport={handleUpdateTransport}
            onRemoveTransport={handleRemoveTransport}
          />
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between items-center pt-6 mt-10 border-t border-gray-200">
        <button
          type="button"
          disabled
          className="px-6 py-3 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        >
          Next
        </button>
      </div>

      {/* PDF Upload Modal */}
      <PDFUploadModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        onExtract={(extractedData) => {
          console.log("📦 Auto-filling from extracted data:", extractedData);

          // Auto-fill basic info fields
          updateFormData({
            title: extractedData.title || formData.title,
            description: extractedData.description || formData.description,
            category: extractedData.category || formData.category,
            basePrice: extractedData.basePrice || formData.basePrice,
            currency: extractedData.currency || formData.currency,
            fromLocation: extractedData.fromLocation || formData.fromLocation,
            toLocation: extractedData.toLocation || formData.toLocation,
            maxGroupSize: extractedData.maxGroupSize || formData.maxGroupSize,
            minGroupSize: extractedData.minGroupSize || formData.minGroupSize,
            includes: {
              ...formData.includes,
              ...(extractedData.includes || {}),
            },
            itineraries: extractedData.itineraries || formData.itineraries,
            tourStays: extractedData.tourStays || formData.tourStays,
          });

          toast.success(
            "Package data auto-filled from PDF! Review and continue."
          );
        }}
      />
    </form>
  );
}
