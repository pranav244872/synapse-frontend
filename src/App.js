import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth context to manage authentication state globally
import { AuthProvider } from './context/AuthContext';

// Layouts and Pages
import AdminLayout from './layouts/AdminLayout'; // Admin dashboard layout with sidebar and topbar
import LandingPage from './pages/LandingPage'; // Public home page
import LoginPage from './pages/LoginPage'; // Login form for users
import ManagementPage from './pages/admin/ManagementPage'; // Admin management interface
import SkillManagementPage from './pages/admin/SkillManagementPage'; // Admin skill management view
import AcceptInvitationPage from './pages/AcceptInvitationPage';

// Common UI components
import AnimatedBackground from './components/common/AnimatedBackground/AnimatedBackground'; // Global background animation
import Header from './components/common/Header/Header'; // Top header for public pages
import ProtectedRoute from './components/common/ProtectedRoute'; // Route guard to restrict access to authenticated users

// Global styles
import './App.css';

function App() {
  return (
    // Provide authentication context to the entire app
    <AuthProvider>
      {/* Enable client-side routing */}
      <Router>
        {/* Background visual effect rendered globally */}
        <AnimatedBackground />

        <Routes>
          {/* Public Routes */}

          {/* Landing page at root ("/") with header and animated background */}
          <Route path="/" element={<><Header /><LandingPage /></>} />

          {/* Login page with header */}
          <Route path="/login" element={<><Header /><LoginPage /></>} />

          {/*Accept Invitation page*/}
          <Route path="/accept-invitation" element={<><Header /><AcceptInvitationPage /></>} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout /> {/* Wraps nested admin routes with sidebar/topbar */}
              </ProtectedRoute>
            }
          >
            {/* Default route under /admin redirects to /admin/management */}
            <Route index element={<Navigate to="management" replace />} />

            {/* Management dashboard route */}
            <Route path="management" element={<ManagementPage />} />

            {/* Skill management route */}
            <Route path="skills" element={<SkillManagementPage />} />
          </Route>

          {/* Optional: route that redirects to main admin dashboard (useful post-login) */}
          <Route path="/dashboard" element={<Navigate to="/admin/management" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; // Export root App component
