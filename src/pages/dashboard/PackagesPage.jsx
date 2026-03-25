import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PackageCard from "../../components/dashboard/PackageCard";
import ConfirmModal from "../../components/package/ConfirmModal";
import {
  fetchPackages,
  deletePackage,
  selectPackages,
  selectPackageLoading,
  selectPackageError,
} from "../../store/slices/packageSlice";

export default function PackagesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const packages = useSelector(selectPackages);
  const loading = useSelector(selectPackageLoading);
  const error = useSelector(selectPackageError);

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Fetch packages on component mount
  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Filter packages based on search and filters
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All Categories" || pkg.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All Status" || pkg.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (id) => {
    navigate(`/app/packages/edit/${id}`);
  };

  const handleDelete = async (id) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await dispatch(deletePackage(pendingDeleteId)).unwrap();
      toast.success("Package deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete package: ${error}`);
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      <ConfirmModal
        open={confirmOpen}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-5 overflow-x-hidden">
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-2.5 md:items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search packages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50/70 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 text-slate-800"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="enterprise-select h-10 w-full md:w-auto md:min-w-[160px] px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 text-slate-700"
          >
            <option>All Categories</option>
            <option>ADVENTURE</option>
            <option>CULTURAL</option>
            <option>FAMILY</option>
            <option>LUXURY</option>
            <option>RELIGIOUS</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="enterprise-select h-10 w-full md:w-auto md:min-w-[140px] px-3 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 text-slate-700"
          >
            <option>All Status</option>
            <option>ACTIVE</option>
            <option>DRAFT</option>
            <option>INACTIVE</option>
          </select>

          <button
            onClick={() => navigate("/app/packages/create")}
            className="inline-flex h-10 w-full md:w-auto md:min-w-[165px] items-center justify-center gap-1.5 px-4 text-sm bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-sm hover:shadow md:ml-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Package
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* Packages Grid */}
      {!loading && filteredPackages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
          {filteredPackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              {...pkg}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {searchQuery ||
            categoryFilter !== "All Categories" ||
            statusFilter !== "All Status"
              ? "No packages found"
              : "No packages yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ||
            categoryFilter !== "All Categories" ||
            statusFilter !== "All Status"
              ? "Try adjusting your filters"
              : "Get started by creating your first package"}
          </p>
          {!searchQuery &&
            categoryFilter === "All Categories" &&
            statusFilter === "All Status" && (
              <button
                onClick={() => navigate("/app/packages/create")}
                className="px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
              >
                Create Package
              </button>
            )}
        </div>
      )}
    </>
  );
}
