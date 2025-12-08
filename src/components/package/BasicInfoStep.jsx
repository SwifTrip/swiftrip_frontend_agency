import React, { useState } from 'react';
import Select from "react-select";
import pakistanLocations from "../../data/pakistanLocations.json";

const CATEGORIES = ['ADVENTURE', 'FAMILY', 'ROMANTIC', 'CULTURAL', 'RELIGIOUS', 'OTHER'];
const STATUSES = ['DRAFT', 'ACTIVE', 'INACTIVE'];
const CURRENCIES = ['PKR', 'USD', 'EUR', 'GBP'];

const INCLUDE_LABELS = {
  meals: 'Meals',
  transportation: 'Transportation',
  accommodation: 'Accommodation',
  guide: 'Guide',
  activities: 'Activities',
  travelInsurance: 'Travel Insurance',
};

export default function BasicInfoStep({ formData, updateFormData, onNext }) {
  const [errors, setErrors] = useState({});

  // ----- REQUIRED FIELDS -----
  const required = [
    'title',
    'category',
    'basePrice',
    'maxGroupSize',
    'fromLocation',
    'toLocation',
    'description',
  ];

  // ----- VALIDATION -----
  const validateField = (name, value) => {
    if (required.includes(name) && !value?.toString().trim()) {
      const label =
        name === 'fromLocation' ? 'From Location' :
        name === 'toLocation' ? 'To Location' :
        name === 'basePrice' ? 'Base Price' :
        name === 'maxGroupSize' ? 'Max Group Size' :
        name === 'description' ? 'Description' :
        name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
      return `${label} is required`;
    }
    if (name === 'basePrice' && (value <= 0)) return 'Base price must be greater than 0';
    if (name === 'maxGroupSize' && (value <= 0)) return 'Max group size must be greater than 0';
    return '';
  };

  // const handleChange = (field, value) => {
  //   updateFormData({ [field]: value });
  //   if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    
  // };

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });

    // Regular field validation
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));

    // Extra check: From & To cannot be same
    if (
      (field === "fromLocation" || field === "toLocation") &&
      formData.fromLocation &&
      formData.toLocation &&
      ((field === "fromLocation" && value === formData.toLocation) ||
      (field === "toLocation" && value === formData.fromLocation))
    ) {
      setErrors((prev) => ({
        ...prev,
        fromLocation: "From and To location cannot be the same",
        toLocation: "From and To location cannot be the same",
      }));
    } else {
      // If user changes again and they are no longer same → clear location errors
      setErrors((prev) => ({
        ...prev,
        fromLocation:
          prev.fromLocation === "From and To location cannot be the same"
            ? ""
            : prev.fromLocation,
        toLocation:
          prev.toLocation === "From and To location cannot be the same"
            ? ""
            : prev.toLocation,
      }));
    }
  };

  const handleBlur = (field) => {
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAll = () => {
    const newErr = {};
    required.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErr[f] = err;
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateAll()) onNext();
  };

  // ----- INCLUDES -----
  const handleIncludesToggle = (key, checked) => {
    const defaults = {
      meals: '3 meals per day',
      transportation: 'Included',
      accommodation: '4‑star hotel',
      guide: 'Professional tour guide',
      activities: 'All activities',
      travelInsurance: 'Basic coverage',
    };
    updateFormData({
      includes: { ...formData.includes, [key]: checked ? defaults[key] : '' },
    });
  };

  const handleIncludesDetail = (key, value) => {
    updateFormData({ includes: { ...formData.includes, [key]: value } });
  };

  // ----- SELECT STYLES -----
  const selectBase = `
    w-full px-4 py-3 pr-10 bg-white border rounded-lg
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    appearance-none cursor-pointer
  `;

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Basic Package Information</h3>
        <p className="mt-1 text-sm text-gray-600">Provide essential details about your tour package</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* From / To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                From Location <span className="text-red-500">*</span>
              </label>
              <Select
                options={pakistanLocations.map(loc => ({ label: loc, value: loc }))}
                value={formData.fromLocation ? { label: formData.fromLocation, value: formData.fromLocation } : null}
                onChange={(selected) => handleChange("fromLocation", selected?.value || "")}
                onBlur={() => handleBlur("fromLocation")}
                placeholder="Search & select starting point"
                classNamePrefix="react-select"
              />
              {errors.fromLocation && <p className="mt-1 text-xs text-red-600">{errors.fromLocation}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                To Location <span className="text-red-500">*</span>
              </label>
              <Select
                options={pakistanLocations.map(loc => ({ label: loc, value: loc }))}
                value={formData.toLocation ? { label: formData.toLocation, value: formData.toLocation } : null}
                onChange={(selected) => handleChange("toLocation", selected?.value || "")}
                onBlur={() => handleBlur("toLocation")}
                placeholder="Search & select starting point"
                classNamePrefix="react-select"
              />
              {errors.toLocation && <p className="mt-1 text-xs text-red-600">{errors.toLocation}</p>}
            </div>

          </div>

          {/* Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="e.g., Northern Pakistan Explorer"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Category – custom styled */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                className={`
                  ${selectBase}
                  ${errors.category ? 'border-red-500' : 'border-gray-300'}
                `}
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e")',
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '12px',
                }}
              >
                <option value="" disabled className="text-gray-400">
                  Select category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0) + c.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.basePrice ?? ''}
                onChange={(e) => handleChange('basePrice', e.target.value === '' ? '' : Number(e.target.value))}
                onBlur={() => handleBlur('basePrice')}
                placeholder="2500"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400 ${
                  errors.basePrice ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.basePrice && <p className="mt-1 text-xs text-red-600">{errors.basePrice}</p>}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Currency</label>
              <div className="relative">
                <select
                  value={formData.currency || 'PKR'}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className={`${selectBase} border-gray-300`}
                  style={{
                    backgroundImage:
                      'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e")',
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '12px',
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Max Group Size */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Max Group Size <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.maxGroupSize ?? ''}
              onChange={(e) => handleChange('maxGroupSize', e.target.value === '' ? '' : Number(e.target.value))}
              onBlur={() => handleBlur('maxGroupSize')}
              placeholder="10"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-400 ${
                errors.maxGroupSize ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.maxGroupSize && <p className="mt-1 text-xs text-red-600">{errors.maxGroupSize}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
            <div className="relative">
              <select
                value={formData.status || 'DRAFT'}
                onChange={(e) => handleChange('status', e.target.value)}
                className={`${selectBase} border-gray-300`}
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e")',
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '12px',
                }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Description – REQUIRED */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Describe the highlights and unique features of this package..."
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none placeholder-gray-400 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
          </div>

          {/* Package Includes */}
          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">Package Includes</label>
            <div className="space-y-3">
              {Object.keys(INCLUDE_LABELS).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition select-none"
                >
                  <input
                    type="checkbox"
                    checked={!!formData.includes?.[key]}
                    onChange={(e) => handleIncludesToggle(key, e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="flex-1 text-sm font-medium text-gray-800">{INCLUDE_LABELS[key]}</span>
                  {formData.includes?.[key] && (
                    <input
                      type="text"
                      value={formData.includes[key]}
                      onChange={(e) => handleIncludesDetail(key, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Details..."
                      className="w-32 text-xs text-gray-600 border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-0.5 placeholder-gray-400"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between items-center pt-6 mt-10 border-t border-gray-200">
        <button
          type="button"
          disabled
          className="px-6 py-3 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-8 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        >
          Next
        </button>
      </div>
    </form>
  );
}