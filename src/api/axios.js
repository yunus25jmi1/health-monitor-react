import axios from 'axios';

/**
 * Secure Axios Instance with JWT Bearer Token Support
 * 
 * Security Configuration:
 * - JWT stored in localStorage (can be upgraded to sessionStorage for better security)
 * - Automatically sends Authorization header with every request
 * - Tokens included in all API calls
 * - 401 responses handled gracefully (clear token and redirect to login)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://health.yunus.eu.org/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - session expired or invalid
    if (error.response?.status === 401) {
      // Clear stale auth state
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
