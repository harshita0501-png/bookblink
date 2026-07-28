/**
 * src/services/api.js
 * Central Axios instance – all API calls go through here
 */

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://bookblink.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Attach JWT token to every request ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bb_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Global response error handler ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("bb_token");
      localStorage.removeItem("bb_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
