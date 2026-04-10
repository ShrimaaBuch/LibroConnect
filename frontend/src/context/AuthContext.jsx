// ============================================================
// AuthContext.jsx – Global Authentication State
// ============================================================
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);

// ── AuthProvider Component ──────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Fetch current user on app load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
        } catch (err) {
          // Token invalid or expired
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  // Login function
  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, login, logout, isAdmin: user?.role === 'admin' };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
