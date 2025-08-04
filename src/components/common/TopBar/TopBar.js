import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext'; // Authentication context for user and logout
import styles from './TopBar.module.css'; // Scoped CSS module for styling

/**
 * TopBar component displayed at the top of the admin layout.
 * Shows the current section title, logged-in user’s name, and logout button.
 */
const TopBar = () => {
  // Destructure user data and logout function from AuthContext
  const { user, logout } = useContext(AuthContext);

  return (
    <div className={styles.topBar}>
      {/* Static page title — can be made dynamic later if needed */}
      <div className={styles.pageTitle}>Organization Management</div>

      {/* User info and logout button */}
      <div className={styles.userMenu}>
        {/* Show user's name if available, otherwise fallback to "Admin" */}
        <span>Welcome, {user?.name || 'Admin'}</span>

        {/* Button that triggers logout when clicked */}
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
