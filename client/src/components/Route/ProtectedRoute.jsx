import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/helpers';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Allows access to children components if authenticated
 */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
