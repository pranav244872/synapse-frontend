import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import TaskHistory from '../../components/engineer/profile/TaskHistory';
import styles from './EngineerProfilePage.module.css';

// Main profile page for engineers to view their personal information and task history
const EngineerProfilePage = () => {
  // Get current authenticated user data from auth context
  const { user } = useContext(AuthContext);

  // Render engineer profile with user info and completed task history
  return (
    <div className={styles.profilePage}>
      {/* Profile header section with user details */}
      <div className={styles.profileHeader}>
        {/* Display engineer's full name */}
        <h1>{user?.name}</h1>
        
        {/* Display email and role information */}
        <p>{user?.email} | {user?.role}</p>
      </div>
      
      {/* Component showing paginated history of completed tasks */}
      <TaskHistory />
    </div>
  );
};

export default EngineerProfilePage;
