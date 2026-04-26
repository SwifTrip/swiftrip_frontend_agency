// src/components/dashboard/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../store/slices/authSlice";
import { persistor } from "../../store";
import logoImage from "../../assets/logo.png";

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse = () => {},
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/auth/login");
  };

  const handleNavigateProfile = () => {
    setShowAccountMenu(false);
    navigate("/app/profile");
  };

  const handleNavigateCompanySettings = () => {
    setShowAccountMenu(false);
    navigate("/app/company-settings");
  };

  const menuItems = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: "Dashboard",
      path: "/app/dashboard",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      label: "Packages",
      path: "/app/packages",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      label: "Users",
      path: "/app/users",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      label: "Bookings",
      path: "/app/bookings",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      label: "Payments",
      path: "/app/payments",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      label: "Chat",
      path: "/app/chat",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253M12 6.253C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      label: "Knowledge Base",
      path: "/app/knowledge-base",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <CollapsibleSidebar
      isCollapsed={isCollapsed}
      onToggleCollapse={onToggleCollapse}
      isActive={isActive}
      menuItems={menuItems}
      user={user}
      showAccountMenu={showAccountMenu}
      setShowAccountMenu={setShowAccountMenu}
      onNavigateProfile={handleNavigateProfile}
      onNavigateCompanySettings={handleNavigateCompanySettings}
      onLogout={handleLogout}
    />
  );
}

function CollapsibleSidebar({
  isCollapsed,
  onToggleCollapse,
  isActive,
  menuItems,
  user,
  showAccountMenu,
  setShowAccountMenu,
  onNavigateProfile,
  onNavigateCompanySettings,
  onLogout,
}) {
  return (
    <div
      className={`relative ${isCollapsed ? "w-20" : "w-60"} bg-linear-to-b from-white/94 to-orange-50/18 backdrop-blur-xl border-r border-slate-200/80 flex flex-col h-screen shadow-[0_10px_26px_-22px_rgba(251,146,60,0.28)] transition-all duration-300 ease-in-out`}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-5 z-20 h-7 w-7 rounded-full border border-slate-200/90 bg-white text-slate-500 shadow-sm hover:text-orange-700 hover:bg-orange-50/60 transition-colors flex items-center justify-center"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-300/70 to-transparent"></div>

      <div
        className={`px-3 py-2.5 border-b border-slate-200/80 bg-linear-to-b from-white/78 to-slate-50/70 flex ${
          isCollapsed
            ? "flex-col items-center justify-center gap-2"
            : "items-center justify-between gap-2"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/95 border border-slate-200/80 shadow-[0_8px_18px_-12px_rgba(15,23,42,0.18)] flex items-center justify-center">
            <img
              src={logoImage}
              alt="SwifTrip Logo"
              className="w-6 h-6 object-contain drop-shadow-sm"
            />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-gray-800 tracking-[0.02em] mb-1">
                Agency Portal
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-orange-600/90">
                Operations Console
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && <div className="w-7 h-7" aria-hidden="true"></div>}
      </div>

      <nav
        className={`flex-1 ${isCollapsed ? "p-2.5" : "p-3"} space-y-0.5 overflow-y-auto`}
      >
        {menuItems.map((item) => {
          const isActivePath = isActive(item.path);
          const isComingSoon = item.comingSoon === true;

          if (isComingSoon) {
            return (
              <div
                key={item.path}
                className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-2 px-3 py-2.5 rounded-lg text-gray-400 cursor-not-allowed select-none opacity-45`}
                title={item.label}
              >
                <div className="flex items-center gap-2">
                  <div className="opacity-60 w-4 h-4">{item.icon}</div>
                  {!isCollapsed && (
                    <span className="text-xs font-medium">{item.label}</span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-lg transition-all duration-300 ease-in-out font-medium text-xs lg:text-sm ${
                isActivePath
                  ? "bg-linear-to-r from-orange-100/65 to-orange-50/28 text-orange-800 font-semibold shadow-[0_6px_14px_-6px_rgba(234,88,12,0.24)]"
                  : "text-gray-700 hover:bg-orange-50/45 hover:text-orange-700"
              }`}
            >
              <div className="w-4 h-4">{item.icon}</div>
              {!isCollapsed && <span className="text-xs">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className={`border-t border-slate-200/80 ${isCollapsed ? "p-2.5" : "p-3"} bg-white/60 backdrop-blur-sm`}
      >
        <button
          type="button"
          onClick={() => setShowAccountMenu((prev) => !prev)}
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "gap-2.5"} px-2.5 py-2 rounded-lg hover:bg-slate-100/70 transition-all duration-300 ease-in-out`}
          title={user?.email || "admin@swiftrip.com"}
        >
          <div className="w-8 h-8 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
          {!isCollapsed && (
            <>
              <div className="text-left min-w-0 flex-1">
                <p className="text-[11px] text-slate-500 leading-tight">
                  Signed in as
                </p>
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {user?.email || "admin@swiftrip.com"}
                </p>
              </div>
              <svg
                className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                  showAccountMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </>
          )}
        </button>

        {showAccountMenu && !isCollapsed && (
          <div className="mt-2 rounded-lg border border-slate-200/80 bg-white/92 overflow-hidden">
            <button
              type="button"
              onClick={onNavigateProfile}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg
                className="w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Profile
            </button>
            <button
              type="button"
              onClick={onNavigateCompanySettings}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-200/70"
            >
              <svg
                className="w-4 h-4 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
              </svg>
              Company Settings
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50/50 transition-colors border-t border-slate-200/70"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V6m-5 14h10a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
