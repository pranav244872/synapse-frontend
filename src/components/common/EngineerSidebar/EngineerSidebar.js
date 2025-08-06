import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './EngineerSidebar.module.css';

// Main sidebar component for engineer navigation
const EngineerSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      {/* Application logo/branding display */}
      <div className={styles.logo}>\\Synapse</div>
      
      {/* Navigation menu container */}
      <nav className={styles.nav}>
        {/* Link to engineer workspace with active state styling */}
        <NavLink to="/engineer/workspace" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <span>My Workspace</span>
        </NavLink>
        
        {/* Link to engineer profile with active state styling */}
        <NavLink to="/engineer/profile" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
          <span>My Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default EngineerSidebar;
