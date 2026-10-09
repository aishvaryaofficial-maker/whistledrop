import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types';

/**
 * Determine the API base URL:
 * 1. Checks VITE_API_BASE_URL environment variable.
 * 2. If running in production (e.g. Vercel deployment), falls back to the deployed Render backend:
 *    https://whistledrop-1.onrender.com
 * 3. In local development, falls back to http://localhost:8080.
 * Sanitizes trailing slashes so paths concatenate cleanly without double slashes.
 */
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (import.meta.env.PROD) {
    return 'https://whistledrop-1.onrender.com';
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();
export const TOKEN_STORAGE_KEY = 'whistledrop_mod_token';
export const USER_STORAGE_KEY = 'whistledrop_mod_user';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000,
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

// Response Interceptor: Format errors & distinguish network, CORS, HTTP, and auth failures
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    // 1. HTTP Response received from the server
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || '';
      const isModeratorRoute = url.startsWith('/api/moderator') || url === '/api/auth/me';

      // If token expired or invalid on a protected endpoint
      if (status === 401 && isModeratorRoute) {
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
        switch (status) {
          case 400:
            displayMessage = 'Invalid request payload or validation failed.';
            break;
          case 401:
            displayMessage = isModeratorRoute
              ? 'Session expired or authentication required. Please log in as an authorized moderator.'
              : 'Authentication error: The report submission endpoint returned unauthorized (401).';
            break;
          case 403:
            displayMessage = 'Access denied (403): You do not have permissions for this action.';
            break;
          case 404:
            displayMessage = 'Requested resource was not found (404).';
            break;
          case 429:
            displayMessage = 'Too many requests (429). Please wait a few moments before trying again.';
            break;
          case 500:
            displayMessage = 'An unexpected server error occurred (500). Please try again.';
            break;
          case 502:
          case 503:
          case 504:
            displayMessage =
              'Backend service is temporarily unavailable or starting up (Render instance cold start). Please wait 30 seconds and retry.';
            break;
          default:
            displayMessage = `Server returned error (${status}).`;
        }
      }

      return Promise.reject(new Error(displayMessage));
    }

    // 2. Request timed out
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject(
        new Error(
          'Connection timed out. If the backend is running on Render free tier, it may be waking up from sleep (cold start). Please wait 30 seconds and try again.'
        )
      );
    }

    // 3. Network or CORS Error (No HTTP response was received by browser)
    if (!error.response && error.request) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return Promise.reject(new Error('Network offline. Please check your internet connection.'));
      }

      return Promise.reject(
        new Error(
          `Unable to connect to the WhistleDrop server at ${API_BASE_URL}. This may be caused by CORS restrictions, an incorrect backend URL, or the server waking up on Render. Please verify the backend is running and allows this origin.`
        )
      );
    }

    // 4. Other unexpected runtime errors
    return Promise.reject(error);
  }
);
