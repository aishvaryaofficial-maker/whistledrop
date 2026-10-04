import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const TOKEN_STORAGE_KEY = 'whistledrop_mod_token';
export const USER_STORAGE_KEY = 'whistledrop_mod_user';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Listener callback for 401 handling
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// Request Interceptor: Attach JWT only to moderator & authenticated endpoints
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || '';
    const requiresAuth = url.startsWith('/api/moderator') || url === '/api/auth/me';

    if (requiresAuth) {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors & handle 401s
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || '';

      // If token expired or invalid on a protected endpoint
      if (status === 401 && (url.startsWith('/api/moderator') || url === '/api/auth/me')) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }

      const responseData = error.response.data;
      let displayMessage = responseData?.message;

      if (responseData?.errors && responseData.errors.length > 0) {
        displayMessage = responseData.errors.join('; ');
      } else if (!displayMessage) {
        if (status === 404) displayMessage = 'Requested resource was not found.';
        else if (status === 403) displayMessage = 'Access denied. You do not have permissions for this action.';
        else if (status === 500) displayMessage = 'An unexpected server error occurred. Please try again.';
        else displayMessage = `Server returned error (${status}).`;
      }

      return Promise.reject(new Error(displayMessage));
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(new Error('Connection timed out. Please check if the server is reachable.'));
    }

    if (!error.response && error.request) {
      return Promise.reject(new Error('Unable to connect to the WhistleDrop server. Please ensure the backend is running.'));
    }

    return Promise.reject(error);
  }
);
