import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/helpers';

/**
 * Public Only Route Component
 * Redirects to dashboard if user is already authenticated
 * Used for login/register pages
 */
const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default PublicOnlyRoute;
