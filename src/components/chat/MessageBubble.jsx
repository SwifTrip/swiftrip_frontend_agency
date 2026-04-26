import React from "react";

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[65%] ${
          isOwn
            ? "bg-orange-500 text-white rounded-2xl rounded-br-sm"
            : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
        } px-4 py-2.5`}
      >
        {message.isAiGenerated && (
          <div className="mb-1">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                isOwn
                  ? "bg-white/20 text-white border-white/30"
                  : "bg-violet-50 text-violet-700 border-violet-100"
              }`}
            >
              AI
            </span>
          </div>
        )}
        <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>

        {message.attachment && (
          <div className="mt-2">
            {message.attachment.type === "image" && (
              <img
                src={message.attachment.url}
                alt="Attachment"
                className="rounded-lg max-w-full h-auto"
              />
            )}
            {message.attachment.type === "file" && (
              <div
                className={`flex items-center gap-2 p-2.5 rounded-lg ${
                  isOwn ? "bg-white/15" : "bg-gray-50"
                }`}
              >
                <svg
                  className={`w-7 h-7 shrink-0 ${isOwn ? "text-white" : "text-orange-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div className="min-w-0">
                  <p
                    className={`text-[12px] font-medium truncate ${isOwn ? "text-white" : "text-gray-800"}`}
                  >
                    {message.attachment.name}
                  </p>
                  <p
                    className={`text-[11px] ${isOwn ? "text-white/60" : "text-gray-400"}`}
                  >
                    {message.attachment.size}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timestamp + Status */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[10px] ${isOwn ? "text-white/60" : "text-gray-400"}`}
          >
            {message.timestamp}
          </span>
          {isOwn && message.status === "read" && (
            <svg
              className="w-3.5 h-3.5 text-emerald-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
            </svg>
          )}
          {isOwn && message.status === "delivered" && (
            <svg
              className="w-3.5 h-3.5 text-white/50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
            </svg>
          )}
          {isOwn && message.status === "sent" && (
            <svg
              className="w-3.5 h-3.5 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
