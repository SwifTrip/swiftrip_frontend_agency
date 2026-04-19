import React from "react";
import { Users, Shield } from "lucide-react";

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "roles", label: "Roles", icon: Shield },
  ];

  return (
    <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon
              size={16}
              className={`${isActive ? "text-orange-700" : "text-slate-500"}`}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
