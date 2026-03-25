// src/pages/EditPackagePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import BasicInfoStep from "../../components/package/BasicInfoStep";
import ItineraryStep from "../../components/package/ItineraryStep";
import MediaUploadStep from "../../components/package/MediaUploadStep";
import ReviewStep from "../../components/package/ReviewStep";
import { updatePackage as updatePackageAction } from "../../store/slices/packageSlice";
import { getPackageById } from "../../api/packageService";

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

export default function EditPackagePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    companyId: null,
    fromLocation: "",
    toLocation: "",
    title: "",
    description: "",
    category: "ADVENTURE",
    basePrice: 0,
    currency: "PKR",
    maxGroupSize: 10,
    minGroupSize: undefined,
    isPublic: true,
    departureDate: undefined,
    arrivalDate: undefined,
    bookingDeadline: undefined,
    status: "DRAFT",
    includes: {},
    tourStays: [],
    tourTransports: [],
    itineraries: [],
    media: [],
    keepMedia: [], // Track existing media URLs to keep
  });

  // Load existing package data
  useEffect(() => {
    const loadPackage = async () => {
      try {
        setInitialLoading(true);
        const payload = await getPackageById(id);
        const pkg = payload?.data ?? payload;

        // Map existing media to the format expected by MediaUploadStep
        const existingMedia = (pkg.media || []).map((m) => ({
          id: m.id,
          url: m.url,
          isExisting: true, // Mark as existing
        }));

        // Parse dates to YYYY-MM-DD format for date inputs
        const formatDateForInput = (dateString) => {
          if (!dateString) return undefined;
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        // Calculate timeOfDay from startTime for itinerary items
        const getTimeOfDay = (startTime) => {
          if (!startTime) return "Morning";
          const [hour] = startTime.split(":").map(Number);
          if (hour >= 5 && hour < 12) return "Morning";
          if (hour >= 12 && hour < 17) return "Afternoon";
          if (hour >= 17) return "Evening";
          return "Morning";
        };

        const normalizeDayTransport = (dayTransport) => {
          const detailsFromTransport = dayTransport?.transport
            ? {
                vehicleType: dayTransport.transport.vehicleType || "",
                startLocation: dayTransport.transport.startLocation || "",
                endLocation: dayTransport.transport.endLocation || "",
                estimatedDuration:
                  dayTransport.transport.estimatedDuration ?? undefined,
                capacity: dayTransport.transport.capacity ?? undefined,
                included:
                  dayTransport.transport.included !== undefined
                    ? dayTransport.transport.included
                    : true,
                isReusable:
                  dayTransport.transport.isReusable !== undefined
                    ? dayTransport.transport.isReusable
                    : false,
              }
            : {};

          return {
            ...dayTransport,
            transportDetails: {
              ...(dayTransport.transportDetails || {}),
              ...detailsFromTransport,
            },
          };
        };

        const normalizeItineraryItem = (item) => ({
          ...item,
          mealDetails:
            item?.mealDetails && Array.isArray(item.mealDetails)
              ? item.mealDetails[0] || null
              : item?.mealDetails || null,
          transportDetails:
            item?.transportDetails && Array.isArray(item.transportDetails)
              ? item.transportDetails[0] || null
              : item?.transportDetails || null,
        });

        // Process itineraries to add timeOfDay field to items
        const processedItineraries = (pkg.itineraries || []).map(
          (itinerary) => ({
            ...itinerary,
            dayTransports: (itinerary.dayTransports || []).map(
              normalizeDayTransport,
            ),
            itineraryItems: (itinerary.itineraryItems || []).map((item) => ({
              ...normalizeItineraryItem(item),
              timeOfDay: getTimeOfDay(item.startTime),
            })),
          }),
        );

        setFormData({
          companyId: pkg.companyId,
          fromLocation: pkg.fromLocation || "",
          toLocation: pkg.toLocation || "",
          title: pkg.title || "",
          description: pkg.description || "",
          category: pkg.category || "ADVENTURE",
          basePrice: pkg.basePrice || 0,
          currency: pkg.currency || "PKR",
          maxGroupSize: pkg.maxGroupSize || 10,
          minGroupSize: pkg.minGroupSize,
          isPublic: pkg.isPublic !== undefined ? pkg.isPublic : true,
          departureDate: formatDateForInput(pkg.departureDate),
          arrivalDate: formatDateForInput(pkg.arrivalDate),
          bookingDeadline: formatDateForInput(pkg.bookingDeadline),
          status: pkg.status || "DRAFT",
          includes: pkg.includes || {},
          tourStays: pkg.tourStays || [],
          tourTransports: pkg.tourTransports || [],
          itineraries: processedItineraries,
          media: existingMedia,
          keepMedia: existingMedia.map((m) => m.url), // Initially keep all
        });
      } catch (err) {
        console.error("Error loading package:", err);
        toast.error("Failed to load package data");
        navigate("/app/packages");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadPackage();
    }
  }, [id, navigate]);

  // Safe update: preserve arrays & nested objects
  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      includes: { ...prev.includes, ...(data.includes || {}) },
      itineraries:
        data.itineraries !== undefined ? data.itineraries : prev.itineraries,
      tourStays: data.tourStays !== undefined ? data.tourStays : prev.tourStays,
      tourTransports:
        data.tourTransports !== undefined
          ? data.tourTransports
          : prev.tourTransports,
      media: data.media !== undefined ? data.media : prev.media,
      keepMedia: data.keepMedia !== undefined ? data.keepMedia : prev.keepMedia,
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
    toast.info("Edit cancelled. Returning to packages...");
    navigate("/app/packages");
  };

  const handleSubmit = async (publishNow = false) => {
    setSubmitError("");

    const toNumeric = (value) => {
      if (value === undefined || value === null || value === "")
        return undefined;
      const n = Number(value);
      return Number.isNaN(n) ? undefined : n;
    };

    const normalizeItemForUpdate = (item, tourTransports = []) => {
      let normalizedTransportId = item.transportId;
      let normalizedTransportDetails = item.transportDetails || undefined;

      if (
        typeof normalizedTransportId === "string" &&
        normalizedTransportId.startsWith("shared-")
      ) {
        const sharedIndex = Number(
          normalizedTransportId.replace("shared-", ""),
        );
        const shared = tourTransports[sharedIndex];
        normalizedTransportId = toNumeric(shared?.id);
        if (!normalizedTransportDetails && shared) {
          normalizedTransportDetails = {
            vehicleType: shared.vehicleType,
            startLocation:
              shared.startLocation || item.location || formData.fromLocation,
            endLocation:
              shared.endLocation || item.location || formData.toLocation,
            estimatedDuration: shared.estimatedDuration,
            capacity: shared.capacity,
            included: shared.included !== undefined ? shared.included : true,
            isReusable: true,
          };
        }
      } else {
        normalizedTransportId = toNumeric(normalizedTransportId);
      }

      if (
        item.requiresTransport &&
        item.transportId === "custom" &&
        item.customTransport
      ) {
        normalizedTransportId = undefined;
        normalizedTransportDetails = {
          ...(normalizedTransportDetails || {}),
          ...item.customTransport,
        };
      }

      return {
        ...item,
        transportId: normalizedTransportId,
        mealDetails: item.mealDetails ? [item.mealDetails] : undefined,
        transportDetails: normalizedTransportDetails
          ? [normalizedTransportDetails]
          : undefined,
      };
    };

    const normalizeDayTransportForUpdate = (dt) => {
      return {
        ...dt,
        transportId: toNumeric(dt.transportId),
        transportDetails: dt.transportDetails
          ? {
              ...dt.transportDetails,
              estimatedDuration: toNumeric(
                dt.transportDetails.estimatedDuration,
              ),
              capacity: toNumeric(dt.transportDetails.capacity),
            }
          : dt.transportDetails,
      };
    };

    const normalizedPayload = {
      ...formData,
      status: publishNow ? "ACTIVE" : formData.status,
      itineraries: (formData.itineraries || []).map((itinerary) => ({
        ...itinerary,
        dayTransports: (itinerary.dayTransports || []).map(
          normalizeDayTransportForUpdate,
        ),
        itineraryItems: (itinerary.itineraryItems || []).map((item) =>
          normalizeItemForUpdate(item, formData.tourTransports || []),
        ),
      })),
    };

    console.log("UPDATE PAYLOAD →", JSON.stringify(normalizedPayload, null, 2));

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
      console.log(
        "🔵 EditPackagePage: Submitting update with payload:",
        normalizedPayload,
      );
      const result = await dispatch(
        updatePackageAction({ id, data: normalizedPayload }),
      ).unwrap();
      console.log("🟢 EditPackagePage: Update successful, result:", result);
      toast.success("Package updated successfully!");
      navigate("/app/packages");
    } catch (err) {
      console.error("🔴 EditPackagePage: Update package error:", err);
      console.error("🔴 Full error object:", err);
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        String(err) ||
        "Error updating package";
      console.error("🔴 Error message to show:", errorMessage);
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading package...</p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Package</h2>
            <p className="text-gray-600 mt-1">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
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
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
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
                      ${isCompleted ? "bg-green-500 text-white" : ""}
                      ${isActive ? "bg-orange-600 text-white scale-110" : ""}
                      ${
                        !isCompleted && !isActive
                          ? "bg-gray-200 text-gray-400"
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
                      currentStep >= step.id ? "text-gray-800" : "text-gray-400"
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
                    <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                    <div
                      className={`absolute inset-0 bg-green-500 rounded-full transition-all duration-500 ease-in-out`}
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

      {/* Step Content */}
      {submitError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          isLastStep={currentStep === STEPS.length}
          loading={loading}
          isEditMode={true} // Flag to indicate edit mode
        />
      </div>
    </>
  );
}
