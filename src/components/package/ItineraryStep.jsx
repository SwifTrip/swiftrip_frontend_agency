// src/components/package/ItineraryStep.jsx
import React, { useState } from 'react';

export default function ItineraryStep({ formData, updateFormData, onNext, onPrev }) {
  const [expandedDay, setExpandedDay] = useState(null);

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
    updateFormData({ itineraries: updated });
  };

  const updateDay = (index, field, value) => {
    const updated = [...formData.itineraries];
    updated[index] = { ...updated[index], [field]: value };
    updateFormData({ itineraries: updated });
  };

  const addItem = (dayIndex, type) => {
    const updated = [...formData.itineraries];
    const newItem = {
      name: '',
      type: type,
      description: '',
      duration: 60,
      location: '',
      price: 0,
      optional: false,
      isAddOn: false,
      sortOrder: updated[dayIndex].itineraryItems.length + 1,
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

    // Handle nested fields
    if (field.startsWith('mealDetails.')) {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.itineraries.length === 0) {
      alert('Please add at least one day');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Day-by-Day Itinerary</h3>
          <p className="text-gray-600 text-sm mt-1">Add activities, meals, stays, and transport</p>
        </div>
        <button type="button" onClick={addDay} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Day
        </button>
      </div>

      {formData.itineraries.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-600 font-medium">No days added yet</p>
          <button type="button" onClick={addDay} className="mt-4 text-blue-600 font-semibold">
            Add First Day
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.itineraries.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedDay(expandedDay === dayIndex ? null : dayIndex)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {day.dayNumber}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{day.title || `Day ${day.dayNumber}`}</p>
                    <p className="text-sm text-gray-500">{day.itineraryItems.length} items</p>
                  </div>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeDay(dayIndex); }} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  Remove
                </button>
              </div>

              {expandedDay === dayIndex && (
                <div className="p-6 space-y-6 bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                      placeholder="Day title"
                      className="px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={day.description}
                      onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                      placeholder="Day description"
                      className="px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <div className="flex gap-3 mb-4">
                      {['ACTIVITY', 'MEAL', 'STAY', 'TRANSPORT'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => addItem(dayIndex, type)}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200"
                        >
                          + {type}
                        </button>
                      ))}
                    </div>

                    {day.itineraryItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gray-50 p-4 rounded-lg mb-4 border">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-indigo-600">{item.type}</span>
                          <button
                            type="button"
                            onClick={() => removeItem(dayIndex, itemIndex)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(dayIndex, itemIndex, 'name', e.target.value)}
                            placeholder="Name"
                            className="px-3 py-2 border rounded text-sm"
                          />
                          <input
                            type="text"
                            value={item.location}
                            onChange={(e) => updateItem(dayIndex, itemIndex, 'location', e.target.value)}
                            placeholder="Location"
                            className="px-3 py-2 border rounded text-sm"
                          />
                          <input
                            type="number"
                            value={item.duration}
                            onChange={(e) => updateItem(dayIndex, itemIndex, 'duration', e.target.value)}
                            placeholder="Duration (min)"
                            className="px-3 py-2 border rounded text-sm"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(dayIndex, itemIndex, 'price', e.target.value)}
                            placeholder="Price"
                            className="px-3 py-2 border rounded text-sm"
                          />
                        </div>

                        <textarea
                          value={item.description}
                          onChange={(e) => updateItem(dayIndex, itemIndex, 'description', e.target.value)}
                          placeholder="Description"
                          rows={2}
                          className="w-full mt-3 px-3 py-2 border rounded text-sm"
                        />

                        {/* MEAL DETAILS */}
                        {item.type === 'MEAL' && item.mealDetails && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-xs font-medium text-blue-800 mb-2">Meal Details</p>
                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={item.mealDetails.mealType}
                                onChange={(e) => updateItem(dayIndex, itemIndex, 'mealDetails.mealType', e.target.value)}
                                className="px-2 py-1 border rounded text-xs"
                              >
                                <option>BREAKFAST</option>
                                <option>LUNCH</option>
                                <option>DINNER</option>
                              </select>
                              <input
                                type="text"
                                value={item.mealDetails.cuisine}
                                onChange={(e) => updateItem(dayIndex, itemIndex, 'mealDetails.cuisine', e.target.value)}
                                placeholder="Cuisine"
                                className="px-2 py-1 border rounded text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {/* STAY DETAILS */}
                        {item.type === 'STAY' && item.stayDetails && (
                          <div className="mt-3 p-3 bg-green-50 rounded">
                            <p className="text-xs font-medium text-green-800 mb-2">Stay Details</p>
                            <input
                              type="text"
                              value={item.stayDetails.hotelName}
                              onChange={(e) => updateItem(dayIndex, itemIndex, 'stayDetails.hotelName', e.target.value)}
                              placeholder="Hotel Name"
                              className="w-full mb-2 px-2 py-1 border rounded text-xs"
                            />
                            <input
                              type="text"
                              value={item.stayDetails.roomType}
                              onChange={(e) => updateItem(dayIndex, itemIndex, 'stayDetails.roomType', e.target.value)}
                              placeholder="Room Type"
                              className="w-full px-2 py-1 border rounded text-xs"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button type="button" onClick={onPrev} className="px-6 py-3 bg-gray-200 rounded-lg">
          Previous
        </button>
        <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg">
          Next
        </button>
      </div>
    </form>
  );
}