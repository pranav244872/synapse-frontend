import React, { useState } from 'react';
import CurrentMembers from '../../components/manager/team/CurrentMembers';
import PendingInvitations from '../../components/manager/team/PendingInvitations';
import InviteEngineer from '../../components/manager/team/InviteEngineer';
import styles from './ManagerTeamPage.module.css';

/**
 * Manager Team Page - Main dashboard for team management
 */
const ManagerTeamPage = () => {
  // Force refresh of PendingInvitations when new invitation is sent
  const [refreshKey, setRefreshKey] = useState(0);

  // Increment refresh key to trigger component re-render
  const handleInviteSuccess = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className={styles.container}>
      {/* Main content area - pending invitations */}
      <div className={styles.mainColumn}>
        <PendingInvitations key={refreshKey} />
      </div>
      
      {/* Sidebar - invite form and current team */}
      <div className={styles.sideColumn}>
        <InviteEngineer onSuccess={handleInviteSuccess} />
        <CurrentMembers />
      </div>
    </div>
  );
};

export default ManagerTeamPage;
