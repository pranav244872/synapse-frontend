import React, { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../api/authService'; // API functions to handle login/logout
import apiClient from '../utils/auth'; // Axios instance with cookie/session handling

// Create the authentication context
export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and provides authentication state and logic
 * to all components via React Context.
 */
export const AuthProvider = ({ children }) => {
  // Stores the authenticated user's information (name, email, role, etc.)
  const [user, setUser] = useState(null);

  // Boolean to track if the user is currently authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Boolean to indicate if the auth status is being determined (e.g., on initial page load)
  const [loading, setLoading] = useState(true);

  // Runs once on initial load to check if the user is already authenticated (via cookie/session)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Attempt to fetch the current user — this works if an auth token/cookie is valid
        const response = await apiClient.get('/users/me');
        setUser(response.data);             // Save user info
        setIsAuthenticated(true);           // Mark user as authenticated
      } catch (error) {
        // If the request fails (e.g., 401 Unauthorized), reset state
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        // Whether success or error, loading is now complete
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Logs the user in with credentials, then fetches and stores their info.
   * Throws error on failure so UI can handle it (e.g., show error message).
   */
  const login = async (email, password) => {
    try {
      await loginUser({ email, password }); // Send login request

      // On success, fetch user data
      const response = await apiClient.get('/users/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Re-throw for UI to catch
    }
  };

  /**
   * Logs the user out by calling the backend logout endpoint.
   * Regardless of the result, clears local auth state.
   */
  const logout = async () => {
    try {
      await logoutUser(); // Invalidate session or token on the server
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Clear user state even if logout request fails
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Bundle all relevant auth data and functions to share with child components
  const value = { user, isAuthenticated, loading, login, logout };

  // Provide context value to all children in the app
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
