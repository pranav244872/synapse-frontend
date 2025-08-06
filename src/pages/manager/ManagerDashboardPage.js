import React, { useState, useEffect } from 'react';
import { getDashboardStats, getTeamMembers, getProjects } from '../../api/managerService';
import StatCard from '../../components/manager/dashboard/StatCard';
import TeamAvailability from '../../components/manager/dashboard/TeamAvailability';
import ProjectList from '../../components/manager/dashboard/ProjectList';
import styles from './ManagerDashboardPage.module.css';

// Main dashboard page component for managers
const ManagerDashboardPage = () => {
  // State to store dashboard statistics (active projects, open tasks, engineers)
  const [stats, setStats] = useState(null);
  
  // State to store team member data and availability
  const [members, setMembers] = useState([]);
  
  // State to store project list data
  const [projects, setProjects] = useState([]);
  
  // Loading state for initial dashboard data fetch
  const [loading, setLoading] = useState(true);
  
  // Error state for handling API failures
  const [error, setError] = useState('');
  
  // Filter state for project view (false = active projects, true = archived projects)
  const [projectFilter, setProjectFilter] = useState(false);

  // Initial data fetch for dashboard stats and team members
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats and team members simultaneously for better performance
        const [statsRes, membersRes] = await Promise.all([
          getDashboardStats(),
          getTeamMembers(),
        ]);
        setStats(statsRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Separate effect for projects to allow refetching when filter changes
  useEffect(() => {
    // Fetch page 1 of 20 projects based on current filter (active/archived)
    getProjects(1, 20, projectFilter)
      .then(projectsRes => {
        setProjects(projectsRes.data.data);
      })
      .catch(err => console.error("Failed to load projects", err));
  }, [projectFilter]);

  // Handler for when a new project is created - switches to active view
  const handleProjectCreated = () => {
    // When a project is created, switch to the active view and refetch
    setProjectFilter(false);
  };

  // Show loading state while fetching initial data
  if (loading) return <div>Loading Dashboard...</div>;
  
  // Show error message if data fetch failed
  if (error) return <div>{error}</div>;

  return (
    // Main dashboard container
    <div className={styles.dashboard}>
      {/* Top row: Statistics cards showing key metrics */}
      <div className={styles.statsGrid}>
        <StatCard title="Active Projects" value={stats.activeProjects} />
        <StatCard title="Open Tasks" value={stats.openTasks} />
        <StatCard title="Available Engineers" value={`${stats.availableEngineers} / ${stats.totalEngineers}`} />
      </div>
      {/* Two-column layout for main content and sidebar */}
      <div className={styles.columns}>
        {/* Left column: Project list with filtering and creation capabilities */}
        <div className={styles.mainColumn}>
          <ProjectList 
            projects={projects} 
            onProjectCreated={handleProjectCreated}
            activeFilter={projectFilter}
            onFilterChange={setProjectFilter}
          />
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
