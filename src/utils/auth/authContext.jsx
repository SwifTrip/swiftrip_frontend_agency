// src/utils/auth/authContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, clearToken } from './authHelper.js';
import * as api from '../../api/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ email: 'user@domain.com' }); // later replace with actual user data if needed
    }
  }, []);

  async function registerUser(data) {
    setLoading(true);
    try {
      const res = await api.registerUser(data);
      if (res.success) {
        toast.success(res.message || 'Registration successful, Verify Your Email');
        navigate('/login');
        // if (res.token) saveToken(res.token);
        // setUser(res.data || { email: data.email });
      } else {
        toast.error(res.message || 'Registration failed');
      }
      return res;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    setLoading(true);
    try {
      const res = await api.loginUser(credentials);
      if (res.success) {
        toast.success(res.message || 'Login successful');
        if (res.token) saveToken(res.token);
        setUser(res.data || { email: credentials.email });
      } else {
        toast.error(res.message || 'Login failed');
      }
      return res;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    setUser(null);
    toast.info('Logged out successfully');
  }

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
