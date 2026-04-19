import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserPlus } from "lucide-react";
import TabNavigation from "../../components/user/TabNavigation";
import SearchBar from "../../components/user/SearchBar";
import FilterDropdown from "../../components/user/FilterDropdown";
import UserTable from "../../components/user/UserTable";
import RoleCard from "../../components/user/RoleCard";
import AddEditUserModal from "../../components/user/AddEditUserModal";
import AddEditRoleModal from "../../components/user/AddEditRoleModal";
import DeleteConfirmModal from "../../components/user/DeleteConfirmModal";

// Redux actions and selectors
import {
  fetchUsersAsync,
  createUserAsync,
  updateUserAsync,
  deleteUserAsync,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersSuccess,
  clearUserError,
  clearUserSuccess,
} from "../../store/slices/userSlice";

import {
  fetchRolesAsync,
  createRoleAsync,
  updateRoleAsync,
  deleteRoleAsync,
  selectRoles,
  selectRolesLoading,
  selectRolesError,
  selectRolesSuccess,
  clearRoleError,
  clearRoleSuccess,
} from "../../store/slices/roleSlice";

const UsersPage = () => {
  const dispatch = useDispatch();

  // Redux state
  const users = useSelector(selectUsers);
  const roles = useSelector(selectRoles);
  const usersLoading = useSelector(selectUsersLoading);
  const rolesLoading = useSelector(selectRolesLoading);
  const usersError = useSelector(selectUsersError);
  const rolesError = useSelector(selectRolesError);
  const usersSuccess = useSelector(selectUsersSuccess);
  const rolesSuccess = useSelector(selectRolesSuccess);

  // Local state
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, item: null });
  const [roleDeleteGuardError, setRoleDeleteGuardError] = useState("");

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchUsersAsync());
    dispatch(fetchRolesAsync());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (usersSuccess) {
      console.log(usersSuccess);
      setTimeout(() => dispatch(clearUserSuccess()), 3000);
    }
    if (usersError) {
      console.error(usersError);
      setTimeout(() => dispatch(clearUserError()), 5000);
    }
  }, [usersSuccess, usersError, dispatch]);

  useEffect(() => {
    if (rolesSuccess) {
      console.log(rolesSuccess);
      setTimeout(() => dispatch(clearRoleSuccess()), 3000);
    }
    if (rolesError) {
      console.error(rolesError);
      setTimeout(() => dispatch(clearRoleError()), 5000);
    }
  }, [rolesSuccess, rolesError, dispatch]);

  // Calculate roles with user counts
  const rolesWithCounts = roles.map((role) => ({
    ...role,
    userCount: users.filter(
      (user) => user.companyRoles?.[0]?.role?.name === role.name,
    ).length,
  }));

  const getRoleName = (user) => {
    return user.companyRoles?.[0]?.role?.name || "No Role";
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "active" && user.isVerified) ||
      (statusFilter === "inactive" && !user.isVerified);

    const roleName = getRoleName(user);
    const matchesRole = roleFilter === "All Roles" || roleName === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const uniqueRoles = [
    "All Roles",
    ...new Set(users.map((user) => getRoleName(user))),
  ];

  // ===== USER HANDLERS =====
  const handleAddUser = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setDeleteTarget({ type: "user", item: user });
    setDeleteModalOpen(true);
  };

  const handleSaveUser = async (userData, userId) => {
    try {
      if (userId) {
        await dispatch(updateUserAsync({ userId, userData })).unwrap();
      } else {
        await dispatch(createUserAsync(userData)).unwrap();
      }
      setUserModalOpen(false);
      setSelectedUser(null);
      dispatch(fetchUsersAsync());
    } catch (error) {
      throw error;
    }
  };

  // ===== ROLE HANDLERS =====
  const handleAddRole = () => {
    setSelectedRole(null);
    setRoleModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setRoleModalOpen(true);
  };

  const handleDeleteRole = (role) => {
    if (roles.length <= 1) {
      setRoleDeleteGuardError(
        "At least one role must remain. You cannot delete the last role.",
      );
      return;
    }

    if (roleDeleteGuardError) {
      setRoleDeleteGuardError("");
    }

    setDeleteTarget({ type: "role", item: role });
    setDeleteModalOpen(true);
  };

  const handleSaveRole = async (roleData, roleId) => {
    try {
      if (roleId) {
        await dispatch(updateRoleAsync({ roleId, roleData })).unwrap();
      } else {
        await dispatch(createRoleAsync(roleData)).unwrap();
      }
      setRoleModalOpen(false);
      setSelectedRole(null);
      dispatch(fetchRolesAsync());
    } catch (error) {
      throw error;
    }
  };

  // ===== DELETE HANDLER =====
  const handleConfirmDelete = async () => {
    const { type, item } = deleteTarget;

    try {
      if (type === "user") {
        await dispatch(deleteUserAsync(item.id)).unwrap();
        dispatch(fetchUsersAsync());
      } else {
        if (roles.length <= 1) {
          setRoleDeleteGuardError(
            "At least one role must remain. You cannot delete the last role.",
          );
          setDeleteModalOpen(false);
          setDeleteTarget({ type: null, item: null });
          return;
        }
        await dispatch(deleteRoleAsync(item.id)).unwrap();
        dispatch(fetchRolesAsync());
      }
      setDeleteModalOpen(false);
      setDeleteTarget({ type: null, item: null });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const loading = usersLoading || rolesLoading;

  if (loading && users.length === 0 && roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Error Messages */}
      {(usersError || rolesError || roleDeleteGuardError) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {roleDeleteGuardError || usersError || rolesError}
          </p>
        </div>
      )}

      {/* Success Messages */}
      {(usersSuccess || rolesSuccess) && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">
            {usersSuccess || rolesSuccess}
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-4">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Users Tab Content */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 border-b border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  User Directory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage users, access roles, and account status
                </p>
              </div>
              <button
                onClick={handleAddUser}
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 h-10 rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
                disabled={usersLoading}
              >
                <UserPlus size={16} />
                Add New User
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-2.5 md:items-center">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search users by name or email..."
              />

              <FilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={["All Status", "active", "inactive"]}
              />

              <FilterDropdown
                value={roleFilter}
                onChange={setRoleFilter}
                options={uniqueRoles}
              />
            </div>
          </div>

          {/* Users Table */}
          <UserTable
            users={filteredUsers}
            onEdit={handleEditUser}
            onChangeRole={handleChangeRole}
            onDelete={handleDeleteUser}
          />
        </div>
      )}

      {/* Roles Tab Content */}
      {activeTab === "roles" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Role Management
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define permissions and manage role assignments
              </p>
            </div>
            <button
              onClick={handleAddRole}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 h-10 rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold"
              disabled={rolesLoading}
            >
              <UserPlus size={16} />
              Add New Role
            </button>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {rolesWithCounts.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
                canDelete={roles.length > 1}
              />
            ))}
          </div>

          {roles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No roles found</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddEditUserModal
        isOpen={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <AddEditRoleModal
        isOpen={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
        onSave={handleSaveRole}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget({ type: null, item: null });
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteTarget.type === "user" ? "User" : "Role"}`}
        message={`Are you sure you want to delete ${
          deleteTarget.type === "user"
            ? `${deleteTarget.item?.firstName} ${deleteTarget.item?.lastName}`
            : deleteTarget.item?.name
        }? This action cannot be undone.`}
        itemName={
          deleteTarget.type === "user"
            ? `${deleteTarget.item?.firstName} ${deleteTarget.item?.lastName}`
            : deleteTarget.item?.name
        }
      />
    </div>
  );
};

export default UsersPage;
