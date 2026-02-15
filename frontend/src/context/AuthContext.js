import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rentique_token');
    const savedUser = localStorage.getItem('rentique_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Re-verify token silently
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem('rentique_token', res.data.token);
    localStorage.setItem('rentique_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name}! 👋`);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    localStorage.setItem('rentique_token', res.data.token);
    localStorage.setItem('rentique_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome to Rentique, ${res.data.user.name}! 🎉`);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('rentique_token');
    localStorage.removeItem('rentique_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('rentique_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
