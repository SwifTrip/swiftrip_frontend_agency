import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  ConversationList,
  ChatHeader,
  MessageList,
  MessageInput,
} from "../../components/chat";
import { STATUS_CONFIG, BOOKING_STATUS } from "../../components/chat/ConversationList";
import { getChatRooms, getMessages } from "../../api/chatService";
import { getToken } from "../../utils/auth/authHelper";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";

function DetailPanel({ conversation, onClose }) {
  if (!conversation) return null;

  const statusCfg = STATUS_CONFIG[conversation.bookingStatus] || STATUS_CONFIG[BOOKING_STATUS.UPCOMING];

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
    </div>
  );
}

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const socketRef = useRef(null);
  const user = useSelector(selectUser);

  // Initialize Socket.io connection and load rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const rooms = await getChatRooms();
        const mapped = rooms.map(r => {
          // Identify the tourist
          const tourist = r.participants.find(p => p.user.role === 'TOURIST')?.user || r.participants[0]?.user;
          const lastMsg = r.messages?.[0];
          
          return {
            id: r.id,
            name: tourist ? `${tourist.firstName || ""} ${tourist.lastName || ""}`.trim() || "Unknown Tourist" : "Unknown Tourist",
            avatar: tourist?.firstName ? (tourist.firstName[0] + (tourist.lastName?.[0] || "")).toUpperCase() : "U",
            lastMessage: lastMsg ? lastMsg.content : "Start chatting now...",
            timestamp: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "",
            unread: 0,
            online: true, // Faked for testing
            packageName: r.booking?.publicTour?.packageSchedule?.tourPackage?.title || r.customTour?.tourPackage?.title || "Custom Tour",
            bookingStatus: "upcoming", 
            bookingDate: "Flexible",
            travelers: r.booking?.seats || 2,
            amount: r.booking?.totalAmount ? `$${r.booking.totalAmount}` : "Paid",
          };
        });
        setConversations(mapped);
      } catch (err) {
        console.error("Failed to load chat rooms", err);
      }
    };
    
    fetchRooms();

    const token = getToken();
    const API_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:3000';
    
    const socket = io(API_URL, {
      auth: { token }
    });

    socket.on("connect", () => {
      console.log("Connected to chat socket", socket.id);
    });

    socket.on("receive_message", (data) => {
      setMessages((prevMsg) => [
        ...prevMsg,
        {
          id: data.id || Date.now(),
          text: data.content,
          timestamp: new Date(data.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isOwn: false,
          status: "delivered",
        }
      ]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (messageContent) => {
    if (!selectedConversation || !socketRef.current) return;

    // Optimistically update UI
    const tempMsg = {
      id: Date.now(),
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isOwn: true,
      status: "delivered",
    };
    setMessages(prev => [...prev, tempMsg]);

    // Send payload over socket
    socketRef.current.emit("send_message", {
      roomId: selectedConversation.id,
      content: messageContent,
      messageType: "TEXT"
    });
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    setShowDetails(false);
    
    // Fetch message history for this room
    try {
      const history = await getMessages(conv.id);
      const formattedHistory = history.map(m => ({
        id: m.id,
        text: m.content,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        isOwn: m.participant?.user?.id === user?.id,
        status: m.isRead ? "read" : "delivered",
      }));
      setMessages(formattedHistory);

      // Tell socket servers we are focusing on this room
      socketRef.current?.emit("join_room", conv.id);
    } catch (err) {
      console.error("Failed to load message history", err);
    }
  };

  return (
    <div className="h-[calc(100vh-6.45rem)] bg-white rounded-xl border border-gray-200 overflow-hidden flex">
      {/* Conversations Sidebar */}
      <ConversationList
        conversations={conversations}
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
        <MessageList conversation={selectedConversation} messages={messages} />
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
