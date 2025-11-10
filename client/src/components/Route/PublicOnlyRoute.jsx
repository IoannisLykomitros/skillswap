import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Public Only Route Component
 * Redirects to dashboard if user is already authenticated
 * Now uses Auth Context
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default PublicOnlyRoute;
