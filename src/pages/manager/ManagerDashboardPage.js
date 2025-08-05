import React, { useState, useEffect } from 'react';
import { getDashboardStats, getTeamMembers, getProjects } from '../../api/managerService';
import StatCard from '../../components/manager/dashboard/StatCard';
import TeamAvailability from '../../components/manager/dashboard/TeamAvailability';
import ProjectList from '../../components/manager/dashboard/ProjectList';
import styles from './ManagerDashboardPage.module.css';

/**
 * ManagerDashboardPage is the main overview page for team managers.
 * Displays key metrics, active projects, and team member availability in a unified view.
 * Provides managers with essential information for team and project oversight.
 */
const ManagerDashboardPage = () => {
  // Dashboard statistics (active projects, open tasks, engineer counts)
  const [stats, setStats] = useState(null);
  
  // Team members list with availability status
  const [members, setMembers] = useState([]);
  
  // Active projects list with task completion data
  const [projects, setProjects] = useState([]);
  
  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);
  
  // Error message for failed API requests
  const [error, setError] = useState('');

  // Fetch all dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data in parallel for optimal performance
        const [statsRes, membersRes, projectsRes] = await Promise.all([
          getDashboardStats(),           // Get key metrics and counts
          getTeamMembers(),             // Get team member availability
          getProjects()                 // Get first page of active projects
        ]);

        // Update state with fetched data
        setStats(statsRes.data);
        setMembers(membersRes.data);
        setProjects(projectsRes.data.data); // Extract projects from paginated response
      } catch (err) {
        // Handle API errors gracefully
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        // Always stop loading regardless of success/failure
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Callback to refresh project list after a new project is created
  const handleProjectCreated = () => {
    // A simple way to refresh the project list
    getProjects().then(projectsRes => {
      setProjects(projectsRes.data.data);
    });
  };

  // Show loading state while fetching data
  if (loading) return <div>Loading Dashboard...</div>;
  
  // Show error message if data fetch failed
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.dashboard}>
      {/* Top row of key performance metrics */}
      <div className={styles.statsGrid}>
        <StatCard title="Active Projects" value={stats.activeProjects} />
        <StatCard title="Open Tasks" value={stats.openTasks} />
        <StatCard title="Available Engineers" value={`${stats.availableEngineers} / ${stats.totalEngineers}`} />
      </div>
      
      {/* Main content area with two-column layout */}
      <div className={styles.columns}>
        {/* Left column: Project overview and management */}
        <div className={styles.mainColumn}>
          {/* Pass the callback to refresh projects when new one is created */}
          <ProjectList projects={projects} onProjectCreated={handleProjectCreated} />
        </div>
        
        {/* Right column: Team availability sidebar */}
        <div className={styles.sideColumn}>
          <TeamAvailability members={members} />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
