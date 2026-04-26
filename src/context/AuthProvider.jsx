import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

/**
 * AuthProvider with JWT Bearer Token Authentication
 * 
 * Security improvements:
 * - JWT stored in localStorage (can be upgraded to sessionStorage)
 * - Session validation via /auth/me endpoint on mount
 * - JWT sent in Authorization header for all requests
 * - Tokens never exposed to HttpOnly cookies (flexibility)
 * - Prevents infinite redirect loop on app load
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Validate session on component mount
   * Checks if user has a valid JWT token in localStorage
   * If valid token exists, fetches user data from /auth/me
   */
  useEffect(() => {
    const validateSession = async () => {
      try {
        // Check if JWT exists in localStorage
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          // No token stored - user not logged in
          setUser(null);
          setError(null);
          setIsLoading(false);
          return;
        }

        // Token exists - validate it by calling /auth/me
        // axios interceptor will add Authorization header automatically
        const response = await api.get('/auth/me');
        const userData = response.data.data || response.data;
        setUser(userData);
        
        // Store user data in localStorage for quick access
        localStorage.setItem('user', JSON.stringify(userData));
        setError(null);
      } catch (err) {
        // Token invalid or expired - clear storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Login and get JWT token from backend
      const response = await api.post('/auth/login', { email, password });
      
      // Extract tokens and user data from response
      const { access_token, refresh_token, user: userData } = response.data.data || response.data;
      
      // Store JWT tokens in localStorage
      if (access_token) {
        localStorage.setItem('access_token', access_token);
      }
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      
      // Store user data
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      setError(null);
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      // Clear any partial data on login failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      // Call backend logout endpoint to clear any server-side sessions
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear all tokens and user data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

