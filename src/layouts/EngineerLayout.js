import React from 'react';
import { Outlet } from 'react-router-dom';
import EngineerSidebar from '../components/common/EngineerSidebar/EngineerSidebar';
import TopBar from '../components/common/TopBar/TopBar';
import styles from './EngineerLayout.module.css';

// Main layout wrapper component for all engineer pages
const EngineerLayout = () => {
  return (
    // Root container for the entire engineer interface layout
    <div className={styles.layout}>
      {/* Left sidebar navigation for engineer-specific routes */}
      <EngineerSidebar />
      
      {/* Main content area containing top bar and page content */}
      <main className={styles.mainContent}>
        {/* Top navigation bar with user info and global actions */}
        <TopBar />
        
        {/* Content container where nested route components render */}
        <div className={styles.pageContent}>
          {/* React Router outlet for rendering child route components */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EngineerLayout;
