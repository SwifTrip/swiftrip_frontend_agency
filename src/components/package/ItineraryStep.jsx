// src/components/package/ItineraryStep.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ItineraryStep({ formData, updateFormData, onNext, onPrev }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedItem, setExpandedItem] = useState({});

  const addDay = () => {
    const newDay = {
      dayNumber: formData.itineraries.length + 1,
      title: `Day ${formData.itineraries.length + 1}`,
      description: '',
      startTime: '',
      endTime: '',
      itineraryItems: [],
    };
    updateFormData({ itineraries: [...formData.itineraries, newDay] });
    setExpandedDay(formData.itineraries.length);
  };

  const removeDay = (index) => {
    const updated = formData.itineraries.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = updated.map((day, idx) => ({
      ...day,
      dayNumber: idx + 1,
    }));
    updateFormData({ itineraries: renumbered });
    toast.success('Day removed successfully');
  };

  const updateDay = (index, field, value) => {
    const updated = [...formData.itineraries];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ itineraries: updated });
  };

  const addItem = (dayIndex, type, timeOfDay = 'Morning') => {
    const updated = [...formData.itineraries];
    const newItem = {
      name: '',
      type: type,
      description: '',
      duration: 120, // 2 hours default in minutes
      location: '',
      price: 0,
      optional: false,
      isAddOn: false,
      sortOrder: updated[dayIndex].itineraryItems.length + 1,
      timeOfDay: timeOfDay, // Keep for future use
    };

    // AUTO-ADD REQUIRED NESTED DETAILS based on type
    if (type === 'MEAL') {
      newItem.mealDetails = { 
        mealType: 'DINNER', 
        cuisine: '', 
        included: true 
      };
    }
    if (type === 'STAY') {
      newItem.stayDetails = {
        stayType: 'HOTEL',
        hotelName: '',
        roomType: '',
        rating: 4,
        checkInTime: '',
        checkOutTime: '',
      };
    }
    if (type === 'TRANSPORT') {
      newItem.transportDetails = {
        vehicleType: '',
        startLocation: '',
        endLocation: '',
        estimatedDuration: 120,
        included: true,
      };
    }

    updated[dayIndex].itineraryItems.push(newItem);
    updateFormData({ itineraries: updated });
  };

  const updateItem = (dayIndex, itemIndex, field, value) => {
    const updated = [...formData.itineraries];
    const item = updated[dayIndex].itineraryItems[itemIndex];

    let finalValue = value;
    if (['duration', 'price', 'sortOrder'].includes(field)) {
      finalValue = value === '' ? 0 : Number(value);
    }
    if (field === 'rating') {
      finalValue = value === '' ? 0 : Number(value);
    }

    // Handle type changes - add required nested details
    if (field === 'type') {
      // Remove all existing nested details first
      delete item.mealDetails;
      delete item.stayDetails;
      delete item.transportDetails;

      // Add appropriate nested details based on new type
      if (value === 'MEAL') {
        item.mealDetails = { 
          mealType: 'DINNER', 
          cuisine: '', 
          included: true 
        };
      } else if (value === 'STAY') {
        item.stayDetails = {
          stayType: 'HOTEL',
          hotelName: '',
          roomType: '',
          rating: 4,
          checkInTime: '',
          checkOutTime: '',
        };
      } else if (value === 'TRANSPORT') {
        item.transportDetails = {
          vehicleType: '',
          startLocation: '',
          endLocation: '',
          estimatedDuration: 120,
          included: true,
        };
      }
      item.type = value;
    }
    // Handle nested fields
    else if (field.startsWith('mealDetails.')) {
      const key = field.split('.')[1];
      if (key === 'included') {
        finalValue = value === 'true' || value === true;
      }
      item.mealDetails = { ...item.mealDetails, [key]: finalValue };
    } else if (field.startsWith('stayDetails.')) {
      const key = field.split('.')[1];
      item.stayDetails = { ...item.stayDetails, [key]: finalValue };
    } else if (field.startsWith('transportDetails.')) {
      const key = field.split('.')[1];
      if (key === 'included') {
        finalValue = value === 'true' || value === true;
      }
      if (key === 'estimatedDuration') {
        finalValue = value === '' ? 0 : Number(value);
      }
      item.transportDetails = { ...item.transportDetails, [key]: finalValue };
    } else {
      item[field] = finalValue;
    }

    updateFormData({ itineraries: updated });
  };

  const removeItem = (dayIndex, itemIndex) => {
    const updated = [...formData.itineraries];
    updated[dayIndex].itineraryItems = updated[dayIndex].itineraryItems.filter((_, i) => i !== itemIndex);
    updateFormData({ itineraries: updated });
    toast.success('Item removed successfully');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if at least one day exists
    if (formData.itineraries.length === 0) {
      toast.error('Please add at least one day to the itinerary');
      return;
    }
    
    // Validate all days and items
    for (let i = 0; i < formData.itineraries.length; i++) {
      const day = formData.itineraries[i];
      
      // Validate day fields
      if (!day.title || day.title.trim() === '') {
        toast.error(`Day ${day.dayNumber}: Title is required`);
        return;
      }
      
      if (!day.description || day.description.trim() === '') {
        toast.error(`Day ${day.dayNumber}: Description is required`);
        return;
      }
      
      // Check if day has at least one item
      if (day.itineraryItems.length === 0) {
        toast.error(`Day ${day.dayNumber}: At least one itinerary item is required`);
        return;
      }
      
      // Validate each itinerary item
      for (let j = 0; j < day.itineraryItems.length; j++) {
        const item = day.itineraryItems[j];
        
        // Basic item validation
        if (!item.name || item.name.trim() === '') {
          toast.error(`Day ${day.dayNumber}, Item ${j + 1}: Name is required`);
          return;
        }
        
        if (!item.description || item.description.trim() === '') {
          toast.error(`Day ${day.dayNumber}, Item "${item.name}": Description is required`);
          return;
        }
        
        if (!item.duration || item.duration <= 0) {
          toast.error(`Day ${day.dayNumber}, Item "${item.name}": Duration must be positive`);
          return;
        }
        
        if (item.price < 0) {
          toast.error(`Day ${day.dayNumber}, Item "${item.name}": Price must be non-negative`);
          return;
        }
        
        // Validate nested details based on type
        if (item.type === 'MEAL') {
          if (!item.mealDetails) {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Meal details are required`);
            return;
          }
          if (!item.mealDetails.cuisine || item.mealDetails.cuisine.trim() === '') {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Cuisine type is required`);
            return;
          }
        }
        
        if (item.type === 'STAY') {
          if (!item.stayDetails) {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Stay details are required`);
            return;
          }
          if (!item.stayDetails.hotelName || item.stayDetails.hotelName.trim() === '') {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Hotel/stay name is required`);
            return;
          }
          if (!item.stayDetails.roomType || item.stayDetails.roomType.trim() === '') {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Room type is required`);
            return;
          }
          if (item.stayDetails.rating < 0 || item.stayDetails.rating > 5) {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Rating must be between 0 and 5`);
            return;
          }
        }
        
        if (item.type === 'TRANSPORT') {
          if (!item.transportDetails) {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Transport details are required`);
            return;
          }
          if (!item.transportDetails.vehicleType || item.transportDetails.vehicleType.trim() === '') {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Vehicle type is required`);
            return;
          }
          if (!item.transportDetails.startLocation || item.transportDetails.startLocation.trim() === '') {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Start location is required`);
            return;
          }
          if (!item.transportDetails.endLocation || item.transportDetails.endLocation.trim() === '') {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": End location is required`);
            return;
          }
          if (!item.transportDetails.estimatedDuration || item.transportDetails.estimatedDuration <= 0) {
            toast.error(`Day ${day.dayNumber}, Item "${item.name}": Estimated duration must be positive`);
            return;
          }
        }
      }
    }
    
    onNext();
  };

  const toggleItemExpand = (dayIndex, itemIndex) => {
    const key = `${dayIndex}-${itemIndex}`;
    setExpandedItem(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getItemsByTimeOfDay = (items, timeOfDay) => {
    return items.filter(item => item.timeOfDay === timeOfDay);
  };

  const getTimeIcon = (timeOfDay) => {
    if (timeOfDay === 'Morning') return '🌅';
    if (timeOfDay === 'Afternoon') return '☀️';
    if (timeOfDay === 'Evening') return '🌆';
    return '⭐';
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 w-full">
      <style>{`
        ::placeholder {
          color: #D1D5DB;
          opacity: 1;
        }
        ::-webkit-input-placeholder {
          color: #D1D5DB;
          opacity: 1;
        }
        ::-moz-placeholder {
          color: #D1D5DB;
          opacity: 1;
        }
        :-ms-input-placeholder {
          color: #D1D5DB;
          opacity: 1;
        }
      `}</style>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h3>
          <p className="text-gray-500 text-sm mt-1">Build a detailed timeline for your package</p>
        </div>
        <button type="button" onClick={addDay} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
          + Add Day
        </button>
      </div>

      {formData.itineraries.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <p className="text-gray-600 font-medium mb-2">No days added yet</p>
          <button type="button" onClick={addDay} className="mt-2 text-blue-600 font-semibold hover:text-blue-700">
            + Add First Day
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.itineraries.map((day, dayIndex) => (
            <div key={dayIndex} className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedDay(expandedDay === dayIndex ? null : dayIndex)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {day.dayNumber}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{day.title || `Day ${day.dayNumber}`}</p>
                    <p className="text-sm text-gray-500">{day.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDay(dayIndex);
                    }}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                  {expandedDay === dayIndex ? (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </div>

              {expandedDay === dayIndex && (
                <div className="p-6 space-y-6 bg-white border-t border-gray-200">
                  {/* Day Title and Description Inputs */}
                  <div className="grid grid-cols-1 gap-4 pb-4 border-b border-gray-200">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Day Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                        placeholder="e.g., Arrival and City Tour"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Day Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={day.description}
                        onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                        placeholder="Describe what happens on this day"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Start Time (Optional)</label>
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => updateDay(dayIndex, 'startTime', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">End Time (Optional)</label>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => updateDay(dayIndex, 'endTime', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Time Period Sections */}
                  {['Morning', 'Afternoon', 'Evening'].map(timeOfDay => {
                    const items = getItemsByTimeOfDay(day.itineraryItems, timeOfDay);
                    return (
                      <div key={timeOfDay} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTimeIcon(timeOfDay)}</span>
                            <span className="font-semibold text-gray-800">{timeOfDay}</span>
                            <span className="text-sm text-gray-500">{items.length} items</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addItem(dayIndex, 'ACTIVITY', timeOfDay)}
                            className="text-sm text-gray-600 hover:text-blue-600 font-medium"
                          >
                            + Add Item
                          </button>
                        </div>

                        {items.map((item, itemIndex) => {
                          const actualIndex = day.itineraryItems.findIndex(i => i === item);
                          const isExpanded = expandedItem[`${dayIndex}-${actualIndex}`];
                          
                          return (
                            <div key={actualIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                              <div
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleItemExpand(dayIndex, actualIndex)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">🎯</span>
                                    <select
                                      value={item.type}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'type', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-sm font-medium text-gray-700 border-none bg-transparent focus:outline-none cursor-pointer"
                                    >
                                      <option value="ACTIVITY">Activity</option>
                                      <option value="MEAL">Meal</option>
                                      <option value="STAY">Stay</option>
                                      <option value="TRANSPORT">Transport</option>
                                      <option value="OTHER">Other</option>
                                    </select>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeItem(dayIndex, actualIndex);
                                    }}
                                    className="text-red-500 text-xl hover:text-red-700 leading-none font-bold"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                      Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'name', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="Item name"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">Location</label>
                                    <input
                                      type="text"
                                      value={item.location || ''}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'location', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="Location (optional)"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600 block mb-1">
                                    Description <span className="text-red-500">*</span>
                                  </label>
                                  <textarea
                                    value={item.description}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      updateItem(dayIndex, actualIndex, 'description', e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Describe this activity"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  />
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-3">
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                      Duration (min) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      value={item.duration}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'duration', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="120"
                                      min="1"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">
                                      Price (PKR) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      value={item.price}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'price', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="0"
                                      min="0"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">Sort Order</label>
                                    <input
                                      type="number"
                                      value={item.sortOrder || 0}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'sortOrder', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="1"
                                      min="0"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mt-3">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={item.optional}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'optional', e.target.checked);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Optional</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={item.isAddOn}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'isAddOn', e.target.checked);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Add-on</span>
                                  </label>
                                </div>

                                {/* MEAL DETAILS */}
                                {item.type === 'MEAL' && item.mealDetails && (
                                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs font-semibold text-blue-900 mb-3">Meal Details</p>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Meal Type</label>
                                        <select
                                          value={item.mealDetails.mealType}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'mealDetails.mealType', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="BREAKFAST">Breakfast</option>
                                          <option value="LUNCH">Lunch</option>
                                          <option value="DINNER">Dinner</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">
                                          Cuisine <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={item.mealDetails.cuisine}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'mealDetails.cuisine', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="e.g., Pakistani"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-3">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={item.mealDetails.included}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'mealDetails.included', e.target.checked);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Included in package</span>
                                      </label>
                                    </div>
                                  </div>
                                )}

                                {/* STAY DETAILS */}
                                {item.type === 'STAY' && item.stayDetails && (
                                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-xs font-semibold text-green-900 mb-3">Stay Details</p>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Stay Type</label>
                                        <select
                                          value={item.stayDetails.stayType}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'stayDetails.stayType', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                        >
                                          <option value="HOTEL">Hotel</option>
                                          <option value="GUESTHOUSE">Guesthouse</option>
                                          <option value="CAMP">Camp</option>
                                          <option value="OTHER">Other</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">
                                          Hotel/Stay Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={item.stayDetails.hotelName}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'stayDetails.hotelName', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="Hotel name"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1">
                                            Room Type <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={item.stayDetails.roomType}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              updateItem(dayIndex, actualIndex, 'stayDetails.roomType', e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="e.g., Standard"
                                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1">
                                            Rating (0-5) <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                            type="number"
                                            value={item.stayDetails.rating}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              updateItem(dayIndex, actualIndex, 'stayDetails.rating', e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="4"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1">Check-in Time</label>
                                          <input
                                            type="time"
                                            value={item.stayDetails.checkInTime || ''}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              updateItem(dayIndex, actualIndex, 'stayDetails.checkInTime', e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1">Check-out Time</label>
                                          <input
                                            type="time"
                                            value={item.stayDetails.checkOutTime || ''}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              updateItem(dayIndex, actualIndex, 'stayDetails.checkOutTime', e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* TRANSPORT DETAILS */}
                                {item.type === 'TRANSPORT' && item.transportDetails && (
                                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <p className="text-xs font-semibold text-purple-900 mb-3">Transport Details</p>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">
                                          Vehicle Type <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="text"
                                          value={item.transportDetails.vehicleType}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'transportDetails.vehicleType', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="e.g., Bus, Car, Train"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1">
                                            From <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={item.transportDetails.startLocation}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              updateItem(dayIndex, actualIndex, 'transportDetails.startLocation', e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Start location"
                                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-600 block mb-1">
                                            To <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                            type="text"
                                            value={item.transportDetails.endLocation}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              updateItem(dayIndex, actualIndex, 'transportDetails.endLocation', e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="End location"
                                            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">
                                          Est. Duration (min) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                          type="number"
                                          value={item.transportDetails.estimatedDuration}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'transportDetails.estimatedDuration', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="120"
                                          min="1"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={item.transportDetails.included}
                                            onChange={(e) => {
                                              e.stopPropagation();
                                              updateItem(dayIndex, actualIndex, 'transportDetails.included', e.target.checked);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                          />
                                          <span className="text-sm text-gray-700">Included in package</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrev} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
          ← Previous
        </button>
        <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Next →
        </button>
      </div>
    </form>
  );
}