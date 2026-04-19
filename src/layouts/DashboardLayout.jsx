import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import PageTransition from "../components/common/PageTransition";

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isChatRoute = location.pathname.startsWith("/app/chat");

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-amber-50/35 to-orange-50/35 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,146,60,0.05),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(253,186,116,0.04),transparent_36%)] pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative z-10">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="dashboard-main flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-4 lg:px-2 lg:py-5">
          <div className={`w-full ${isChatRoute ? "" : "max-w-[1220px]"} mx-auto`}>
            <div className={isChatRoute ? "" : "dashboard-page-compact mx-auto"}>
              <PageTransition key={location.pathname}>{children}</PageTransition>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
