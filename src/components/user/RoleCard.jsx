import React, { useState } from "react";
import { Shield, Edit2, Trash2, Check } from "lucide-react";

const RoleCard = ({ role, onEdit, onDelete, canDelete = true }) => {
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
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
            <Shield className="text-orange-600" size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {role.name}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
              {role.description ||
                (role.name === "Admin"
                  ? "Full system access and management"
                  : role.name === "Manager"
                    ? "Department management and oversight"
                    : "Basic operational access")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-orange-700 border border-orange-200 hover:bg-orange-50 rounded-md transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(role)}
            className={`p-2 border rounded-md transition-colors ${
              canDelete
                ? "text-red-600 border-red-200 hover:bg-red-50"
                : "text-slate-300 border-slate-200 bg-slate-50 cursor-not-allowed"
            }`}
            disabled={!canDelete}
            title={canDelete ? "Delete role" : "At least one role must remain"}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* User Count */}
      <div className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 mb-4">
        {getUserCount()} {getUserCount() === 1 ? "user" : "users"}
      </div>

      {/* Permissions */}
      <div>
        <p className="text-sm font-semibold text-slate-800 mb-3">Permissions</p>
        <div className="space-y-2">
          {visiblePermissions.map((permission, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Check className="text-emerald-600" size={15} />
              <span className="text-slate-700">{permission.label}</span>
            </div>
          ))}
        </div>

        {/* Show all / Show less toggle */}
        {permissions.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 text-xs font-semibold text-orange-700 hover:text-orange-800"
          >
            {showAll ? "Show less" : `View all (${permissions.length})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoleCard;
