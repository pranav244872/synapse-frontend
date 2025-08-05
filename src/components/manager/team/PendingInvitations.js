import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Import React hooks for state management, effects, memoization, and callback optimization

import { getManagerInvitations, cancelInvitation } from '../../../api/managerService';
// Import API service functions for fetching and managing invitation data

import Table from '../../common/Table/Table';
// Import reusable Table component for displaying tabular data

import Pagination from '../../common/Pagination/Pagination';
// Import Pagination component for navigating through multiple pages of invitations

import styles from './PendingInvitations.module.css';
// Import scoped CSS module for component-specific styling

// Constant defining how many invitations to display per page
const PAGE_SIZE = 5;

/**
 * PendingInvitations Component
 * 
 * Displays a paginated table of invitations sent by the current manager.
 * Allows managers to view invitation status and cancel pending invitations.
 * 
 * Features:
 * - Paginated table view with configurable page size
 * - Real-time status display (pending, accepted, etc.)
 * - Cancel functionality for pending invitations with confirmation
 * - Automatic refresh after actions to keep data in sync
 * 
 * Used in: Manager Dashboard, Team Management pages
 */
const PendingInvitations = () => {
  // State to store the array of invitation objects for current page
  const [invitations, setInvitations] = useState([]);
  
  // State to manage pagination information (current page and total pages)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // Memoized function to fetch invitations for a specific page
  // useCallback prevents unnecessary re-renders when passed as dependency
  const fetchInvitations = useCallback((page) => {
    // Call API to get paginated invitations for the authenticated manager
    getManagerInvitations(page, PAGE_SIZE)
      .then(res => {
        // Extract data and total count from API response
        const { data, totalCount } = res.data;
        
        // Update invitations state, ensuring data is always an array
        setInvitations(Array.isArray(data) ? data : []);
        
        // Calculate and update total pages based on total count and page size
        setPagination(prev => ({ 
          ...prev, 
          totalPages: Math.ceil(totalCount / PAGE_SIZE) 
        }));
      });
      // Note: Could add .catch() here for error handling
  }, []); // Empty dependency array since function doesn't depend on external values

  // Effect to fetch invitations whenever the current page changes
  useEffect(() => {
    fetchInvitations(pagination.currentPage);
  }, [pagination.currentPage, fetchInvitations]); // Re-run when page or fetch function changes

  // Handler for canceling an invitation with user confirmation
  const handleCancel = (id) => {
    // Show confirmation dialog to prevent accidental cancellations
    if (window.confirm('Are you sure you want to cancel this invitation?')) {
      // Call API to cancel the invitation
      cancelInvitation(id)
        .then(() => {
          // Refresh the current page data after successful cancellation
          fetchInvitations(pagination.currentPage);
        });
        // Note: Could add .catch() here for error handling
    }
  };

  // Memoized column configuration for the Table component
  // useMemo prevents recalculating columns on every render
  const columns = useMemo(() => [
    { 
      Header: 'Invited Email', 
      accessor: 'email' // Maps to the 'email' property in invitation objects
    },
    { 
      Header: 'Status', 
      accessor: 'status' // Maps to the 'status' property (pending, accepted, etc.)
    },
    { 
      Header: 'Actions', 
      // Custom cell renderer for action buttons
      Cell: ({ row }) => (
        // Only show cancel button for pending invitations
        row.status === 'pending' && (
          <button 
            onClick={() => handleCancel(row.id)} 
            className={styles.cancelButton}
          >
            Cancel
          </button>
        )
      )
    },
  ], [fetchInvitations, pagination.currentPage]); // Dependencies for memoization

  return (
    <div className={styles.container}>
      {/* Main container for the pending invitations section */}
      
      <h3 className={styles.title}>Pending Invitations</h3>
      {/* Section heading */}
      
      {invitations.length > 0 ? (
        // Conditional rendering: Show table and pagination if invitations exist
        <>
          <Table columns={columns} data={invitations} />
          {/* Reusable table component with column config and invitation data */}
          
          <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setPagination(prev => ({...prev, currentPage: p}))}
          />
          {/* Pagination controls for navigating between pages */}
        </>
      ) : (
        // Fallback message when no invitations exist
        <p>You have no pending invitations.</p>
      )}
    </div>
  );
};

export default PendingInvitations;
// Export component for use in parent components (Dashboard, Team Management, etc.)
