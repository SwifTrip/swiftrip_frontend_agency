import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectUser } from "../../store/slices/authSlice";
import {
  getMyCompanySettings,
  updateMyCompanySettings,
} from "../../api/settingsService";

const STORAGE_KEY = "swiftrip_company_settings";

const loadStoredCompany = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function CompanySettingsPage() {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const initialCompany = useMemo(() => {
    const stored = loadStoredCompany();
    return {
      companyName: stored.companyName || "SwifTrip Agency",
      registrationNumber: stored.registrationNumber || "",
      supportEmail: stored.supportEmail || user?.email || "",
      supportPhone: stored.supportPhone || "",
      address: stored.address || "",
      notificationsEnabled: stored.notificationsEnabled ?? true,
      autoApproveBookings: stored.autoApproveBookings ?? false,
      defaultCurrency: stored.defaultCurrency || "PKR",
    };
  }, [user?.email]);

  const [settings, setSettings] = useState(initialCompany);

  useEffect(() => {
    let isMounted = true;

    const loadCompanySettings = async () => {
      try {
        setLoading(true);
        const response = await getMyCompanySettings();
        const data = response?.data || {};

        if (!isMounted) return;

        setSettings((prev) => ({
          ...prev,
          companyName: data.name || prev.companyName,
          registrationNumber:
            data.registrationNumber || prev.registrationNumber,
        }));
      } catch (error) {
        if (!isMounted) return;
        toast.error(error.message || "Failed to load company settings");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCompanySettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!settings.companyName.trim()) {
      toast.error("Company name is required.");
      return;
    }

    if (!settings.supportEmail.trim()) {
      toast.error("Support email is required.");
      return;
    }

    const payload = {
      ...settings,
      companyName: settings.companyName.trim(),
      registrationNumber: settings.registrationNumber.trim(),
      supportEmail: settings.supportEmail.trim(),
      supportPhone: settings.supportPhone.trim(),
      address: settings.address.trim(),
    };

    const persist = async () => {
      try {
        setSaving(true);

        await updateMyCompanySettings({
          name: payload.companyName,
          registrationNumber: payload.registrationNumber,
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        toast.success("Company settings saved.");
      } catch (error) {
        toast.error(error.message || "Failed to save company settings");
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
          Company Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage agency identity, contact channels, and booking preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company Name
            </label>
            <input
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              disabled={loading || saving}
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Registration Number
            </label>
            <input
              name="registrationNumber"
              value={settings.registrationNumber}
              onChange={handleChange}
              disabled={loading || saving}
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              placeholder="REG-123456"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Support Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              disabled={loading || saving}
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              placeholder="support@agency.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Support Phone
            </label>
            <input
              name="supportPhone"
              value={settings.supportPhone}
              onChange={handleChange}
              disabled={loading || saving}
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
              placeholder="+92 300 1234567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Address
          </label>
          <textarea
            name="address"
            value={settings.address}
            onChange={handleChange}
            disabled={loading || saving}
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            placeholder="Office address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Default Currency
            </label>
            <select
              name="defaultCurrency"
              value={settings.defaultCurrency}
              onChange={handleChange}
              disabled={loading || saving}
              className="enterprise-select w-full h-10 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            >
              <option value="PKR">PKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={handleChange}
                disabled={loading || saving}
                className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              Enable booking notifications
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="autoApproveBookings"
                checked={settings.autoApproveBookings}
                onChange={handleChange}
                disabled={loading || saving}
                className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              Auto-approve new bookings
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200/80">
          <button
            type="submit"
            disabled={loading || saving}
            className="h-10 px-5 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            {saving ? "Saving..." : "Save Company Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}
