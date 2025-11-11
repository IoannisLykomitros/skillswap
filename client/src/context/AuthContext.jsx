import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken as saveToken, removeToken } from '../utils/helpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      const storedUser = localStorage.getItem('user');
      
      if (storedToken) {
        setTokenState(storedToken);
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (err) {
            console.error('Error parsing stored user data:', err);
            localStorage.removeItem('user');
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setTokenState(authToken);
    saveToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    removeToken();
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
