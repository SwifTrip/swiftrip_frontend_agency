import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const UserTable = ({ users, onEdit, onChangeRole, onDelete }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const getRoleName = (user) => {
    return user.companyRoles?.[0]?.role?.name || "No Role";
  };

  const getRoleBadgeClass = (roleName) => {
    const roleMap = {
      Admin: "bg-violet-100 text-violet-700",
      Manager: "bg-orange-100 text-orange-700",
      Staff: "bg-slate-100 text-slate-700",
    };
    return roleMap[roleName] || "bg-slate-100 text-slate-700";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px]">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em]">
              Name
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em]">
              Email
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em]">
              Role
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em]">
              Status
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em]">
              Last Login
            </th>
            <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-[0.05em]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200/80">
          {users.map((user) => {
            const roleName = getRoleName(user);
            return (
              <tr
                key={user.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-semibold text-xs">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-600">
                  {user.email}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${getRoleBadgeClass(
                      roleName,
                    )}`}
                  >
                    {roleName}
                  </span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                      user.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.isVerified ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-sm text-slate-600">
                  {formatDate(user.updatedAt)}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center justify-center p-2 text-orange-700 border border-orange-200 hover:bg-orange-50 rounded-md transition-colors"
                      title="Edit user"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="inline-flex items-center justify-center p-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
