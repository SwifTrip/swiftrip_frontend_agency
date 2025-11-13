import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../layouts/DashboardLayout';
import BasicInfoStep from '../../components/package/BasicInfoStep';
import ItineraryStep from '../../components/package/ItineraryStep';
import MediaUploadStep from '../../components/package/MediaUploadStep';
import ReviewStep from '../../components/package/ReviewStep';
import { createPackage } from '../../store/slices/packageSlice';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: '📄', component: BasicInfoStep },
  { id: 2, title: 'Itinerary Builder', icon: '📅', component: ItineraryStep },
  { id: 3, title: 'Media Upload', icon: '📸', component: MediaUploadStep },
  { id: 4, title: 'Review & Publish', icon: '✓', component: ReviewStep },
];

export default function CreatePackagePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get user from Redux store
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    companyId: 1, // will be updated in useEffect
    title: '',
    description: '' || 'THis is the description',
    category: 'ADVENTURE',
    basePrice: 0,
    currency: 'PKR',
    maxGroupSize: 10,
    status: 'DRAFT',
    includes: {},
    itineraries: [],
    media: [],
  });

  // Set companyId when user is available
  useEffect(() => {
    if (user?.companyId) {
      setFormData((prev) => ({ ...prev, companyId: user.companyId }));
    }
  }, [user]);

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All progress will be lost.')) {
      navigate('/app/packages');
    }
  };

  const handleSubmit = async (publishNow = false) => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        status: publishNow ? 'ACTIVE' : 'DRAFT',
      };

      await dispatch(createPackage(payload)).unwrap();

      alert(publishNow ? 'Published!' : 'Saved as draft!');
      navigate('/app/packages');
    } catch (err) {
      alert('Error: ' + (err.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create New Package</h2>
            <p className="text-gray-600 mt-1">Step {currentStep} of {STEPS.length}</p>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? 'Check' : step.icon}
                </div>
                <p
                  className={`mt-2 text-sm font-medium transition-colors ${
                    currentStep >= step.id ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </p>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-1 mx-4 relative" style={{ maxWidth: '150px' }}>
                  <div className="absolute inset-0 bg-gray-200 rounded"></div>
                  <div
                    className={`absolute inset-0 rounded transition-all duration-500 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                    style={{
                      width: currentStep > step.id ? '100%' : '0%',
                    }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
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
    </DashboardLayout>
  );
}