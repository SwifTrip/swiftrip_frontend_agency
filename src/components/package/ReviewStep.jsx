import React from 'react';
import { toast } from 'react-toastify';

export default function ReviewStep({ formData, onPrev, onSubmit, loading }) {
  const handleDraftSave = (e) => {
    e.preventDefault();
    
    // Validation before saving as draft
    if (!formData.title || formData.title.trim() === '') {
      toast.error('Package title is required');
      return;
    }
    
    if (formData.itineraries.length === 0) {
      toast.error('Please add at least one day to the itinerary');
      return;
    }
    
    onSubmit(false); 
  };

  const handlePublish = (e) => {
    e.preventDefault();
    
    // Validation before publishing
    if (!formData.title || formData.title.trim() === '') {
      toast.error('Package title is required');
      return;
    }
    
    if (!formData.description || formData.description.trim() === '') {
      toast.error('Package description is required');
      return;
    }
    
    if (formData.itineraries.length === 0) {
      toast.error('Please add at least one day to the itinerary');
      return;
    }
    
    const hasItemsInAnyDay = formData.itineraries.some(day => day.itineraryItems.length > 0);
    if (!hasItemsInAnyDay) {
      toast.error('Please add at least one item to any day in the itinerary');
      return;
    }
    
    if (formData.media.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    onSubmit(true); 
  };

  // Calculate total cost - Fixed to properly sum all items
  const calculateTotal = () => {
    let basePrice = parseFloat(formData.basePrice) || 0;
    let itemsTotal = 0;
    
    formData.itineraries.forEach((day) => {
      day.itineraryItems.forEach((item) => {
        // Only add non-optional items to the base package cost
        if (!item.optional && !item.isAddOn) {
          const itemPrice = parseFloat(item.price) || 0;
          itemsTotal += itemPrice;
        }
      });
    });
    
    return basePrice + itemsTotal;
  };

  const totalCost = calculateTotal();

  // Calculate breakdown for display
  const getCostBreakdown = () => {
    let includedItems = 0;
    let optionalItems = 0;
    let addOnItems = 0;
    
    formData.itineraries.forEach((day) => {
      day.itineraryItems.forEach((item) => {
        const itemPrice = parseFloat(item.price) || 0;
        if (item.isAddOn) {
          addOnItems += itemPrice;
        } else if (item.optional) {
          optionalItems += itemPrice;
        } else {
          includedItems += itemPrice;
        }
      });
    });
    
    return { includedItems, optionalItems, addOnItems };
  };

  const breakdown = getCostBreakdown();

  return (
    <div className="p-8">
      <style>{`
        ::placeholder {
          color: #D1D5DB;
          opacity: 1;
        }
      `}</style>
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Review & Publish</h3>
        <p className="text-gray-600 text-sm mt-1">Review all details before publishing your package</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="font-semibold text-gray-800">Basic Information</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Title</p>
              <p className="font-medium text-gray-800">{formData.title || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-800">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {formData.category || 'Not set'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Base Price</p>
              <p className="font-medium text-gray-800">
                {formData.currency} {parseFloat(formData.basePrice).toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Group Size</p>
              <p className="font-medium text-gray-800">{formData.maxGroupSize || '0'} people</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-800">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {formData.status}
                </span>
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium text-gray-800">{formData.description || 'No description provided'}</p>
            </div>
          </div>

          {/* Includes */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Includes</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.includes).map(([key, value]) =>
                value ? (
                  <span key={key} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    ✓ {key}: {value}
                  </span>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Itinerary Timeline */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="font-semibold text-gray-800">Itinerary Timeline</h4>
          </div>

          {formData.itineraries.length === 0 ? (
            <p className="text-gray-500 text-sm">No itinerary added</p>
          ) : (
            <div className="space-y-3">
              {formData.itineraries.map((day, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {day.dayNumber}
                    </div>
                    <p className="font-semibold text-gray-800">{day.title}</p>
                  </div>
                  <p className="ml-10 text-sm text-gray-600 mb-2">{day.description}</p>
                  <ul className="ml-10 space-y-1">
                    {day.itineraryItems.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-gray-400">•</span>
                        <span className="flex-1">
                          {item.name || 'Unnamed item'} 
                          {item.price > 0 && (
                            <span className="text-gray-500"> - {formData.currency} {parseFloat(item.price).toLocaleString()}</span>
                          )}
                          {item.optional && <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Optional</span>}
                          {item.isAddOn && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Add-on</span>}
                        </span>
                      </li>
                    ))}
                    {day.itineraryItems.length === 0 && (
                      <li className="text-sm text-gray-400 ml-2">No items added</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Media Gallery */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="font-semibold text-gray-800">Media Gallery ({formData.media.length} images)</h4>
          </div>

          {formData.media.length === 0 ? (
            <p className="text-gray-500 text-sm">No images uploaded</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {formData.media.map((media, index) => (
                <div key={index} className="relative">
                  <img
                    src={media.preview}
                    alt={media.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                      Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cost Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-semibold text-gray-800">Cost Summary</h4>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price</span>
              <span className="font-medium text-gray-800">
                {formData.currency} {parseFloat(formData.basePrice).toLocaleString()}
              </span>
            </div>
            {breakdown.includedItems > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Included Items</span>
                <span className="font-medium text-gray-800">
                  {formData.currency} {breakdown.includedItems.toLocaleString()}
                </span>
              </div>
            )}
            {breakdown.optionalItems > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Optional Items (not in base)</span>
                <span className="font-medium text-yellow-600">
                  {formData.currency} {breakdown.optionalItems.toLocaleString()}
                </span>
              </div>
            )}
            {breakdown.addOnItems > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Add-on Items (not in base)</span>
                <span className="font-medium text-purple-600">
                  {formData.currency} {breakdown.addOnItems.toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-blue-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-800">Total Package Cost</span>
              <span className="font-bold text-blue-600 text-lg">
                {formData.currency} {totalCost.toLocaleString()}
              </span>
            </div>
            {(breakdown.optionalItems > 0 || breakdown.addOnItems > 0) && (
              <p className="text-xs text-gray-500 mt-2">
                * Optional and add-on items are not included in the base package cost
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          ← Previous
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDraftSave}
            disabled={loading}
            className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading}
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}