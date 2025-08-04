import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getSkills, updateSkillVerification, deleteSkill } from '../../../api/adminService';
import Table from '../../common/Table/Table';
import Pagination from '../../common/Pagination/Pagination';
import MapAliasModal from './MapAliasModal';
import styles from './UnverifiedSkillsTab.module.css';

// Constant defining how many unverified skills to display per page
const PAGE_SIZE = 8;

/**
 * UNVERIFIED SKILLS TAB COMPONENT
 * 
 * This component manages the "Unverified Queue" tab in the admin skill management interface.
 * It displays skills that have been extracted from user resumes but not yet reviewed by admins.
 * This is the primary workflow for processing new skill submissions in the system.
 * 
 */
const UnverifiedSkillsTab = () => {
    // STATE MANAGEMENT

    // Array to store the list of unverified skills fetched from the API
    // These are skills extracted from resumes awaiting admin review
    const [skills, setSkills] = useState([]);

    // Object to track pagination state for navigating through skill queue
    // currentPage: which page of unverified skills the admin is currently viewing
    // totalPages: total number of pages based on total unverified skills / PAGE_SIZE
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

    // Object to manage the Map Alias modal state for complex workflow
    // isOpen: boolean indicating if the alias mapping modal should be displayed
    // skillToAlias: the unverified skill object that will be mapped as an alias
    const [modalState, setModalState] = useState({ isOpen: false, skillToAlias: null });

    /**
   * FETCH SKILLS FUNCTION
   * 
   * useCallback prevents this function from being recreated on every render,
   * which is crucial for performance since it's used as a dependency in useEffect.
   * 
   * @param {number} page - The page number to fetch (1-indexed)
   * 
   * Makes API call to retrieve unverified skills for admin review:
   * - false = verified parameter (we want only unverified skills)
   * - page = current page number for pagination
   * - PAGE_SIZE = number of skills per page (15)
   */
    const fetchSkills = useCallback((page) => {
        // API call: GET /admin/skills?verified=false&page_id={page}&page_size={PAGE_SIZE}
        getSkills(false, page, PAGE_SIZE)
            .then(res => {
                const { data, totalCount } = res.data; // Destructure API response

                // Defensive programming: ensure data is always an array even if API returns unexpected format
                setSkills(Array.isArray(data) ? data : []);

                // Calculate total pages needed for pagination component
                // Math.ceil ensures we round up (e.g., 31 skills / 15 per page = 3 pages, not 2.07)
                setPagination(prev => ({ ...prev, totalPages: Math.ceil(totalCount / PAGE_SIZE) }));
            })
            .catch(err => {
                console.error("Failed to fetch unverified skills:", err);
                // On error, set empty state to prevent UI issues
                setSkills([]);
                setPagination(prev => ({ ...prev, totalPages: 1 }));
            });
    }, []); // Empty dependency array means this function never changes

    /**
   * EFFECT FOR DATA FETCHING
   * 
   * Automatically fetches skills whenever:
   * - Component mounts (initial load of skill queue)
   * - Admin navigates to a different page (pagination.currentPage changes)
   * - fetchSkills function reference changes (shouldn't happen due to useCallback)
   */
    useEffect(() => { 
    fetchSkills(pagination.currentPage); 
}, [pagination.currentPage, fetchSkills]);

/**
   * SKILL APPROVAL HANDLER
   * 
   * Called when admin clicks "Approve" button on an unverified skill.
   * Updates the skill's verification status from false to true, making it available system-wide.
   * 
   * @param {number} skillId - The ID of the skill to approve
   * 
   */
const handleApprove = (skillId) => {
    // API call: PATCH /admin/skills/{skillId} with { is_verified: true }
    updateSkillVerification(skillId, true)
      .then(() => {
        // Refresh current page after successful approval
        // The approved skill will no longer appear in the unverified queue
        fetchSkills(pagination.currentPage);
    })
      .catch(err => {
        console.error("Failed to approve skill:", err);
        // In production, you might want to show user-friendly error messages
    });
};

/**
   * SKILL REJECTION HANDLER
   * 
   * Called when admin clicks "Reject" button on an unverified skill.
   * Permanently removes inappropriate, duplicate, or low-quality skills from the system.
   * 
   * @param {number} skillId - The ID of the skill to reject and delete
   * 
   * Workflow:
   * 1. Show confirmation dialog warning about permanent deletion
   * 2. If confirmed, call API to delete the skill entirely
   * 3. On success, refresh current page to show updated queue
   * 
   * Use Cases:
   * - Reject clearly inappropriate skills (e.g., nonsense text from NLP errors)
   * - Remove duplicates when similar skills already exist
   * - Filter out skills that are too generic or specific
   * - Maintain high quality in the skill database
   */
const handleReject = (skillId) => {
    // Show confirmation dialog with clear warning about permanent deletion
    if (window.confirm('Are you sure you want to reject and delete this skill? This cannot be undone.')) {
        // API call: DELETE /admin/skills/{skillId}
        deleteSkill(skillId)
          .then(() => {
            // Refresh current page after successful deletion
            // The rejected skill will be permanently removed from the system
            fetchSkills(pagination.currentPage);
        })
          .catch(err => {
            console.error("Failed to reject skill:", err);
            // In production, you might want to show user-friendly error messages
        });
    }
    // If admin cancels confirmation, no action is taken
};

/**
   * SUCCESS HANDLER FOR MODAL OPERATIONS
   * 
   * Called when the Map Alias modal completes successfully.
   * When a skill is mapped as an alias, it's removed from the unverified queue,
   * so we need to refresh the data and potentially adjust pagination.
   * 
   */
const handleSuccess = () => {
    fetchSkills(1); // Fetch page 1 with fresh data
    setPagination(prev => ({...prev, currentPage: 1})); // Reset pagination to page 1
};

/**
   * TABLE COLUMN DEFINITIONS
   * 
   * useMemo prevents these column definitions from being recreated on every render,
   * which is important for performance since the Table component uses these as props.
   * 
   */
const columns = useMemo(() => [
    { 
      Header: 'Skill Name', 
      accessor: 'skillName' // Direct field access - Table component will show row.skill_name
    },
    { 
      Header: 'Actions', 
      // Custom cell renderer that creates three action buttons for each skill row
      Cell: ({ row }) => (
        <div className={styles.actions}>
          {/* APPROVE BUTTON */}
          {/* Moves skill to verified status, making it available system-wide */}
          <button 
            onClick={() => handleApprove(row.id)} 
            className={`${styles.actionButton} ${styles.approve}`}
          >
            Approve
          </button>

          {/* REJECT BUTTON (NEW) */}
          {/* Permanently deletes inappropriate or low-quality skills */}
          <button 
            onClick={() => handleReject(row.id)} 
            className={`${styles.actionButton} ${styles.reject}`}
          >
            Reject
          </button>

          {/* MAP AS ALIAS BUTTON */}
          {/* Opens modal to map this skill as an alias to an existing verified skill */}
          <button 
          onClick={() => {
            setModalState({ isOpen: true, skillToAlias: row });
          }} 
            className={`${styles.actionButton} ${styles.map}`}
          >
            Map as Alias
          </button>
        </div>
      )
    },
  ], [fetchSkills]); // Dependency on fetchSkills ensures handlers have access to current function

  // COMPONENT RENDER
  return (
    <div>
      {/* TABLE COMPONENT */}
      {/* Displays unverified skills in a tabular format using the reusable Table component */}
      <Table columns={columns} data={skills} />

      {/* PAGINATION COMPONENT */}
      {/* Provides navigation controls for moving between pages of the skill queue */}
      <Pagination 
        currentPage={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        onPageChange={(p) => setPagination(prev => ({...prev, currentPage: p}))} 
      />

      {/* CONDITIONAL MODAL RENDERING */}
      {/* Only renders the MapAliasModal when isOpen is true */}
      {/* This approach avoids mounting/unmounting the modal component unnecessarily */}
      {modalState.isOpen && 
    <MapAliasModal 
        skillToAlias={modalState.skillToAlias} // Pass the skill to be mapped as an alias
        onClose={() => setModalState({ isOpen: false, skillToAlias: null })} // Reset modal state
        onSuccess={handleSuccess} // Refresh data after successful alias mapping
    />
      }
    </div>
  );
};

export default UnverifiedSkillsTab;
