// src/components/package/BasicInfoStep.jsx
import React from 'react';

const CATEGORIES = ['ADVENTURE', 'FAMILY', 'ROMANTIC', 'CULTURAL', 'RELIGIOUS', 'OTHER'];
const STATUSES = ['DRAFT', 'ACTIVE', 'INACTIVE'];
const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP'];

export default function BasicInfoStep({ formData, updateFormData, onNext }) {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleIncludesChange = (field, value) => {
    updateFormData({
      includes: { ...formData.includes, [field]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const required = ['title', 'category', 'basePrice', 'maxGroupSize', 'fromLocation', 'toLocation'];
    const missing = required.filter(field => !formData[field]);

    if (missing.length > 0) {
      alert(`Please fill in: ${missing.join(', ')}`);
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Basic Package Information</h3>
        <p className="text-gray-600 text-sm mt-1">Provide essential details about your tour package</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* From Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">From Location</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                value={formData.fromLocation}
                onChange={(e) => updateFormData({ fromLocation: e.target.value })}
                placeholder="Enter starting point"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">To Location</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                value={formData.toLocation}
                onChange={(e) => updateFormData({ toLocation: e.target.value })}
                placeholder="Enter destination"
              />
            </div>
          </div>
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Northern Pakistan Explorer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange('basePrice', value === '' ? 0 : Number(value));
                }}
                placeholder="2500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Group Size */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Max Group Size <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.maxGroupSize}
              onChange={(e) => {
                const value = e.target.value;
                handleChange('maxGroupSize', value === '' ? 0 : Number(value));
              }}
              placeholder="12"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the highlights and unique features of this package..."
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Package Includes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Package Includes</label>
            <div className="space-y-3">
              {['meals', 'transportation', 'accommodation', 'guide', 'activities', 'travelInsurance'].map((key) => (
                <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={!!formData.includes[key]}
                    onChange={(e) => handleIncludesChange(key, e.target.checked ? (key === 'meals' ? '3 meals per day' : key === 'transportation' ? 'Included' : key === 'accommodation' ? '4-star hotel' : key === 'guide' ? 'Professional tour guide' : key === 'activities' ? 'All activities' : 'Basic coverage') : '')}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </p>
                    {formData.includes[key] && (
                      <input
                        type="text"
                        value={formData.includes[key]}
                        onChange={(e) => handleIncludesChange(key, e.target.value)}
                        placeholder={`e.g., ${key === 'meals' ? '3 meals per day' : 'Private vehicle'}`}
                        className="mt-1 text-sm text-gray-600 border-none focus:ring-0 p-0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          disabled
          className="px-6 py-3 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          Next
        </button>
      </div>
    </form>
  );
}