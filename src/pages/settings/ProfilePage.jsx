import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectUser, setUser } from "../../store/slices/authSlice";
import { getMyProfile, updateMyProfile } from "../../api/settingsService";

const STORAGE_KEY = "swiftrip_profile_settings";

const loadStoredProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialProfile = useMemo(() => {
    const stored = loadStoredProfile();
    return {
      firstName: stored.firstName || user?.firstName || "",
      lastName: stored.lastName || user?.lastName || "",
      email: user?.email || "",
      phone: stored.phone || "",
      timezone: stored.timezone || "Asia/Karachi",
      bio: stored.bio || "",
    };
  }, [user]);

  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getMyProfile();
        const data = response?.data || {};

        if (!isMounted) return;

        setProfile((prev) => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          email: data.email || prev.email,
        }));
      } catch (error) {
        if (!isMounted) return;
        toast.error(error.message || "Failed to load profile");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }

    const payload = {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      email: profile.email,
      phone: profile.phone.trim(),
      timezone: profile.timezone,
      bio: profile.bio.trim(),
    };

    const persist = async () => {
      try {
        setSaving(true);

        const response = await updateMyProfile({
          firstName: payload.firstName,
          lastName: payload.lastName,
        });

        const updatedUser = response?.data || payload;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

        dispatch(
          setUser({
            ...user,
            firstName: updatedUser.firstName || payload.firstName,
            lastName: updatedUser.lastName || payload.lastName,
            fullName: `${updatedUser.firstName || payload.firstName} ${updatedUser.lastName || payload.lastName}`,
            email: updatedUser.email || payload.email,
            companyId: updatedUser.companyId || user?.companyId,
            role: updatedUser.role || user?.role,
          }),
        );

        toast.success("Profile settings saved.");
      } catch (error) {
        toast.error(error.message || "Failed to save profile settings");
      } finally {
        setSaving(false);
      }
    };

    persist();
  };

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Profile Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update your account details for the agency workspace.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              First Name
            </label>
            <input
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              disabled={loading || saving}
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Last Name
            </label>
            <input
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              disabled={loading || saving}
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              name="email"
              value={profile.email}
              disabled
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Phone
            </label>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={loading || saving}
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              placeholder="+92 300 1234567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Timezone
          </label>
          <select
            name="timezone"
            value={profile.timezone}
            onChange={handleChange}
            disabled={loading || saving}
            className="enterprise-select w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
          >
            <option value="Asia/Karachi">Asia/Karachi</option>
            <option value="Asia/Dubai">Asia/Dubai</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bio
          </label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            disabled={loading || saving}
            rows={4}
            className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            placeholder="Tell your team about your role and focus areas"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200/80">
          <button
            type="submit"
            disabled={loading || saving}
            className="h-10 px-5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </section>
  );
}
