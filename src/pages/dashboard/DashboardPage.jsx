import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { getDashboardAnalytics } from "../../api/dashboardService";

const currency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const pct = (value) => `${Number(value || 0).toFixed(1)}%`;

const statusBadgeClass = {
  CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  COMPLETED: "bg-teal-100 text-teal-800 border-teal-200",
  HELD: "bg-amber-100 text-amber-800 border-amber-200",
  CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
  EXPIRED: "bg-slate-100 text-slate-700 border-slate-200",
};

const sourceColor = {
  public: "#14b8a6",
  private: "#f97316",
  pending: "#0f172a",
  refunded: "#475569",
};

function MetricCard({ title, value, subtext, icon: Icon, tone = "teal" }) {
  const toneStyles = {
    teal: "from-teal-500/95 to-cyan-500/95 text-white border-teal-300/50",
    slate:
      "from-white to-white text-slate-900 border-slate-200 shadow-sm shadow-slate-100",
    orange:
      "from-orange-500/95 to-amber-500/95 text-white border-orange-300/60",
    navy: "from-slate-900 to-slate-800 text-white border-slate-700",
  };

  const iconTone =
    tone === "slate" ? "bg-slate-100 text-slate-700" : "bg-white/20 text-white";

  return (
    <div
      className={`rounded-2xl border p-5 bg-linear-to-br ${toneStyles[tone]} transition hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] opacity-80">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {subtext && <p className="mt-2 text-sm opacity-90">{subtext}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${iconTone}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function RevenueLineChart({ data }) {
  if (!data.length) {
    return (
      <p className="text-sm text-slate-500">No monthly data available yet.</p>
    );
  }

  const width = 760;
  const height = 250;
  const padding = 28;
  const maxVal = Math.max(...data.map((d) => Math.max(d.actual, d.target)), 1);
  const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

  const y = (val) => height - padding - (val / maxVal) * (height - padding * 2);

  const linePath = (key) =>
    data
      .map(
        (d, i) => `${i === 0 ? "M" : "L"}${padding + i * stepX},${y(d[key])}`,
      )
      .join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const yPos = height - padding - f * (height - padding * 2);
          return (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={yPos}
              x2={width - padding}
              y2={yPos}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
          );
        })}

        <path
          d={linePath("target")}
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
        />
        <path
          d={linePath("actual")}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="2.5"
        />

        {data.map((d, i) => (
          <g key={d.month}>
            <circle
              cx={padding + i * stepX}
              cy={y(d.actual)}
              r="4.5"
              fill="#14b8a6"
            />
            <text
              x={padding + i * stepX}
              y={height - 6}
              textAnchor="middle"
              className="fill-slate-500 text-[11px]"
            >
              {d.month}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 flex items-center gap-6 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2">
          <i className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Actual Revenue
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Target
        </span>
      </div>
    </div>
  );
}

function DailyBars({ data }) {
  const maxBookings = Math.max(...data.map((d) => d.bookings), 1);
  return (
    <div className="space-y-3">
      {data.map((row) => {
        const barPct = Math.max((row.bookings / maxBookings) * 100, 3);
        return (
          <div key={row.day}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
              <span>{row.day}</span>
              <span>
                {row.bookings} bookings · {currency(row.revenue)}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div
                className="h-2.5 rounded-full bg-linear-to-r from-teal-500 to-cyan-500"
                style={{ width: `${barPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DonutSources({ sources }) {
  const total = sources.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  if (!total) {
    return (
      <p className="text-sm text-slate-500">No source distribution yet.</p>
    );
  }

  let progress = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 120 120" className="w-44 h-44">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
        />
        {sources.map((item) => {
          const value = Number(item.amount || 0);
          const segment = (value / total) * circumference;
          const offset = circumference - progress;
          progress += segment;

          return (
            <circle
              key={item.key}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={sourceColor[item.key] || "#94a3b8"}
              strokeWidth="16"
              strokeDasharray={`${segment} ${circumference}`}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              strokeLinecap="butt"
            />
          );
        })}
      </svg>

      <div className="w-full space-y-1.5">
        {sources.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between text-xs text-slate-600"
          >
            <span className="inline-flex items-center gap-2">
              <i
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: sourceColor[s.key] || "#94a3b8" }}
              />
              {s.label}
            </span>
            <span>
              {Number(s.percentage || 0).toFixed(1)}% · {currency(s.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.companyId) {
        setError("Company information is missing for dashboard analytics.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getDashboardAnalytics({
          companyId: user.companyId,
          months: 6,
        });
        setAnalytics(data);
      } catch (err) {
        setError(err?.message || "Failed to load dashboard analytics.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.companyId]);

  const metrics = analytics?.metrics || {};
  const sourceTop = useMemo(() => {
    const first = analytics?.revenueSources?.[0];
    return first
      ? `${first.label} leads at ${pct(first.percentage)}`
      : "No source trends yet";
  }, [analytics?.revenueSources]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading dashboard analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={currency(metrics.totalRevenue)}
          subtext={`${metrics.completedBookings || 0} completed bookings`}
          icon={CurrencyDollarIcon}
          tone="teal"
        />
        <MetricCard
          title="Active Bookings"
          value={String(metrics.activeBookings || 0)}
          subtext={`${metrics.pendingBookings || 0} awaiting confirmation`}
          icon={UserGroupIcon}
          tone="slate"
        />
        <MetricCard
          title="Average Booking Value"
          value={currency(metrics.averageBookingValue)}
          subtext="Based on paid bookings"
          icon={ArrowTrendingUpIcon}
          tone="slate"
        />
        <MetricCard
          title="Conversion Rate"
          value={pct(metrics.conversionRate)}
          subtext={`${metrics.confirmedBookings || 0} confirmed bookings`}
          icon={CheckCircleIcon}
          tone="orange"
        />
      </section>

      {/* <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-2xl font-semibold text-slate-900">
            {metrics.completedBookings || 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="text-2xl font-semibold text-amber-600">
            {metrics.pendingBookings || 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Cancelled</p>
          <p className="text-2xl font-semibold text-rose-600">
            {metrics.cancelledBookings || 0}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Pending Payment</p>
          <p className="text-2xl font-semibold text-slate-900">
            {currency(metrics.pendingAmount)}
          </p>
        </div>
      </section> */}

      {/* <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Revenue Performance
              </h3>
              <p className="text-sm text-slate-500">
                Monthly actual revenue vs target
              </p>
            </div>
            <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
              Last 6 months
            </span>
          </div>
          <RevenueLineChart data={analytics?.revenueTrend || []} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-800">
            Revenue Sources
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Distribution by booking stream
          </p>
          <DonutSources sources={analytics?.revenueSources || []} />
        </div>
      </section> */}

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-800">
            Daily Performance
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Bookings and revenue for the last 7 days
          </p>
          <DailyBars data={analytics?.dailyPerformance || []} />
        </div>

        <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-800">
            Top Performing Packages
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Best conversions and earnings
          </p>

          <div className="space-y-4">
            {(analytics?.topPackages || []).map((pkg) => {
              const maxBookings = Math.max(
                ...(analytics?.topPackages || []).map((item) => item.bookings),
                1,
              );
              const barWidth = (pkg.bookings / maxBookings) * 100;

              return (
                <div key={`${pkg.packageId || pkg.title}-${pkg.rank}`}>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">
                        #{pkg.rank} {pkg.title}
                      </p>
                      <p className="text-slate-500">
                        {pkg.bookings} bookings ·{" "}
                        {Number(pkg.bookingSharePct || 0).toFixed(1)}% share
                      </p>
                    </div>
                    <p className="font-semibold text-teal-600">
                      {currency(pkg.revenue)}
                    </p>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-linear-to-r from-slate-900 to-teal-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(analytics?.topPackages || []).length === 0 && (
              <p className="text-sm text-slate-500">
                No package performance data yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Recent Bookings
              </h3>
              <p className="text-sm text-slate-500">
                Latest bookings requiring attention
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-teal-300 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50"
              onClick={() => navigate("/app/bookings")}
            >
              View all bookings
            </button>
          </div>

          <div className="space-y-2">
            {(analytics?.recentBookings || []).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {booking.traveler}
                  </p>
                  <p className="text-xs text-slate-500">
                    {booking.packageTitle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">
                    {currency(booking.totalAmount)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                    statusBadgeClass[booking.status] ||
                    "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
            {(analytics?.recentBookings || []).length === 0 && (
              <p className="text-sm text-slate-500">
                No recent bookings found.
              </p>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-800">
              Quick Actions
            </h3>
            <p className="text-sm text-slate-500 mb-4">Common workflows</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate("/app/packages/create")}
                className="w-full rounded-lg bg-teal-500 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-teal-600"
              >
                + Create Package
              </button>
              <button
                type="button"
                onClick={() => navigate("/app/packages")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Manage Packages
              </button>
              <button
                type="button"
                onClick={() => navigate("/app/bookings")}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Review Bookings
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-800 p-5 text-white">
            <h3 className="text-lg font-semibold">Performance Insights</h3>
            <p className="text-sm text-slate-300 mb-4">
              AI-style summary from live numbers
            </p>

            <div className="space-y-3 text-sm">
              <p className="inline-flex items-start gap-2">
                <ChartBarIcon className="w-4 h-4 mt-0.5 text-teal-300" />
                Revenue velocity is {pct(metrics.conversionRate)} with{" "}
                {metrics.activeBookings || 0} active bookings.
              </p>
              <p className="inline-flex items-start gap-2">
                <ClockIcon className="w-4 h-4 mt-0.5 text-amber-300" />
                Pending payment backlog currently sits at{" "}
                {currency(metrics.pendingAmount)}.
              </p>
              <p className="inline-flex items-start gap-2">
                <XCircleIcon className="w-4 h-4 mt-0.5 text-rose-300" />
                Focus area: reduce cancellation rate while scaling top package
                conversions.
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-xs text-slate-200">
              Source signal: {sourceTop}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
