import React from 'react';
import { Outlet } from 'react-router-dom'; // Used to render matched child routes
import Sidebar from '../components/common/Sidebar/Sidebar'; // Left navigation sidebar
import TopBar from '../components/common/TopBar/TopBar'; // Top navigation bar
import styles from './AdminLayout.module.css'; // CSS Module for scoped styling

/**
 * AdminLayout is the main layout wrapper for all admin routes.
 * It includes a sidebar, top bar, and a content area where nested routes render.
 */
const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      {/* Sidebar component (typically includes navigation links) */}
      <Sidebar />

      {/* Main content area (includes TopBar and page-specific content) */}
      <main className={styles.mainContent}>
        {/* Top navigation bar for user actions, page title, etc. */}
        <TopBar />

        {/* Renders the child route associated with the current admin route */}
        <div className={styles.pageContent}>
          <Outlet /> {/* Child routes will render here */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
