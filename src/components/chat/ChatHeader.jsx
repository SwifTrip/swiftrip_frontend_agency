import React from "react";
import { STATUS_CONFIG } from "./ConversationList";

export default function ChatHeader({ conversation, onToggleProfile }) {
  if (!conversation) return null;

  const statusCfg = STATUS_CONFIG[conversation.bookingStatus];

  return (
    <div className="bg-white border-b border-gray-200 px-5 py-3">
      <div className="flex items-center justify-between">
        {/* Left: User Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white text-[13px] font-semibold">
              {conversation.avatar}
            </div>
            {conversation.online && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                {conversation.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-xs ${
                  conversation.online ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {conversation.online ? "Online" : "Offline"}
              </span>
              <span className="text-gray-300 text-xs">|</span>
              <span className="text-xs text-gray-500">
                {conversation.packageName}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voice Call"
          >
            <svg
              className="w-[18px] h-[18px] text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Video Call"
          >
            <svg
              className="w-[18px] h-[18px] text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <button
            onClick={onToggleProfile}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Details"
          >
            <svg
              className="w-[18px] h-[18px] text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="More Options"
          >
            <svg
              className="w-[18px] h-[18px] text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
