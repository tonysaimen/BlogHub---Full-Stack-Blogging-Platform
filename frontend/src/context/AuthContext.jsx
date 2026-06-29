import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token and verify on startup
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get('/api/auth/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Session validation failed:', error.response?.data?.message || error.message);
          logout();
        }
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const userData = res.data;
      
      localStorage.setItem('token', userData.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      setToken(userData.token);
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      });
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password, avatar) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, avatar });
      const userData = res.data;
      
      localStorage.setItem('token', userData.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      setToken(userData.token);
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      });
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
