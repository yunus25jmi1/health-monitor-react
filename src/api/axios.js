import axios from 'axios';

/**
 * Secure Axios Instance with HttpOnly Cookie Support
 * 
 * Security Configuration:
 * - withCredentials: true - Automatically sends cookies with every request
 * - No manual token injection - Backend handles HttpOnly cookies
 * - Tokens never exposed to JavaScript (XSS protection)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://health.yunus.eu.org/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookie-based authentication (HttpOnly cookies)
});

// Request interceptor for enhanced error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - session expired or invalid
    if (error.response?.status === 401) {
      // Clear any stale auth state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
