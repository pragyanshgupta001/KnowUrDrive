import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach token from localStorage to every request automatically
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("KnowUrDrive-auth");
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

// If token expires — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("KnowUrDrive-auth");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;