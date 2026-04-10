// ============================================================
// api.js – Axios base configuration
// ============================================================
import axios from 'axios';

// Base URL – uses CRA proxy in dev (package.json "proxy")
const api = axios.create({
  baseURL: '/api',
});

// Add token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
