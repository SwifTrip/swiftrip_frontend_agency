import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Calendar, Edit2, Trash2, CheckCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";
import SchedulePicker from "../../components/schedules/SchedulePicker";
import ScheduleForm from "../../components/schedules/ScheduleForm";
import * as scheduleApi from "../../api/scheduleApi";
import { getPackageById } from "../../api/packageApi";

/**
 * PackageSchedules Page
 * Manage departure schedules for a package
 */
const PackageSchedules = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all"); // all, published, draft

  useEffect(() => {
    loadData();
  }, [packageId, filter]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load package details
      const pkgResponse = await getPackageById(packageId);
      setPackageData(pkgResponse.data);

      // Load schedules
      const filters = {};
      if (filter !== "all") {
        filters.status = filter.toUpperCase();
      }
      const schedResponse = await scheduleApi.getPackageSchedules(
        packageId,
        filters
      );
      setSchedules(schedResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedules = async (data) => {
    try {
      await scheduleApi.createSchedules(packageId, data);
      setShowForm(false);
      loadData();
      toast.success("Schedules created successfully!");
    } catch (error) {
      console.error("Error creating schedules:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create schedules. Please try again."
      );
    }
  };

  const handlePublish = async (scheduleId) => {
    if (
      !confirm("Publish this schedule? It will become available for booking.")
    )
      return;

    try {
      await scheduleApi.publishSchedule(scheduleId);
      loadData();
      toast.success("Schedule published successfully!");
    } catch (error) {
      console.error("Error publishing schedule:", error);
      toast.error(
        error.response?.data?.message || "Failed to publish schedule."
      );
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!confirm("Delete this schedule? This cannot be undone.")) return;

    try {
      await scheduleApi.deleteSchedule(scheduleId);
      loadData();
      toast.success("Schedule deleted successfully!");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete schedule. It may have active bookings."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-2"
        >
          ← Back to Package
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Departure Schedules
            </h1>
            <p className="text-gray-600">{packageData?.title}</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Schedules
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Schedules</div>
          <div className="text-2xl font-bold text-gray-900">
            {schedules.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Published</div>
          <div className="text-2xl font-bold text-green-600">
            {schedules.filter((s) => s.status === "PUBLISHED").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Available Seats</div>
          <div className="text-2xl font-bold text-blue-600">
            {schedules.reduce((sum, s) => sum + (s.seatsAvailable || 0), 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
          <div className="text-2xl font-bold text-purple-600">
            {schedules.reduce((sum, s) => sum + (s._count?.bookings || 0), 0)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex gap-2">
            {["all", "published", "draft"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {schedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No schedules found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create departure schedules to start accepting bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <SchedulePicker
              schedules={schedules}
              showBooking={true}
              onSelect={() => {}} // View only mode
            />

            {/* Action buttons for each schedule */}
            <div className="mt-6 space-y-2">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(schedule.departureDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.seatsAvailable} / {schedule.seatsTotal} seats
                        • {schedule._count?.bookings || 0} booking(s)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {schedule.status === "DRAFT" && (
                      <button
                        onClick={() => handlePublish(schedule.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Publish
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/schedules/${schedule.id}`)}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowForm(false)}
          />
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ScheduleForm
              packageData={packageData}
              onSubmit={handleCreateSchedules}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageSchedules;
