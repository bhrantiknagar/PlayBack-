import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    
    // Clear user-specific data from local cache upon logout so next guest starts fresh
    localStorage.removeItem('playback_favorites');
    localStorage.removeItem('playback_playlists');
    localStorage.removeItem('playback_recently_played');
    
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await authService.getMe(token);
          setUser(userData);
        } catch (error) {
          console.error('Failed to restore session:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
  };

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
  };

  const updateProfile = async (profileData) => {
    const data = await authService.updateProfile(token, profileData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
