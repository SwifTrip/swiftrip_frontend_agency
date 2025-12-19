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

export default function CreatePackagePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    companyId: null,
    fromLocation: "",
    toLocation: "",
    title: "",
    description: "This is the description",
    category: "ADVENTURE",
    basePrice: 0,
    currency: "PKR",
    // Group tour fields
    maxGroupSize: 10,
    minGroupSize: undefined,
    isPublic: true,
    bookingDeadline: undefined, // ISO string
    status: "DRAFT",
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
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    toast.info("Creation cancelled. Returning to packages...");
    navigate("/app/packages");
  };

  const handleSubmit = async (publishNow = false) => {
    console.log("FINAL PAYLOAD →", JSON.stringify(formData, null, 2));

    // Final validation
    if (!formData.fromLocation || !formData.toLocation) {
      toast.error("From and To locations are required!");
      return;
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
      toast.error(err?.message ? String(err.message) : "Error creating package");
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Package
            </h2>
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
                      ${isActive ? "bg-blue-600 text-white scale-110" : ""}
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
