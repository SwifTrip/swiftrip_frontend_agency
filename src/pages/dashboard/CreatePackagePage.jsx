// src/pages/CreatePackagePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import BasicInfoStep from "../../components/package/BasicInfoStep";
import ItineraryStep from "../../components/package/ItineraryStep";
import MediaUploadStep from "../../components/package/MediaUploadStep";
import ReviewStep from "../../components/package/ReviewStep";
import { createPackage } from "../../store/slices/packageSlice";

// Heroicons
import {
  DocumentTextIcon,
  CalendarIcon,
  CameraIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

const STEPS = [
  {
    id: 1,
    title: "Basic Info",
    icon: DocumentTextIcon,
    component: BasicInfoStep,
  },
  {
    id: 2,
    title: "Itinerary Builder",
    icon: CalendarIcon,
    component: ItineraryStep,
  },
  {
    id: 3,
    title: "Media Upload",
    icon: CameraIcon,
    component: MediaUploadStep,
  },
  {
    id: 4,
    title: "Review & Publish",
    icon: CheckCircleIcon,
    component: ReviewStep,
  },
];

const resolveStepFromFieldPath = (fieldPath = "") => {
  const field = String(fieldPath);
  if (field.startsWith("tourStays") || field.startsWith("tourTransports")) {
    return "Basic Info";
  }
  if (field.startsWith("itineraries")) {
    return "Itinerary Builder";
  }
  if (field.startsWith("media")) {
    return "Media Upload";
  }
  return "Basic Info";
};

const prettifyFieldPath = (fieldPath = "") => {
  if (!fieldPath) return "Form";

  const labelMap = {
    companyId: "Company",
    title: "Title",
    description: "Description",
    category: "Category",
    fromLocation: "From Location",
    toLocation: "To Location",
    basePrice: "Base Price",
    currency: "Currency",
    maxGroupSize: "Max Group Size",
    minGroupSize: "Min Group Size",
    departureDate: "Departure Date",
    arrivalDate: "Arrival Date",
    bookingDeadline: "Booking Deadline",
    itineraries: "Itinerary",
    dayNumber: "Day Number",
    dayStartTime: "Day Start Time",
    dayEndTime: "Day End Time",
    itineraryItems: "Itinerary Item",
    dayTransports: "Day Transport",
    transportDetails: "Transport Details",
    startLocation: "Start Location",
    endLocation: "End Location",
    vehicleType: "Vehicle Type",
    estimatedDuration: "Estimated Duration",
    capacity: "Capacity",
    tourStays: "Tour Stays",
    tourTransports: "Shared Transports",
    media: "Media",
  };

  const parts = String(fieldPath).split(".");
  const transformed = parts
    .map((part) => {
      if (/^\d+$/.test(part)) return `#${Number(part) + 1}`;
      return labelMap[part] || part.replace(/([A-Z])/g, " $1").trim();
    })
    .join(" > ");

  return transformed;
};

export default function CreatePackagePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    companyId: null,
    fromLocation: "",
    toLocation: "",
    title: "",
    description: "",
    category: "ADVENTURE",
    basePrice: 0,
    currency: "PKR",
    // Group tour fields
    maxGroupSize: 10,
    minGroupSize: undefined,
    isPublic: true,
    departureDate: undefined,
    arrivalDate: undefined,
    bookingDeadline: undefined, // ISO string
    status: "ACTIVE",
    includes: {},
    // Shared stays across days
    tourStays: [],
    // Itineraries with day-level timing and transports
    itineraries: [],
    media: [],
  });

  // Set companyId from logged-in user
  useEffect(() => {
    if (user?.companyId) {
      setFormData((prev) => ({ ...prev, companyId: user.companyId }));
    }
  }, [user]);

  // Safe update: preserve arrays & nested objects
  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      includes: { ...prev.includes, ...(data.includes || {}) },
      // arrays: keep previous if not provided
      itineraries:
        data.itineraries !== undefined ? data.itineraries : prev.itineraries,
      tourStays: data.tourStays !== undefined ? data.tourStays : prev.tourStays,
      media: data.media !== undefined ? data.media : prev.media,
    }));
  };

  const nextStep = () => {
    setSubmitError("");
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setSubmitError("");
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    toast.info("Creation cancelled. Returning to packages...");
    navigate("/app/packages");
  };

  const handleSubmit = async (publishNow = false) => {
    setSubmitError("");

    // Final validation
    if (!formData.fromLocation || !formData.toLocation) {
      setSubmitError("From and To locations are required.");
      return;
    }
    if (
      formData.fromLocation &&
      formData.toLocation &&
      formData.fromLocation === formData.toLocation
    ) {
      setSubmitError("From and To locations cannot be the same.");
      return;
    }
    if (formData.isPublic) {
      if (!formData.departureDate || !formData.arrivalDate) {
        setSubmitError(
          "Departure and Arrival dates are required for public tours.",
        );
        return;
      }
      const dep = new Date(formData.departureDate);
      const arr = new Date(formData.arrivalDate);
      if (!(dep < arr)) {
        setSubmitError("Arrival date must be after departure date.");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        status: publishNow ? "ACTIVE" : "DRAFT",
      };

      await dispatch(createPackage(payload)).unwrap();
      toast.success(publishNow ? "Package published!" : "Saved as draft.");
      navigate("/app/packages");
    } catch (err) {
      console.error("Create package error:", err);

      const fieldErrors = Array.isArray(err?.fieldErrors)
        ? err.fieldErrors
        : [];
      const message = err?.message
        ? String(err.message)
        : "Error creating package";

      if (fieldErrors.length > 0) {
        const firstStep = resolveStepFromFieldPath(fieldErrors[0]?.field);
        const friendly = fieldErrors
          .slice(0, 5)
          .map((item) => `${prettifyFieldPath(item.field)}: ${item.message}`)
          .join(" | ");
        setSubmitError(friendly);
        toast.error(`${message} Check ${firstStep}.`);
      } else {
        setSubmitError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 tracking-[0.01em]">
              Create Package Workflow
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white/95 rounded-xl p-5 mb-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCompleted ? "bg-emerald-500 text-white" : ""}
                      ${isActive ? "bg-orange-600 text-white scale-105" : ""}
                      ${
                        !isCompleted && !isActive
                          ? "bg-slate-200 text-slate-400"
                          : ""
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircleSolid className="w-8 h-8" />
                    ) : (
                      <Icon className="w-7 h-7" />
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-1 mx-4 relative"
                    style={{ maxWidth: "150px" }}
                  >
                    <div className="absolute inset-0 bg-slate-200 rounded-full"></div>
                    <div
                      className={`absolute inset-0 bg-emerald-500 rounded-full transition-all duration-500 ease-in-out`}
                      style={{
                        width: currentStep > step.id ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {submitError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          isLastStep={currentStep === STEPS.length}
          loading={loading}
        />
      </div>
    </>
  );
}
