import axios from 'axios';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://health.yunus.eu.org/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  let token = authToken;
  
  // Only try localStorage if we don't have an in-memory token
  if (!token) {
    try {
      token = localStorage.getItem('token');
    } catch (e) {
      // Silently ignore storage errors in restricted contexts
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
