import React, { useState, useEffect} from 'react';
import { getUsers } from '../../../api/adminService';
import useDebounce from '../../../hooks/useDebounce';
import Pagination from '../../common/Pagination/Pagination';
import UserTable from './UserTable';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import styles from './UsersTab.module.css';

// Configuration constant for consistent pagination across the component
const PAGE_SIZE = 6;

const UsersTab = () => {
  // Core data state for user list and pagination metadata
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  
  // Filter and search state for user list refinement
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modal state management for edit/delete operations (type: 'edit' | 'delete' | null)
  const [modalState, setModalState] = useState({ type: null, user: null });
  
  // Debounced search to prevent excessive API calls during user typing (500ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // API call function to fetch users with filters, pagination, and error handling
  const fetchUsers = (page, search, role) => {
    getUsers(page, PAGE_SIZE, search, role)
      .then(res => {
        const { data, totalCount } = res.data;
        // Safely handle API response with fallback to empty array
        setUsers(Array.isArray(data) ? data : []);
        // Calculate total pages for pagination component
        setPagination(prev => ({ ...prev, totalPages: Math.ceil(totalCount / PAGE_SIZE) }));
      }).catch(err => {
        // Log error and clear users list on API failure
        console.error("Failed to fetch users:", err);
        setUsers([]); // Clear users on error
      });
  };

  // PAGINATION RESET: Reset to page 1 when search term or role filter changes
  // This prevents users from being on page 5 of old results when new filter yields only 1 page
  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearchTerm, roleFilter]);

  // DATA FETCHING: Trigger user fetch when page, search, or filter changes
  // This effect runs after the pagination reset effect above
  useEffect(() => {
    fetchUsers(pagination.currentPage, debouncedSearchTerm, roleFilter);
  }, [pagination.currentPage, debouncedSearchTerm, roleFilter]);

  // Success callback for modal operations to refresh user list with current filters
  const handleSuccess = () => {
    fetchUsers(pagination.currentPage, debouncedSearchTerm, roleFilter);
  };

  return (
    <div>
      {/* Search and filter controls for user list refinement */}
      <div className={styles.filters}>
        {/* Real-time search input with debouncing for performance */}
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className={styles.searchInput} 
        />
        
        {/* Role filter dropdown for user list segmentation */}
        <select 
          value={roleFilter} 
          onChange={e => setRoleFilter(e.target.value)} 
          className={styles.filterSelect}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="engineer">Engineer</option>
        </select>
      </div>
      
      {/* Main user table with action callbacks for edit/delete operations */}
      <UserTable 
        users={users} 
        onEdit={(user) => setModalState({ type: 'edit', user })}
        onDelete={(user) => setModalState({ type: 'delete', user })}
      />
      
      {/* Pagination controls for large user lists */}
      <Pagination 
        currentPage={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        onPageChange={(p) => setPagination(prev => ({...prev, currentPage: p}))} 
      />

      {/* Conditional modal rendering for user edit operations (role/team changes) */}
      {modalState.type === 'edit' && 
        <EditUserModal 
          user={modalState.user}
          isOpen={true}
          onClose={() => setModalState({ type: null, user: null })}
          onSuccess={handleSuccess}
        />
      }
      
      {/* Conditional modal rendering for user deletion with impact analysis */}
      {modalState.type === 'delete' && 
        <DeleteUserModal 
          user={modalState.user}
          isOpen={true}
          onClose={() => setModalState({ type: null, user: null })}
          onSuccess={handleSuccess}
        />
      }
    </div>
  );
};

export default UsersTab;
