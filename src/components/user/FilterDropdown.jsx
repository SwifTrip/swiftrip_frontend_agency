import React from "react";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({ value, onChange, options, icon }) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="enterprise-select h-10 min-w-[150px] px-3 pr-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white text-sm text-slate-700 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
        size={14}
      />
    </div>
  );
};

export default FilterDropdown;
