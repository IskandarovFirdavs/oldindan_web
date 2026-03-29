const rawBase = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL =
  rawBase && rawBase.trim()
    ? rawBase.trim().replace(/\/$/, "")
    : "http://127.0.0.1:8000/api";
