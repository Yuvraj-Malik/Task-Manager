import axios from "axios";

// Dev requests go through Vite's proxy (/api -> http://localhost:5000),
// so relative URLs work in both dev and after a same-origin production deploy.
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // required to send/receive the httpOnly JWT cookie
});

export default api;
