/**
 * Chat Page
 * Main page for messaging with tourists/customers
 */

import React, { useState } from "react";
import {
  ConversationList,
  ChatHeader,
  MessageList,
  MessageInput,
} from "../../components/chat";
import { STATUS_CONFIG } from "../../components/chat/ConversationList";

function DetailPanel({ conversation, onClose }) {
  if (!conversation) return null;

  const statusCfg = STATUS_CONFIG[conversation.bookingStatus];

  return (
    <div className="w-[280px] bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Close button + header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h4 className="text-[13px] font-semibold text-gray-900">Details</h4>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Profile */}
      <div className="px-5 py-5 border-b border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-xl font-semibold mx-auto mb-3">
          {conversation.avatar}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          {conversation.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Tourist</p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span
            className={`w-2 h-2 rounded-full ${
              conversation.online ? "bg-emerald-500" : "bg-gray-300"
            }`}
          />
          <span className="text-[11px] text-gray-500">
            {conversation.online ? "Online now" : "Offline"}
          </span>
        </div>
      </div>

      {/* Booking Info */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Booking Info
        </h4>
        <div className="space-y-3">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>
          {/* Package */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Package</span>
            <span className="text-xs font-medium text-gray-800 text-right max-w-[140px] truncate">
              {conversation.packageName}
            </span>
          </div>
          {/* Date */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Dates</span>
            <span className="text-xs font-medium text-gray-800">
              {conversation.bookingDate}
            </span>
          </div>
          {/* Travelers */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Travelers</span>
            <span className="text-xs font-medium text-gray-800">
              {conversation.travelers}{" "}
              {conversation.travelers === 1 ? "person" : "people"}
            </span>
          </div>
          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Amount</span>
            <span className="text-xs font-semibold text-gray-900">
              {conversation.amount}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Actions
        </h4>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">
              View Profile
            </span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">
              View Booking
            </span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg
              className="w-4 h-4 text-gray-500"
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
            <span className="text-xs font-medium text-gray-700">
              View Package
            </span>
          </button>
        </div>
      </div>

      {/* Shared Files */}
      <div className="px-5 py-4">
        <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Shared Files
        </h4>
        <div className="space-y-2">
          {["Itinerary.pdf", "Invoice_#1024.pdf", "Passport_copy.jpg"].map(
            (file, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {file}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {i === 0 ? "245 KB" : i === 1 ? "120 KB" : "1.2 MB"}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleSendMessage = (message) => {
    console.log("Message sent:", message);
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setShowDetails(false);
  };

  return (
    <div className="h-[calc(100vh-7rem)] bg-white rounded-xl border border-gray-200 overflow-hidden flex">
      {/* Conversations Sidebar */}
      <ConversationList
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          conversation={selectedConversation}
          onToggleProfile={() => setShowDetails((v) => !v)}
        />
        <MessageList conversation={selectedConversation} />
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!selectedConversation}
        />
      </div>

      {/* Detail Panel */}
      {showDetails && (
        <DetailPanel
          conversation={selectedConversation}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}
