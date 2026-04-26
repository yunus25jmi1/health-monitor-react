import { useState, useEffect } from 'react';
import api, { setAuthToken } from '../api/axios';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (savedToken) setAuthToken(savedToken);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.warn("localStorage access failed during init:", e);
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, ...userData } = response.data;
    
    setAuthToken(access_token);
    
    try {
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
    
    setUser(userData);
    return userData;
  };

  const logout = () => {
    setAuthToken(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
