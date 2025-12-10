import React from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';

/**
 * Protected Route Component
 * Ensures user is authenticated and has the required role
 */
function ProtectedRoute({ children, requiredRole = null }) {
  const isAuthenticated = useIsAuthenticated();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Add role-based access control
  // For now, we'll get the user role from local storage or context
  // In production, this should come from Azure AD token claims
  
  const userRole = localStorage.getItem('userRole') || 'employee';

  // If a specific role is required, check if user has it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to unauthorized page or dashboard based on their actual role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
