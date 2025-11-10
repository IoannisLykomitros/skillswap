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
      
      if (storedToken) {
        setTokenState(storedToken);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setTokenState(authToken);
    saveToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    removeToken();
  };

  const updateUser = (userData) => {
    setUser(userData);
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
