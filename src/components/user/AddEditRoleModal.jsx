import React, { useState, useEffect, useMemo } from "react";
import Modal from "./Modal";
import { Check } from "lucide-react";
import { fetchPermissions } from "../../api/roleService.js";

const AddEditRoleModal = ({ isOpen, onClose, role, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionCategories, setPermissionCategories] = useState([]);

  const idToAction = useMemo(() => {
    const map = new Map();
    permissionCategories.forEach((category) => {
      category.permissions.forEach((permission) => {
        map.set(permission.id, permission.action);
      });
    });
    return map;
  }, [permissionCategories]);

  const actionToId = useMemo(() => {
    const map = new Map();
    permissionCategories.forEach((category) => {
      category.permissions.forEach((permission) => {
        map.set(permission.action, permission.id);
      });
    });
    return map;
  }, [permissionCategories]);

  // Fetch permissions from API
  useEffect(() => {
    if (isOpen) {
      loadPermissions();
    }
  }, [isOpen]);

  const loadPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const response = await fetchPermissions();

      // Handle different response structures
      const permissions = response.data || response.permissions || [];

      // Group permissions by category
      const grouped = groupPermissionsByCategory(permissions);
      setPermissionCategories(grouped);
    } catch (error) {
      console.error("Failed to load permissions:", error);
      // Fallback to static permissions if API fails
      setPermissionCategories(getStaticPermissions());
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Group permissions by prefix (PACKAGE_, USER_, ROLE_)
  const groupPermissionsByCategory = (permissions) => {
    const categories = {
      PACKAGE: { name: "Packages", permissions: [] },
      USER: { name: "Users", permissions: [] },
      ROLE: { name: "Roles", permissions: [] },
    };

    permissions.forEach((perm) => {
      const action = perm.action || perm.name || "";

      if (action.startsWith("PACKAGE_")) {
        categories.PACKAGE.permissions.push({
          id: perm.id,
          action: action,
          label: formatPermissionLabel(action),
        });
      } else if (action.startsWith("USER_")) {
        categories.USER.permissions.push({
          id: perm.id,
          action: action,
          label: formatPermissionLabel(action),
        });
      } else if (action.startsWith("ROLE_")) {
        categories.ROLE.permissions.push({
          id: perm.id,
          action: action,
          label: formatPermissionLabel(action),
        });
      }
    });

    return Object.values(categories).filter(
      (cat) => cat.permissions.length > 0,
    );
  };

  // Format permission action to readable label
  const formatPermissionLabel = (action) => {
    return action
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Static fallback permissions
  const getStaticPermissions = () => [
    {
      name: "Packages",
      permissions: [
        { id: 1, action: "PACKAGE_VIEW", label: "View Packages" },
        { id: 2, action: "PACKAGE_CREATE", label: "Create Packages" },
        { id: 3, action: "PACKAGE_UPDATE", label: "Update Packages" },
        { id: 4, action: "PACKAGE_DELETE", label: "Delete Packages" },
      ],
    },
    {
      name: "Users",
      permissions: [
        { id: 5, action: "USER_VIEW", label: "View Users" },
        { id: 6, action: "USER_CREATE", label: "Create Users" },
        { id: 7, action: "USER_UPDATE", label: "Update Users" },
        { id: 8, action: "USER_DELETE", label: "Delete Users" },
      ],
    },
    {
      name: "Roles",
      permissions: [
        { id: 9, action: "ROLE_VIEW", label: "View Roles" },
        { id: 10, action: "ROLE_CREATE", label: "Create Roles" },
        { id: 11, action: "ROLE_UPDATE", label: "Update Roles" },
        { id: 12, action: "ROLE_DELETE", label: "Delete Roles" },
      ],
    },
  ];

  useEffect(() => {
    if (role) {
      // Edit mode
      const selectedPermissions =
        role.permissions?.map((p) => p.permissionId || p.id) || [];
      setFormData({
        name: role.name || "",
        description: role.description || "",
        permissions: selectedPermissions,
      });
    } else {
      // Add mode
      setFormData({
        name: "",
        description: "",
        permissions: [],
      });
    }
    setErrors({});
  }, [role, isOpen]);

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

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => {
      const nextPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId];

      const permissionSet = new Set(nextPermissions);

      // Rule: if CREATE/UPDATE/DELETE is selected, VIEW must also be selected.
      [...permissionSet].forEach((id) => {
        const action = idToAction.get(id);
        if (!action) return;

        const match = action.match(/^(.*)_(CREATE|UPDATE|DELETE)$/);
        if (!match) return;

        const resource = match[1];
        const viewId = actionToId.get(`${resource}_VIEW`);
        if (viewId) {
          permissionSet.add(viewId);
        }
      });

      return {
        ...prev,
        permissions: [...permissionSet],
      };
    });
  };

  const handleSelectAllInCategory = (category) => {
    const categoryPermissionIds = category.permissions.map((p) => p.id);
    const allSelected = categoryPermissionIds.every((id) =>
      formData.permissions.includes(id),
    );

    if (allSelected) {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter(
          (id) => !categoryPermissionIds.includes(id),
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: [
          ...new Set([...prev.permissions, ...categoryPermissionIds]),
        ],
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = "Please select at least one permission";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        permissionIds: formData.permissions,
      };
      await onSave(payload, role?.id);
      onClose();
    } catch (error) {
      console.error("Error saving role:", error);
      setErrors({
        submit: error.message || "Failed to save role. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isCategoryFullySelected = (category) => {
    return category.permissions.every((p) =>
      formData.permissions.includes(p.id),
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? "Edit Role" : "Add New Role"}
      subtitle={
        role
          ? "Update role and permissions"
          : "Create a new role with permissions"
      }
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mt-1">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full h-10 px-3 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-colors ${
                errors.name ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
              placeholder="e.g., Manager, Staff"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-colors resize-none"
              placeholder="Brief description of this role"
            />
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Permissions <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Selecting Create, Update, or Delete automatically includes View.
            </p>

            {permissionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-slate-600">
                  Loading permissions...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {permissionCategories.map((category) => (
                  <div
                    key={category.name}
                    className="border border-slate-200/80 rounded-lg p-3.5 bg-slate-50/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {category.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleSelectAllInCategory(category)}
                        className="text-xs font-semibold text-orange-700 hover:text-orange-800"
                      >
                        {isCategoryFullySelected(category)
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {category.permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-2 cursor-pointer group rounded-md px-2 py-1.5 hover:bg-slate-50"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(
                                permission.id,
                              )}
                              onChange={() =>
                                handlePermissionToggle(permission.id)
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                                formData.permissions.includes(permission.id)
                                  ? "bg-orange-600 border-orange-600"
                                  : "border-slate-300 group-hover:border-orange-400"
                              }`}
                            >
                              {formData.permissions.includes(permission.id) && (
                                <Check className="text-white" size={14} />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">
                            {permission.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {permissionCategories.length === 0 && !permissionsLoading && (
                  <div className="text-center py-8 text-slate-500">
                    No permissions available
                  </div>
                )}
              </div>
            )}

            {errors.permissions && (
              <p className="mt-2 text-xs text-red-600">{errors.permissions}</p>
            )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>

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
            disabled={loading || permissionsLoading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : role ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditRoleModal;
