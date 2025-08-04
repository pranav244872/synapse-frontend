import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

// Importing icons from react-icons (Remix Icon set)
import { RiDashboardFill, RiToolsFill } from 'react-icons/ri';

/**
 * Sidebar component for admin layout.
 * Includes navigation links to different admin sections.
 * Active route is styled differently for user clarity.
 */
const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      {/* Logo or branding area */}
      <div className={styles.logo}>
        \\Synapse
      </div>

      {/* Navigation links */}
      <nav className={styles.nav}>
        {/* Management Dashboard Link */}
        <NavLink
          to="/admin/management"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <RiDashboardFill className={styles.icon} />
          <span>Management</span>
        </NavLink>

        {/* Skill Management Link */}
        <NavLink
          to="/admin/skills"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          <RiToolsFill className={styles.icon} />
          <span>Skill Management</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
