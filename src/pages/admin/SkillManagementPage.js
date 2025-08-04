import React, { useState } from 'react';
import VerifiedSkillsTab from '../../components/admin/skills/VerifiedSkillsTab';
import UnverifiedSkillsTab from '../../components/admin/skills/UnverifiedSkillsTab';
import styles from './SkillManagementPage.module.css';

/**
 * SKILL MANAGEMENT PAGE COMPONENT
 * 
 * This is the main admin page for managing skills in the Synapse application.
 * It provides a tabbed interface that allows admins to efficiently process and organize
 * the skill database for optimal skill matching and system performance.
 * 
 * Key Responsibilities:
 * - Tab navigation between different skill management views
 * - Container for unverified and verified skill management workflows
 * - Consistent UI structure for skill administration
 * 
 * Business Context:
 * - Skills are central to the task recommendation system
 * - Proper skill verification ensures accurate engineer-to-task matching
 * - Alias management helps normalize different skill name variations
 * 
 * Current Context:
 * - Date: 2025-08-04 11:15:02 UTC
 * - User: pranav244872 (admin with system-wide skill management privileges)
 * 
 * Navigation Structure:
 * /admin/skills (this page)
 * ├── Unverified Queue Tab (default)
 * └── Verified Skills Tab
 */
const SkillManagementPage = () => {
  // STATE MANAGEMENT

  /**
   * Active Tab State
   * 
   * Controls which tab content is currently displayed to the user.
   * 
   * Values:
   * - 'unverified': Shows UnverifiedSkillsTab component (default)
   * - 'verified': Shows VerifiedSkillsTab component
   * 
   * Default State Rationale:
   * - Starts with 'unverified' because that's typically the admin's primary workflow
   * - Unverified skills require immediate attention (pending approval queue)
   * - New skills are constantly being submitted and need processing
   */
  const [activeTab, setActiveTab] = useState('unverified');

  // COMPONENT RENDER
  return (
    <div className={styles.managementPage}>
      {/* TAB HEADER NAVIGATION */}
      {/* 
        Provides clickable buttons for switching between different skill management views.
        Uses conditional CSS classes to show which tab is currently active.
      */}
      <div className={styles.tabHeader}>
        {/* UNVERIFIED QUEUE TAB BUTTON */}
        {/* 
          Displays the queue of skills awaiting admin approval.
          This is the primary workflow for processing new skill submissions.
        */}
        <button 
          onClick={() => setActiveTab('unverified')} 
          className={activeTab === 'unverified' ? styles.active : ''}
        >
          Unverified Queue
        </button>

        {/* VERIFIED SKILLS TAB BUTTON */}
        {/* 
          Displays the searchable database of approved skills.
          Used for ongoing maintenance, alias management, and skill deletion.
        */}
        <button 
          onClick={() => setActiveTab('verified')} 
          className={activeTab === 'verified' ? styles.active : ''}
        >
          Verified Skills
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      {/* 
        Conditionally renders the appropriate tab component based on activeTab state.
        This approach ensures only one tab's content is mounted at a time,
        optimizing performance and preventing unnecessary API calls.
      */}
      <div className={styles.tabContent}>
        {activeTab === 'unverified' ? (
          /* UNVERIFIED SKILLS TAB COMPONENT */
          /* 
            Renders when user selects "Unverified Queue" tab.

            Key Features:
            - Paginated list of skills awaiting approval
            - "Approve" action to verify skills
            - "Map as Alias" action to convert skills into aliases
            - Modal integration for alias mapping workflow

            Typical Admin Workflow:
            1. Review skill name for appropriateness
            2. Decide: Approve as new skill OR map as alias to existing skill
            3. Process skill and move to next item in queue
          */
          <UnverifiedSkillsTab />
        ) : (
          /* VERIFIED SKILLS TAB COMPONENT */
          /* 
            Renders when user selects "Verified Skills" tab.

            Key Features:
            - Searchable, paginated list of approved skills
            - "Manage Aliases" action for viewing/adding skill aliases
            - "Delete" action for removing obsolete skills
            - Real-time search with debouncing for performance

            Typical Admin Workflow:
            1. Search for specific skills needing maintenance
            2. Manage aliases to improve skill matching
            3. Delete obsolete or duplicate skills when necessary
          */
          <VerifiedSkillsTab />
        )}
      </div>
    </div>
  );
};

export default SkillManagementPage;
