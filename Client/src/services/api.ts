import axios from 'axios';
import { store } from '@/store';
import { clearAuth } from '@/store/slices/authSlice';

/* ============================================================
 * Axios instance — centralized API client with interceptors
 * ============================================================ */

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/* ─────────────── REQUEST INTERCEPTOR ─────────────── */
api.interceptors.request.use(
  (config) => {
    // Attach token from localStorage as fallback if cookie not set
    const token = localStorage.getItem('taskflow_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ─────────────── RESPONSE INTERCEPTOR ─────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout on 401 (token expired/invalid)
    if (error.response?.status === 401) {
      const state = store.getState();
      // Only dispatch logout if user was previously authenticated
      if (state.auth.user) {
        localStorage.removeItem('taskflow_token');
        store.dispatch(clearAuth());
        // Push to login — handled by ProtectedRoute observing auth state
      }
    }
    return Promise.reject(error);
  }
);

export default api;
