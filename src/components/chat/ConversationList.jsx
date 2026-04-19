import React, { useState } from "react";

const BOOKING_STATUS = {
  UPCOMING: "upcoming",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

const STATUS_CONFIG = {
  [BOOKING_STATUS.UPCOMING]: {
    label: "Upcoming",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  [BOOKING_STATUS.IN_PROGRESS]: {
    label: "In Progress",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  [BOOKING_STATUS.COMPLETED]: {
    label: "Completed",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
};

// Removed hardcoded mock data for integration

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: BOOKING_STATUS.IN_PROGRESS, label: "In Progress" },
  { key: BOOKING_STATUS.UPCOMING, label: "Upcoming" },
  { key: BOOKING_STATUS.COMPLETED, label: "Past" },
];

export default function ConversationList({
  conversations = [],
  selectedConversation,
  onSelectConversation,
  searchTerm,
  onSearchChange,
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || conv.bookingStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-[340px] bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {conversations.length} conversations
            </p>
          </div>
          {totalUnread > 0 && (
            <span className="min-w-[22px] h-[22px] px-1.5 bg-orange-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or package..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 pb-2">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? conversations.length
                : conversations.filter((c) => c.bookingStatus === tab.key)
                    .length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex-1 text-[11px] font-semibold py-1.5 rounded-md transition-all ${
                  activeFilter === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1 text-[10px] ${
                    activeFilter === tab.key
                      ? "text-orange-600"
                      : "text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg
              className="w-10 h-10 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-[13px] font-medium">No conversations found</p>
            <p className="text-xs mt-1">Try a different filter or search</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?.id === conversation.id;
            const statusCfg = STATUS_CONFIG[conversation.bookingStatus];

            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`group flex items-start gap-3 px-5 py-3.5 cursor-pointer transition-all border-l-[3px] ${
                  isSelected
                    ? "bg-orange-50/70 border-l-orange-500"
                    : "border-l-transparent hover:bg-gray-50"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-[13px] font-semibold ${
                      isSelected
                        ? "bg-orange-500"
                        : "bg-gray-700 group-hover:bg-gray-600"
                    } transition-colors`}
                  >
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-[13px] truncate ${
                        conversation.unread > 0
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      {conversation.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {conversation.timestamp}
                    </span>
                  </div>

                  {/* Package + Status */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-gray-500 truncate">
                      {conversation.packageName}
                    </span>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                      />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Last Message */}
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <p
                      className={`text-[12px] truncate ${
                        conversation.unread > 0
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="shrink-0 w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export { BOOKING_STATUS, STATUS_CONFIG };
