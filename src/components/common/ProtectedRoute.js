import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * ProtectedRoute component ensures that only authenticated users
 * can access specific routes. If the user is not authenticated,
 * they are redirected to the login page.
 *
 * It also preserves the intended route in location state,
 * so users can be redirected back after logging in.
 */
const ProtectedRoute = ({ children }) => {
  // Destructure authentication state and loading indicator from context
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Get the current location to redirect the user back after login
  const location = useLocation();

  // While authentication state is being determined, show a loading placeholder
  if (loading) {
    return <div>Loading...</div>; // Can be replaced with a loading spinner UI
  }

  // If user is not authenticated, redirect to login page
  // The `state` prop passes the current location for post-login redirection
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, allow the protected content to render
  return children;
};

export default ProtectedRoute;

