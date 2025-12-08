import React from 'react';
import { Users, Shield } from 'lucide-react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles', icon: Shield }
  ];

  return (
    <div className="inline-flex bg-gray-100 rounded-full p-1">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors
              ${isActive 
                ? 'bg-white shadow text-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Icon size={18} className={`${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
