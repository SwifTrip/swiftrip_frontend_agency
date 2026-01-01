import React, { useState } from "react";
import { Shield, Edit2, Trash2, Check, X } from "lucide-react";

const RoleCard = ({ role, onEdit, onDelete }) => {
  const [showAll, setShowAll] = useState(false);

  // Count of users
  const getUserCount = () => role.userCount || 0;

  // Capitalize first letter of each word
  const formatLabel = (label) =>
    label
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Generate permission list dynamically
  const getPermissionsList = () => {
    if (!role.permissions || role.permissions.length === 0) return [];

    return role.permissions.map((p) => ({
      label: formatLabel(p.permission.action),
      hasPermission: true,
    }));
  };

  const permissions = getPermissionsList();

  // Limit for initial display
  const visiblePermissions = showAll ? permissions : permissions.slice(0, 5);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <Shield className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {role.description ||
                (role.name === "Admin"
                  ? "Full system access and management"
                  : role.name === "Manager"
                  ? "Department management and oversight"
                  : "Basic operational access")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(role)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* User Count */}
      <div className="text-sm text-gray-500 mb-4">
        {getUserCount()} {getUserCount() === 1 ? "user" : "users"}
      </div>

      {/* Permissions */}
      <div>
        <p className="text-sm font-medium text-gray-900 mb-3">Permissions:</p>
        <div className="space-y-2">
          {visiblePermissions.map((permission, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="text-green-600" size={16} />
              <span className="text-gray-700">{permission.label}</span>
            </div>
          ))}
        </div>

        {/* Show all / Show less toggle */}
        {permissions.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 text-sm text-orange-600 hover:underline"
          >
            {showAll ? "Show less" : `View all (${permissions.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoleCard;
