import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from '../components/common/ManagerSidebar/ManagerSidebar';
import TopBar from '../components/common/TopBar/TopBar';
import styles from './ManagerLayout.module.css';

/**
 * ManagerLayout provides the consistent layout structure for all manager pages.
 * Combines sidebar navigation, top bar, and dynamic content area using React Router's Outlet.
 * This layout wraps all routes under /manager/* to maintain uniform UI structure.
 */
const ManagerLayout = () => {
  return (
    <div className={styles.managerLayout}>
      {/* Left sidebar with manager navigation links (Dashboard, Team Management) */}
      <ManagerSidebar />
      
      {/* Main content area containing top bar and page content */}
      <main className={styles.mainContent}>
        {/* Top navigation bar with user info and global actions */}
        <TopBar />
        
        {/* Dynamic content area where nested route components render */}
        <div className={styles.pageContent}>
          {/* Outlet renders the matched child route component (Dashboard, Team, etc.) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ManagerLayout;
