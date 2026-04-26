import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

/**
 * AuthProvider with Secure HttpOnly Cookie-based Authentication
 * 
 * Security improvements:
 * - No localStorage storage of tokens
 * - Session validation via /auth/me endpoint on mount
 * - JWT stored in HttpOnly cookies by backend
 * - Tokens never exposed to JavaScript
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Validate session on component mount
   * Checks if user has a valid HttpOnly cookie session
   */
  useEffect(() => {
    const validateSession = async () => {
      try {
        // Check if user has a valid session via HttpOnly cookie
        const response = await api.get('/auth/me');
        setUser(response.data.data || response.data);
        setError(null);
      } catch (err) {
        // Session invalid or expired - user will be redirected to login
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
      
      // Backend will set HttpOnly cookie automatically
      const response = await api.post('/auth/login', { email, password });
      
      // Store only user data, never the token (it's in HttpOnly cookie)
      const userData = response.data.data || response.data;
      setUser(userData);
      
      return userData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      // Backend clears HttpOnly cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

