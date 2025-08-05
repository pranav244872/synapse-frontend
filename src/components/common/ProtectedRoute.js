import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * ProtectedRoute component ensures that only authenticated users with proper roles
 * can access specific routes. Provides multi-layer protection:
 * 1. Authentication check - user must be logged in
 * 2. Role-based authorization - user must have required role permissions
 * 
 * If unauthorized, users are redirected appropriately with state preservation
 * for seamless post-login navigation.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Destructure user data, authentication state and loading indicator from context
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  
  // Get the current location to redirect the user back after login
  let location = useLocation();

  // While authentication state is being determined, show a loading placeholder
  if (loading) {
    return <div>Loading Authentication...</div>;
  }

  // First security layer: Authentication check
  if (!isAuthenticated) {
    console.log('🔐 User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enhanced user validation - ensure user object exists and has role
  if (!user || !user.role) {
    console.log('❌ User object invalid:', user);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Second security layer: Role-based authorization check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('🚫 Role authorization failed:');
    console.log('User role:', user.role);
    console.log('Allowed roles:', allowedRoles);
    console.log('Role type:', typeof user.role);
    
    // Redirect to appropriate dashboard based on user's actual role
    if (user.role === 'admin') {
      return <Navigate to="/admin/management" replace />;
    } else if (user.role === 'manager') {
      return <Navigate to="/manager/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('✅ Protection checks passed, rendering protected content');
  // If both authentication and authorization checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
