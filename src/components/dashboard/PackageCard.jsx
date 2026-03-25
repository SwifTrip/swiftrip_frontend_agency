import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deletePackage } from "../../store/slices/packageSlice";
import { toast } from "react-toastify";
import ConfirmModal from "../package/ConfirmModal";

export default function PackageCard({
  id,
  title,
  description,
  images = [],
  status,
  category,
  price,
  maxGroupSize,
  totalDays,
  company,
  createdAt,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    INACTIVE: "bg-gray-100 text-gray-700",
  };

  const imageUrl =
    images && images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";

  // Format price
  const formattedPrice = price?.amount?.toLocaleString() || "0";
  const currency = price?.currency === "PKR" ? "PKR" : "USD";
  const normalizedCategory =
    category?.charAt(0)?.toUpperCase() + (category?.slice(1) || "General");
  const createdDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // Handle view click
  const handleViewClick = () => {
    navigate(`${id}`);
  };

  // Handle delete with confirmation
  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deletePackage(id)).unwrap();
      toast.success("Package deleted successfully!");
      if (onDelete) onDelete(id);
    } catch (error) {
      toast.error(error || "Failed to delete package");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="group h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200/80 hover:border-slate-300/80">
      <ConfirmModal
        open={confirmOpen}
        title="Delete Package"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={isDeleting}
      />

      {/* Image */}
      <div className="relative h-36 sm:h-40 overflow-hidden border-b border-slate-200/70">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-slate-900/10 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
              statusColors[status] || statusColors.DRAFT
            } shadow-sm`}
          >
            {status === "ACTIVE"
              ? "Active"
              : status === "DRAFT"
                ? "Draft"
                : "Inactive"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
            {title}
          </h3>
          <span className="inline-flex shrink-0 px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md uppercase tracking-[0.03em]">
            {normalizedCategory}
          </span>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 min-h-[38px] mb-2.5">
          {description || "No description provided for this package yet."}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
            <p className="text-[10px] uppercase tracking-[0.05em] text-slate-500">
              Duration
            </p>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              {totalDays || 0} days
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
            <p className="text-[10px] uppercase tracking-[0.05em] text-slate-500">
              Group
            </p>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              Max {maxGroupSize || 0}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 px-2.5 py-2">
            <p className="text-[10px] uppercase tracking-[0.05em] text-slate-500">
              Created
            </p>
            <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
              {createdDate}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-orange-200/70 bg-orange-50/50 px-3 py-2 mb-3">
          <p className="text-[10px] uppercase tracking-[0.05em] text-slate-500 mb-0.5">
            Price
          </p>
          <p className="text-lg font-bold text-orange-700 leading-none">
            {currency} {formattedPrice}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">per person</p>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 mt-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleViewClick}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              disabled={isDeleting}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </button>

            <button
              onClick={() => onEdit && onEdit(id)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
              disabled={isDeleting}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </div>

          <button
            onClick={handleDeleteClick}
            className={`inline-flex items-center justify-center p-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Delete"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
