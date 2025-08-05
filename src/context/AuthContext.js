import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // React Router navigation hook for programmatic routing
    const navigate = useNavigate();

    // Runs once on initial load to check if the user is already authenticated (via cookie/session)
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                console.log('🔍 Checking auth status...');
                // Attempt to fetch the current user — this works if an auth token/cookie is valid
                const response = await apiClient.get('/users/me');
                console.log('📊 /users/me response:', response.data);
                setUser(response.data);             // Save user info
                setIsAuthenticated(true);           // Mark user as authenticated
            } catch (error) {
                console.log('❌ Auth check failed:', error);
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
     * Automatically redirects to the appropriate dashboard based on user role.
     * Throws error on failure so UI can handle it (e.g., show error message).
     */
    const login = async (email, password) => {
        try {
            console.log('🔄 Starting login process...');
            await loginUser({ email, password }); // Send login request
            console.log('✅ Login API call successful');

            // On success, fetch user data
            const response = await apiClient.get('/users/me');
            const userData = response.data;
            console.log('👤 User data received:', userData);
            console.log('🎭 User role:', userData.role);

            setUser(userData);
            setIsAuthenticated(true);
            console.log('🔐 Authentication state updated');

            // Role-based redirect: Route users to their appropriate dashboard
            if (userData.role === 'admin') {
                console.log('🚀 Redirecting to admin dashboard...');
                navigate('/admin/management');       // Admin → User Management Dashboard
            } else if (userData.role === 'manager') {
                console.log('🚀 Redirecting to manager dashboard...');
                navigate('/manager/dashboard');      // Manager → Team Dashboard
            } else {
                console.log('🚀 Redirecting to default dashboard...');
                navigate('/dashboard');              // Engineer → Personal Dashboard (fallback)
            }

        } catch (error) {
            console.error('❌ Login failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            throw error; // Re-throw for UI to catch
        }
    };

    /**
     * Logs the user out by calling the backend logout endpoint.
     * Automatically redirects to login page regardless of the result.
     * Clears local auth state to ensure security.
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

            // Redirect to login page to prevent accessing protected routes
            navigate('/login');
        }
    };

    // Bundle all relevant auth data and functions to share with child components
    const value = { user, isAuthenticated, loading, login, logout };

    // Provide context value to all children in the app
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
