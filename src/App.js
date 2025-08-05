import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth context to manage authentication state globally
import { AuthProvider } from './context/AuthContext';

// Layouts and Pages
import AdminLayout from './layouts/AdminLayout'; // Admin dashboard layout with sidebar and topbar
import ManagerLayout from './layouts/ManagerLayout'; // Manager dashboard layout with navigation
import LandingPage from './pages/LandingPage'; // Public home page
import LoginPage from './pages/LoginPage'; // Login form for users
import ManagementPage from './pages/admin/ManagementPage'; // Admin management interface
import SkillManagementPage from './pages/admin/SkillManagementPage'; // Admin skill management view
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage'; // Manager main dashboard with stats
import ProjectDetailPage from './pages/manager/ProjectDetailPage'; // Individual project view with tasks
import ManagerTeamPage from './pages/manager/ManagerTeamPage'; // Team members and availability view
import AcceptInvitationPage from './pages/AcceptInvitationPage';

// Common UI components
import AnimatedBackground from './components/common/AnimatedBackground/AnimatedBackground'; // Global background animation
import Header from './components/common/Header/Header'; // Top header for public pages
import ProtectedRoute from './components/common/ProtectedRoute'; // Route guard with role-based access control

// Global styles
import './App.css';

function App() {
  return (
    // Router must be outermost to provide navigation context for useNavigate() hooks
    <Router>
      {/* AuthProvider can now use useNavigate() since it's inside Router context */}
      <AuthProvider>
        {/* Background visual effect rendered globally */}
        <AnimatedBackground />

        <Routes>
          {/* Public Routes */}

          {/* Landing page at root ("/") with header and animated background */}
          <Route path="/" element={<><Header /><LandingPage /></>} />

          {/* Login page with header */}
          <Route path="/login" element={<><Header /><LoginPage /></>} />

          {/* Accept Invitation page */}
          <Route path="/accept-invitation" element={<><Header /><AcceptInvitationPage /></>} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Default route under /admin redirects to /admin/management */}
            <Route index element={<Navigate to="management" replace />} />

            {/* Management dashboard route */}
            <Route path="management" element={<ManagementPage />} />

            {/* Skill management route */}
            <Route path="skills" element={<SkillManagementPage />} />
          </Route>

          {/* Protected Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerLayout />
            </ProtectedRoute>
          }>
            {/* Default route under /manager redirects to /manager/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Manager main dashboard with team stats */}
            <Route path="dashboard" element={<ManagerDashboardPage />} />

            {/* Individual project detail page with tasks */}
            <Route path="projects/:projectId" element={<ProjectDetailPage />} />

            {/* Team members and availability overview */}
            <Route path="team" element={<ManagerTeamPage />} />
          </Route>
          
          {/* Generic dashboard redirect for fallback navigation */}
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; // Export root App component
