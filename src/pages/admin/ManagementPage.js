import React, { useState } from 'react';

// Import tab content components
import TeamsTab from '../../components/admin/management/TeamsTab';
import UsersTab from '../../components/admin/management/UsersTab';
import InvitationsTab from '../../components/admin/management/InvitationsTab';

// Import scoped CSS module
import styles from './ManagementPage.module.css';

// Constants for tab labels (used for readability and to prevent typos)
const TABS = {
  TEAMS: 'Teams',
  USERS: 'Users',
  INVITATIONS: 'Invitations',
};

/**
 * ManagementPage is the main interface for administrators
 * to switch between Teams, Users, and Invitations views.
 */
const ManagementPage = () => {
  // Local state to track the currently active tab
  const [activeTab, setActiveTab] = useState(TABS.TEAMS);

  // Function that returns the appropriate component based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case TABS.USERS:
        return <UsersTab />;
      case TABS.INVITATIONS:
        return <InvitationsTab />;
      case TABS.TEAMS:
      default:
        return <TeamsTab />;
    }
  };

  return (
    <div className={styles.managementPage}>
      {/* Tab navigation header */}
      <div className={styles.tabHeader}>
        {Object.values(TABS).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)} // Switch tab on click
            className={
              activeTab === tab
                ? `${styles.tabButton} ${styles.active}` // Active tab styling
                : styles.tabButton
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content area that renders the selected tab's component */}
      <div className={styles.tabContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ManagementPage;
