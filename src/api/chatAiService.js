import axios from "axios";
import { getToken } from "../utils/auth/authHelper";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export const getCompanyAiSettings = async () => {
  const response = await apiClient.get("/chat-ai/company");
  return response.data;
};

export const updateCompanyAiSettings = async (aiAutoReplyEnabled) => {
  const response = await apiClient.patch("/chat-ai/company", {
    aiAutoReplyEnabled,
  });
  return response.data;
};

export const getRoomAiSettings = async (roomId) => {
  const response = await apiClient.get(`/chat-ai/rooms/${roomId}`);
  return response.data;
};

export const updateRoomAiSettings = async (
  roomId,
  aiAutoReplyEnabledOrNull,
) => {
  const response = await apiClient.patch(`/chat-ai/rooms/${roomId}`, {
    aiAutoReplyEnabled: aiAutoReplyEnabledOrNull,
  });
  return response.data;
};
