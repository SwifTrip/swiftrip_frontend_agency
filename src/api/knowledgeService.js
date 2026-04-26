import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const listKnowledgeDocuments = async ({ bookingId, tourPackageId, q } = {}) => {
  const response = await apiClient.get("/knowledge/documents", {
    params: { bookingId, tourPackageId, q },
  });
  return response.data;
};

export const uploadKnowledgeDocument = async ({ title, file, bookingId, tourPackageId }) => {
  const form = new FormData();
  if (title) form.append("title", title);
  if (bookingId) form.append("bookingId", bookingId);
  if (tourPackageId) form.append("tourPackageId", tourPackageId);
  form.append("file", file);

  const response = await apiClient.post("/knowledge/documents", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteKnowledgeDocument = async (id) => {
  await apiClient.delete(`/knowledge/documents/${id}`);
};

export const listKnowledgeNotes = async ({ bookingId, tourPackageId } = {}) => {
  const response = await apiClient.get("/knowledge/notes", {
    params: { bookingId, tourPackageId },
  });
  return response.data;
};

export const createKnowledgeNote = async ({ title, content, bookingId, tourPackageId }) => {
  const response = await apiClient.post("/knowledge/notes", {
    title,
    content,
    bookingId,
    tourPackageId,
  });
  return response.data;
};

export const deleteKnowledgeNote = async (id) => {
  await apiClient.delete(`/knowledge/notes/${id}`);
};

export const listKnowledgeFaqs = async ({ bookingId, tourPackageId } = {}) => {
  const response = await apiClient.get("/knowledge/faqs", {
    params: { bookingId, tourPackageId },
  });
  return response.data;
};

export const createKnowledgeFaq = async ({ question, answer, bookingId, tourPackageId }) => {
  const response = await apiClient.post("/knowledge/faqs", {
    question,
    answer,
    bookingId,
    tourPackageId,
  });
  return response.data;
};

export const deleteKnowledgeFaq = async (id) => {
  await apiClient.delete(`/knowledge/faqs/${id}`);
};

