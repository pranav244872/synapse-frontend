import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getSkills, deleteSkill } from '../../../api/adminService';
import useDebounce from '../../../hooks/useDebounce';
import Table from '../../common/Table/Table';
import Pagination from '../../common/Pagination/Pagination';
import ManageAliasesModal from './ManageAliasesModal';
import CreateSkillModal from './CreateSkillModal';
import styles from './VerifiedSkillsTab.module.css';

// Number of skills displayed per page
const PAGE_SIZE = 6;

/**
 * VERIFIED SKILLS TAB COMPONENT
 * Enhanced with manual skill creation capability for proactive skill management
 */
const VerifiedSkillsTab = () => {
  // STATE MANAGEMENT
  const [skills, setSkills] = useState([]); // Array of verified skills for current page
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 }); // Pagination state
  const [searchTerm, setSearchTerm] = useState(''); // Raw search input from user
  const [manageAliasesModal, setManageAliasesModal] = useState({ isOpen: false, skill: null }); // Alias management modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Create skill modal state
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounced search to prevent excessive API calls

  // API call to fetch verified skills with optional search filtering
  const fetchSkills = useCallback((page, search) => {
    getSkills(true, page, PAGE_SIZE, search)
      .then(res => {
        const { data, totalCount } = res.data;
        setSkills(Array.isArray(data) ? data : []); // Set skills with defensive programming
        setPagination(prev => ({ ...prev, totalPages: Math.ceil(totalCount / PAGE_SIZE) })); // Calculate total pages
      });
  }, []);

  // Fetch skills when page or search term changes
  useEffect(() => {
    fetchSkills(pagination.currentPage, debouncedSearchTerm);
  }, [pagination.currentPage, debouncedSearchTerm, fetchSkills]);

  // Delete skill with confirmation dialog
  const handleDelete = (skillId) => {
    if(window.confirm('Are you sure? This may affect user data.')) {
        deleteSkill(skillId).then(() => fetchSkills(pagination.currentPage, debouncedSearchTerm));
    }
  };
  
  // Handle successful skill creation by clearing search and resetting to page 1
  const handleCreateSuccess = () => {
    setSearchTerm(''); // Clear search to show the new skill
    if (pagination.currentPage === 1) {
      fetchSkills(1, ''); // Refresh if already on page 1
    } else {
      setPagination(prev => ({...prev, currentPage: 1})); // Navigate to page 1
    }
  };

  // Table column configuration with skill name and action buttons
  const columns = useMemo(() => [
    { Header: 'Skill Name', accessor: 'skillName' }, // Direct field access
    { Header: 'Actions', Cell: ({ row }) => ( // Custom action buttons
        <div className={styles.actions}>
            <button onClick={() => setManageAliasesModal({ isOpen: true, skill: row })} className={`${styles.actionButton} ${styles.manage}`}>Manage Aliases</button>
            <button onClick={() => handleDelete(row.id)} className={`${styles.actionButton} ${styles.delete}`}>Delete</button>
        </div>
    )},
  ], [debouncedSearchTerm, pagination.currentPage, fetchSkills]);

  return (
    <div>
      {/* HEADER WITH SEARCH AND CREATE BUTTON */}
      <div className={styles.header}>
        <input type="text" placeholder="Search verified skills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={styles.searchInput} />
        <button onClick={() => setIsCreateModalOpen(true)} className={`${styles.actionButton} ${styles.create}`}>
          Create New Skill
        </button>
      </div>

      {/* TABLE AND PAGINATION */}
      <Table columns={columns} data={skills} />
      <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={(p) => setPagination(prev => ({...prev, currentPage: p}))} />

      {/* CONDITIONAL MODALS */}
      {manageAliasesModal.isOpen &&
        <ManageAliasesModal
          skill={manageAliasesModal.skill}
          onClose={() => setManageAliasesModal({ isOpen: false, skill: null })}
        />
      }
      <CreateSkillModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default VerifiedSkillsTab;
