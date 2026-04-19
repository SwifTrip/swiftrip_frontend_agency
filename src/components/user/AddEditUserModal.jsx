import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { User, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { fetchRoles } from "../../api/roleService";

const AddEditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleId: "",
  });
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch roles when modal opens
  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await fetchRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error("Failed to load roles:", error);
      setErrors({
        submit: "Failed to load roles. Please refresh and try again.",
      });
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        password: "",
        roleId: user.companyRoles?.[0]?.roleId || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        roleId: "",
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!user && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!user && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // Build payload exactly matching your backend API
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: user?.email || formData.email.trim(),
        roleId: parseInt(formData.roleId),
      };

      // Add optional phone number if provided
      if (formData.phoneNumber && formData.phoneNumber.trim()) {
        payload.phoneNumber = formData.phoneNumber.trim();
      }

      // Only include password for new users
      if (!user && formData.password) {
        payload.password = formData.password;
      }

      console.log("Submitting payload:", payload); // Debug log

      await onSave(payload, user?.id);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      setErrors({
        submit:
          error.message ||
          error?.error ||
          "Failed to save user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFullNameChange = (e) => {
    const fullName = e.target.value;
    const parts = fullName.trim().split(" ");

    if (parts.length === 1) {
      setFormData((prev) => ({
        ...prev,
        firstName: parts[0],
        lastName: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
      }));
    }

    if (errors.fullName) {
      setErrors((prev) => ({ ...prev, fullName: "" }));
    }
  };

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Add New User"}
      subtitle={
        user ? "Update user account information" : "Create a new user account"
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-1">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full h-10 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm border rounded-lg bg-white focus:outline-none 
            focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-colors ${
              errors.firstName ? "border-red-300 bg-red-50" : "border-slate-300"
            }`}
              placeholder="e.g. John"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1.5 text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full h-10 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm border rounded-lg bg-white focus:outline-none 
            focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-colors ${
              errors.lastName ? "border-red-300 bg-red-50" : "border-slate-300"
            }`}
              placeholder="e.g. Carter"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1.5 text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-10 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-colors ${
                errors.email ? "border-red-300 bg-red-50" : "border-slate-300"
              } ${user ? "bg-slate-100 cursor-not-allowed" : ""}`}
              placeholder={
                user
                  ? "Email cannot be changed"
                  : "e.g. john.carter@company.com"
              }
              disabled={!!user}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
              placeholder="Enter phone number"
            />
          </div>
        </div> */}

        {/* Password (only for new users) */}
        {!user && (
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full h-10 px-3 pr-10 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-colors ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-slate-300"
                }`}
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
        )}

        {/* Role - Dynamic Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1.5">
            Role <span className="text-red-500">*</span>
          </label>
          {rolesLoading ? (
            <div className="w-full h-10 px-4 border border-slate-300 rounded-lg bg-white flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm text-slate-500">Loading roles...</span>
            </div>
          ) : (
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className={`w-full h-10 px-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-colors appearance-none ${
                errors.roleId ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
              }}
            >
              <option value="">Choose a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          )}
          {errors.roleId && (
            <p className="mt-1.5 text-xs text-red-600">{errors.roleId}</p>
          )}
          {roles.length === 0 && !rolesLoading && (
            <p className="mt-1.5 text-xs text-slate-500">
              No roles available. Please create a role first.
            </p>
          )}
        </div>

        {/* Status - Display Only */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Status
          </label>
          <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed">
            Active
          </div>
          <p className="mt-1.5 text-xs text-gray-500">Status will be set automatically</p>
        </div> */}

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 h-10 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 h-10 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold text-sm"
            disabled={loading || rolesLoading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : user ? (
              "Save Changes"
            ) : (
              "Add User"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditUserModal;
