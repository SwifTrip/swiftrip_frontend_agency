import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getChatRooms = async () => {
  const response = await apiClient.get("/chat/rooms");
  return response.data;
};

export const getMessages = async (roomId) => {
  const response = await apiClient.get(`/chat/rooms/${roomId}/messages`);
  return response.data;
};
