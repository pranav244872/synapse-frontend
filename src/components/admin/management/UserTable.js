import React, { useMemo } from 'react';
import Table from '../../common/Table/Table';
import styles from './UserTable.module.css';

const UserTable = ({ users, onEdit, onDelete }) => {
  // Define table columns with headers, data accessors, and custom cell renderers
  const columns = useMemo(() => [
    // Basic user information columns with direct data binding
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Role', accessor: 'role' },
    
    // Team column with fallback display for users without team assignment
    { Header: 'Team', accessor: 'teamName', Cell: ({ row }) => row.teamName || 'N/A' },
    
    // Actions column with edit and delete buttons
    { Header: 'Actions', Cell: ({ row }) => (
      <div className={styles.actions}>
        {/* Edit button - always enabled for admin users */}
        <button onClick={() => onEdit(row)} className={`${styles.actionButton} ${styles.edit}`}>Edit</button>
        
        {/* Delete button - disabled for admin users to prevent system integrity issues */}
        <button 
          onClick={() => onDelete(row)} 
          className={`${styles.actionButton} ${styles.delete}`}
          disabled={row.role === 'admin'} // Admins cannot be deleted
        >
          Delete
        </button>
      </div>
    )},
  ], [onEdit, onDelete]); // Memoized to prevent unnecessary re-renders when callbacks change

  // Render the table component with defined columns and user data
  return <Table columns={columns} data={users} />;
};

export default UserTable;
