import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackageById } from '../../api/packageService.js';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';

export default function PackageDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedDay, setExpandedDay] = useState(1);

  useEffect(() => {
    if (id) {
      fetchPackageDetails();
    }
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getPackageById(id);
      
      if (result.success) {
        setPackageData(result.data);
      } else {
        setError('Failed to load package details');
      }
    } catch (error) {
      console.error('Error fetching package:', error);
      setError(error.message || 'Failed to load package details');
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (type) => {
    switch(type) {
      case 'MEAL': return '🍽️';
      case 'TRANSPORT': return '🚗';
      case 'STAY': return '🏨';
      case 'ACTIVITY':
      default: return '🎯';
    }
  };

  const getTimeOfDayConfig = (timeOfDay) => {
    const configs = {
      'Morning': { bg: 'bg-orange-50', badge: 'bg-orange-500', number: '2', label: 'Morning' },
      'Afternoon': { bg: 'bg-yellow-50', badge: 'bg-yellow-500', number: '3', label: 'Afternoon' },
      'Evening': { bg: 'bg-purple-50', badge: 'bg-purple-500', number: '4', label: 'Evening' }
    };
    return configs[timeOfDay] || configs['Morning'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading package details...</div>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-lg text-gray-900 font-semibold mb-2">Package not found</div>
          <div className="text-sm text-gray-600 mb-4">{error || 'The package you are looking for does not exist'}</div>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = packageData.media?.map(m => m.url) || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Package Details</h1>
                <p className="text-xs text-gray-500">Complete package information and itinerary</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Share">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="More options">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <button 
                onClick={() => navigate(`/packages/edit/${id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Main Large Image */}
            <div className="col-span-2 relative rounded-2xl overflow-hidden h-80 bg-gray-200">
              {images.length > 0 ? (
                <>
                  <img 
                    src={images[currentImageIndex]} 
                    alt={`${packageData.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {hasMultipleImages && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition-colors"
                        aria-label="Previous image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition-colors"
                        aria-label="Next image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No images available</p>
                  </div>
                </div>
              )}
              
              {/* Package Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{packageData.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">{packageData.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{packageData.itineraries?.length || 0} Days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Column */}
            <div className="space-y-3">
              {images.length > 1 ? (
                images.slice(1, 3).map((img, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-xl overflow-hidden h-38 cursor-pointer bg-gray-200 hover:opacity-90 transition-opacity" 
                    onClick={() => setCurrentImageIndex(idx + 1)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <>
                  <div className="rounded-xl overflow-hidden h-38 bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="rounded-xl overflow-hidden h-38 bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Three Info Cards */}
              <div className="grid grid-cols-3 gap-4">
                {/* Pricing Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold">Pricing</span>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs opacity-80 mb-1">per person</div>
                    <div className="text-3xl font-bold">{packageData.currency} {packageData.basePrice.toLocaleString()}</div>
                  </div>
                  <div className="pt-3 border-t border-white/20 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-80">Total Revenue</span>
                      <span className="font-semibold">{packageData.currency} {(packageData.basePrice * 10).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Bookings</span>
                      <span className="font-semibold">24</span>
                    </div>
                  </div>
                </div>

                {/* Group Details Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">Group Details</span>
                  </div>
                  <div className="text-center mb-3">
                    <div className="text-4xl font-bold text-gray-900">{packageData.maxGroupSize}</div>
                    <div className="text-xs text-gray-500">People</div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Small group experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Expert local guide</span>
                    </div>
                  </div>
                </div>

                {/* Package Type Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">Package Type</span>
                  </div>
                  <div className="flex items-center justify-center py-3">
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm">
                      {packageData.category}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created</span>
                      <span className="font-medium text-gray-900">
                        {new Date(packageData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package ID</span>
                      <span className="font-medium text-gray-900">#{packageData.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{packageData.description}</p>
              </div>

              {/* Tour Highlights */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Tour Highlights</h3>
                </div>
                <div className="space-y-3">
                  {packageData.itineraries && packageData.itineraries.length > 0 ? (
                    packageData.itineraries.slice(0, 4).map((itinerary, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{itinerary.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No highlights available</p>
                  )}
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { icon: '🍽️', label: 'Meals', color: 'bg-green-100' },
                    { icon: '🚐', label: 'Transport', color: 'bg-blue-100' },
                    { icon: '🏨', label: 'Accommodation', color: 'bg-purple-100' },
                    { icon: '🎯', label: 'Activities', color: 'bg-orange-100' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-3xl mb-2 shadow-sm`}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Itinerary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Detailed Itinerary</h3>
                </div>
                <p className="text-sm text-gray-500 mb-6">Day-by-day breakdown of your adventure</p>

                {packageData.itineraries && packageData.itineraries.length > 0 ? (
                  <div className="space-y-3">
                    {packageData.itineraries.map((itinerary, idx) => (
                      <div key={itinerary.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedDay(expandedDay === itinerary.dayNumber ? null : itinerary.dayNumber)}
                          className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                              {itinerary.dayNumber}
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900">Day {itinerary.dayNumber}</h4>
                              <p className="text-sm text-gray-600">{itinerary.title}</p>
                            </div>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedDay === itinerary.dayNumber ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedDay === itinerary.dayNumber && (
                          <div className="p-4 bg-white">
                            {itinerary.itineraryItems && itinerary.itineraryItems.length > 0 ? (
                              <div className="space-y-3">
                                {itinerary.itineraryItems.map((item) => (
                                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="text-2xl flex-shrink-0">{getItemIcon(item.type)}</div>
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex-1">
                                            <h5 className="font-semibold text-gray-900 mb-1">{item.name}</h5>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                          </div>
                                          {!item.optional && (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded ml-3 flex-shrink-0">
                                              Included
                                            </span>
                                          )}
                                          {item.optional && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded ml-3 flex-shrink-0">
                                              Optional
                                            </span>
                                          )}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                                          <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{item.duration} min</span>
                                          </div>
                                          {item.location && (
                                            <div className="flex items-center gap-1">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                              </svg>
                                              <span>{item.location}</span>
                                            </div>
                                          )}
                                          {item.price > 0 && (
                                            <div className="flex items-center gap-1">
                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                              </svg>
                                              <span>{packageData.currency} {item.price}</span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Type-specific details */}
                                        {item.type === 'MEAL' && item.mealDetails && (
                                          <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                            <div className="flex items-center gap-3 text-sm">
                                              <span className="font-semibold text-orange-900">
                                                {item.mealDetails.mealType}
                                              </span>
                                              <span className="text-orange-700">
                                                {item.mealDetails.cuisine}
                                              </span>
                                            </div>
                                          </div>
                                        )}

                                        {item.type === 'TRANSPORT' && item.transportDetails && (
                                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="text-sm space-y-1">
                                              <div className="font-semibold text-blue-900">
                                                {item.transportDetails.vehicleType}
                                              </div>
                                              <div className="text-blue-700">
                                                {item.transportDetails.startLocation} → {item.transportDetails.endLocation}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {item.type === 'STAY' && item.stayDetails && (
                                          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                            <div className="text-sm space-y-1">
                                              <div className="font-semibold text-purple-900">
                                                {item.stayDetails.hotelName}
                                              </div>
                                              <div className="text-purple-700">
                                                {item.stayDetails.roomType} • {item.stayDetails.rating}★
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-sm">No activities planned for this day</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium mb-1">No itinerary available</p>
                    <p className="text-xs">This package doesn't have a detailed itinerary yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Package Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Days</span>
                    <span className="text-xl font-bold text-blue-600">{packageData.itineraries?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Activities</span>
                    <span className="text-xl font-bold text-green-600">
                      {packageData.itineraries?.reduce((acc, day) => 
                        acc + (day.itineraryItems?.length || 0), 0
                      ) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      packageData.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      packageData.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {packageData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="text-xl font-bold text-purple-600">1,234</span>
                  </div>
                </div>
              </div>

              {/* Route Card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Route Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Starting Point</div>
                      <div className="text-sm font-semibold text-gray-900">{packageData.fromLocation}</div>
                    </div>
                  </div>
                  <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-8"></div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Destination</div>
                      <div className="text-sm font-semibold text-gray-900">{packageData.toLocation}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {/* <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200 shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Duplicate Package
                  </button>
                  <button 
                    onClick={() => navigate(`/packages/edit/${id}`)}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Package
                  </button>
                  <button className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Now
                  </button>
                  <button className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archive Package
                  </button>
                </div>
              </div> */}

              {/* Package Info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Package Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Created On</span>
                    <span className="font-medium text-gray-900">
                      {new Date(packageData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium text-gray-900">
                      {new Date(packageData.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Package ID</span>
                    <span className="font-medium text-gray-900">#{packageData.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium text-gray-900">{packageData.currency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Group Size</span>
                    <span className="font-medium text-gray-900">{packageData.maxGroupSize} people</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}