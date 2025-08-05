import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ManagerSidebar.module.css';

/**
 * ManagerSidebar component provides navigation for manager-specific routes.
 * Features the SYNAPSE logo and navigation links with active state styling.
 * Uses React Router's NavLink for automatic active link detection.
 */
const ManagerSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      {/* SYNAPSE logo/branding at the top of the sidebar */}
      <div className={styles.logo}>
        \\Synapse
      </div>
      
      {/* Main navigation menu for manager features */}
      <nav className={styles.nav}>
        {/* Dashboard link - main manager overview with team stats */}
        <NavLink 
          to="/manager/dashboard" 
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <span>Dashboard</span>
        </NavLink>
        
        {/* Team Management link - view and manage team members */}
        <NavLink 
          to="/manager/team" 
          className={({ isActive }) => 
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <span>Team Management</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default ManagerSidebar;
