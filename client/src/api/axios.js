import axios from "axios";

// In development, Vite's proxy routes /api -> http://localhost:5000.
// In production, VITE_API_URL points to the live Render backend URL (e.g. https://taskpulse-api.onrender.com/api).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // required to send/receive httpOnly JWT cookies cross-origin
});

export default api;
