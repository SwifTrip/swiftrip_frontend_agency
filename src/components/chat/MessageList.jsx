import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

// Static messages data for each conversation
const messagesData = {
  1: [
    {
      id: 1,
      text: "Hi! I saw your Bali Adventure Tour package and I'm very interested.",
      timestamp: "10:30 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      text: "Hello John! Thank you for your interest in our Bali Adventure Tour. How can I help you today?",
      timestamp: "10:32 AM",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      text: "I wanted to know if the package includes airport transfers and what's the accommodation like?",
      timestamp: "10:35 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: 4,
      text: "Great questions! Yes, the package includes:\n\n✅ Round-trip airport transfers\n✅ 5-star resort accommodation\n✅ Daily breakfast\n✅ All entrance fees to attractions\n\nThe resort we use is located right on the beachfront with stunning ocean views.",
      timestamp: "10:38 AM",
      isOwn: true,
      status: "read",
    },
    {
      id: 5,
      text: "That sounds amazing! How many people can book together?",
      timestamp: "10:40 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: 6,
      text: "We can accommodate groups of any size! For groups of 6 or more, we also offer a 10% discount. Would you like me to send you the detailed itinerary?",
      timestamp: "10:42 AM",
      isOwn: true,
      status: "delivered",
    },
    {
      id: 7,
      text: "Yes please! Also, are there any dates available in April?",
      timestamp: "10:45 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: 8,
      text: "Hi, I wanted to ask about the Bali package...",
      timestamp: "10:48 AM",
      isOwn: false,
      status: "read",
    },
  ],
  2: [
    {
      id: 1,
      text: "Good morning! I just completed my booking payment for the Thailand Explorer trip.",
      timestamp: "9:15 AM",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      text: "Good morning Sarah! Thank you for your payment. I can confirm your booking is now complete!",
      timestamp: "9:18 AM",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      text: "Thank you for the quick response!",
      timestamp: "9:20 AM",
      isOwn: false,
      status: "read",
    },
  ],
  3: [
    {
      id: 1,
      text: "Hello, I'm interested in the Japan Discovery tour.",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      text: "Hi Michael! The Japan Discovery is one of our most popular packages. What would you like to know?",
      timestamp: "Yesterday",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      text: "Can you provide more details about the itinerary?",
      timestamp: "8:30 AM",
      isOwn: false,
      status: "read",
    },
  ],
  4: [
    {
      id: 1,
      text: "The Maldives package looks incredible! What's included?",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      text: "Hi Emily! The Maldives Paradise package includes overwater villa accommodation, all meals, water sports activities, and a sunset cruise!",
      timestamp: "Yesterday",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      text: "That's exactly what I was looking for. How do I book?",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
    {
      id: 4,
      text: "I've just sent you the booking link. You can pay 30% upfront and the rest 2 weeks before the trip.",
      timestamp: "Yesterday",
      isOwn: true,
      status: "read",
    },
    {
      id: 5,
      text: "Perfect, I'll make the payment today.",
      timestamp: "3 hours ago",
      isOwn: false,
      status: "read",
    },
  ],
  5: [
    {
      id: 1,
      text: "Hi there! Is the Dubai Luxury package available for a group?",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      text: "Hello Robert! Yes, absolutely. How many people are in your group?",
      timestamp: "Yesterday",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      text: "Is there availability for 5 people?",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
  ],
  6: [
    {
      id: 1,
      text: "Just got back from Paris! Everything was perfect.",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      text: "So glad to hear that Amanda! We hope you had an amazing time!",
      timestamp: "Yesterday",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      text: "The trip was amazing! Thank you so much!",
      timestamp: "Yesterday",
      isOwn: false,
      status: "read",
    },
  ],
  7: [
    {
      id: 1,
      text: "Hello, I'm looking at the Swiss Alps Adventure package.",
      timestamp: "2 days ago",
      isOwn: false,
      status: "read",
    },
    {
      id: 2,
      text: "Hi David! The Swiss Alps Adventure is a fantastic choice for nature lovers. Would you like more details?",
      timestamp: "2 days ago",
      isOwn: true,
      status: "read",
    },
    {
      id: 3,
      text: "What's included in the package price?",
      timestamp: "2 days ago",
      isOwn: false,
      status: "read",
    },
  ],
};

export default function MessageList({ conversation }) {
  const messagesEndRef = useRef(null);
  const messages = conversation ? messagesData[conversation.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversation]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
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
        </div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          No conversation selected
        </h3>
        <p className="text-xs text-gray-400 max-w-[200px] text-center">
          Select a conversation from the sidebar to begin messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50/50">
      {/* Date Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] text-gray-400 font-medium px-2">
          Today
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.isOwn}
        />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}

export { messagesData };
