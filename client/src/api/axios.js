import axios from "axios";

let rawUrl = import.meta.env.VITE_API_URL || "/api";

// Auto-normalize: if an external URL like "https://xxx.onrender.com" is provided without "/api", append it automatically
if (rawUrl.startsWith("http")) {
  const trimmed = rawUrl.replace(/\/+$/, "");
  rawUrl = trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const api = axios.create({
  baseURL: rawUrl,
  withCredentials: true, // required to send/receive httpOnly JWT cookies cross-origin
});

export default api;
