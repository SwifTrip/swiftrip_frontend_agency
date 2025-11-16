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
      description: `Day ${formData.itineraries.length + 1}`, // Default description
      startTime: '',
      endTime: '',
      itineraryItems: [],
    };
    updateFormData({ itineraries: [...formData.itineraries, newDay] });
    setExpandedDay(formData.itineraries.length);
  };

  const removeDay = (index) => {
    const updated = formData.itineraries.filter((_, i) => i !== index);
    updateFormData({ itineraries: updated });
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
      duration: 120, // 2 hours default
      location: '',
      price: 0,
      optional: false,
      isAddOn: false,
      sortOrder: updated[dayIndex].itineraryItems.length + 1,
      timeOfDay: timeOfDay,
    };

    // AUTO-ADD REQUIRED NESTED DETAILS
    if (type === 'MEAL') {
      newItem.mealDetails = { mealType: 'DINNER', cuisine: 'Pakistani', included: true };
    }
    if (type === 'STAY') {
      newItem.stayDetails = {
        stayType: 'HOTEL',
        hotelName: '',
        roomType: 'Standard',
        rating: 4,
        checkInTime: '',
        checkOutTime: '',
      };
    }
    if (type === 'TRANSPORT') {
      newItem.transportDetails = {
        vehicleType: 'Bus',
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
          cuisine: 'Pakistani', 
          included: true 
        };
      } else if (value === 'STAY') {
        item.stayDetails = {
          stayType: 'HOTEL',
          hotelName: '',
          roomType: 'Standard',
          rating: 4,
          checkInTime: '',
          checkOutTime: '',
        };
      } else if (value === 'TRANSPORT') {
        item.transportDetails = {
          vehicleType: 'Bus',
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
      item.mealDetails = { ...item.mealDetails, [key]: value };
    } else if (field.startsWith('stayDetails.')) {
      const key = field.split('.')[1];
      item.stayDetails = { ...item.stayDetails, [key]: value };
    } else if (field.startsWith('transportDetails.')) {
      const key = field.split('.')[1];
      item.transportDetails = { ...item.transportDetails, [key]: value };
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
    
    // Check if at least one day has items
    const hasItemsInAnyDay = formData.itineraries.some(day => day.itineraryItems.length > 0);
    if (!hasItemsInAnyDay) {
      toast.error('Please add at least one item to any day in the itinerary');
      return;
    }
    
    // Validate that all days have descriptions
    const daysWithoutDescription = formData.itineraries.filter(day => !day.description || day.description.trim() === '');
    if (daysWithoutDescription.length > 0) {
      toast.error('Please add a description for all days in the itinerary');
      return;
    }
    
    // Validate itinerary items have required nested details
    for (let i = 0; i < formData.itineraries.length; i++) {
      const day = formData.itineraries[i];
      
      for (let j = 0; j < day.itineraryItems.length; j++) {
        const item = day.itineraryItems[j];
        
        // Check for required nested details based on type
        if (item.type === 'MEAL' && !item.mealDetails) {
          toast.error(`Day ${day.dayNumber}: "${item.name || 'Meal item'}" is missing meal details`);
          return;
        }
        
        if (item.type === 'STAY' && !item.stayDetails) {
          toast.error(`Day ${day.dayNumber}: "${item.name || 'Stay item'}" is missing stay details`);
          return;
        }
        
        if (item.type === 'TRANSPORT' && !item.transportDetails) {
          toast.error(`Day ${day.dayNumber}: "${item.name || 'Transport item'}" is missing transport details`);
          return;
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
                    <p className="text-sm text-gray-500">{day.description || `Day ${day.dayNumber}`}</p>
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
                      <label className="text-sm font-medium text-gray-700 block mb-2">Day Title</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                        placeholder="Enter day title"
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
                        placeholder="Enter day description (required)"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
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
                                    <label className="text-xs text-gray-600 block mb-1">Name</label>
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
                                      value={item.location}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'location', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="Location"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600 block mb-1">Description</label>
                                  <textarea
                                    value={item.description}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      updateItem(dayIndex, actualIndex, 'description', e.target.value);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Description"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">Duration</label>
                                    <input
                                      type="text"
                                      value={item.duration ? `${Math.round(item.duration / 60 * 10) / 10} hours` : '2 hours'}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        const match = e.target.value.match(/[\d.]+/);
                                        const hours = match ? parseFloat(match[0]) : 2;
                                        updateItem(dayIndex, actualIndex, 'duration', hours * 60);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="2 hours"
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">Price (PKR)</label>
                                    <input
                                      type="number"
                                      value={item.price}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        updateItem(dayIndex, actualIndex, 'price', e.target.value);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      placeholder="0"
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
                                          <option>BREAKFAST</option>
                                          <option>LUNCH</option>
                                          <option>DINNER</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Cuisine</label>
                                        <input
                                          type="text"
                                          value={item.mealDetails.cuisine}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'mealDetails.cuisine', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="Pakistani"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* STAY DETAILS */}
                                {item.type === 'STAY' && item.stayDetails && (
                                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <p className="text-xs font-semibold text-green-900 mb-3">Stay Details</p>
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Hotel Name</label>
                                        <input
                                          type="text"
                                          value={item.stayDetails.hotelName}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'stayDetails.hotelName', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="Hotel Name"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Room Type</label>
                                        <input
                                          type="text"
                                          value={item.stayDetails.roomType}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'stayDetails.roomType', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="Standard"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* TRANSPORT DETAILS */}
                                {item.type === 'TRANSPORT' && item.transportDetails && (
                                  <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <p className="text-xs font-semibold text-purple-900 mb-3">Transport Details</p>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Vehicle Type</label>
                                        <input
                                          type="text"
                                          value={item.transportDetails.vehicleType}
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            updateItem(dayIndex, actualIndex, 'transportDetails.vehicleType', e.target.value);
                                          }}
                                          onClick={(e) => e.stopPropagation()}
                                          placeholder="Bus"
                                          className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">From</label>
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