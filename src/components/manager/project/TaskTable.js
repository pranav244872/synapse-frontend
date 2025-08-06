import React, { useMemo } from 'react';
import Table from '../../common/Table/Table';
import styles from './TaskTable.module.css';

// Component that renders tasks in a tabular format with actions
const TaskTable = ({ tasks, onEdit, onRecommend }) => {
  // Memoized column configuration to prevent unnecessary re-renders
  const columns = useMemo(() => [
    // Basic title column displaying task name
    { Header: 'Title', accessor: 'title' },
    
    // Assignee column with fallback text for unassigned tasks
    { Header: 'Assignee', accessor: 'assigneeName', Cell: ({ row }) => row.assigneeName || 'Unassigned' },
    
    // Priority column with styled priority badges
    { Header: 'Priority', accessor: 'priority', Cell: ({ row }) => (
        <span className={`${styles.priority} ${styles[row.priority]}`}>{row.priority}</span>
    )},
    
    // Actions column with edit and recommendation buttons
    { Header: 'Actions', Cell: ({ row }) => (
      <div className={styles.actions}>
        {/* Edit button available for all tasks */}
        <button onClick={() => onEdit(row)} className={`${styles.actionButton} ${styles.edit}`}>Edit Details</button>
        {/* Recommendation button only shown for open tasks */}
        {row.status === 'open' && (
          <button onClick={() => onRecommend(row)} className={`${styles.actionButton} ${styles.recommend}`}>Get Recommendations</button>
        )}
      </div>
    )},
  ], [onEdit, onRecommend]); // Dependencies for memoization

  // Render the table with configured columns and task data
  return <Table columns={columns} data={tasks} />;
};

export default TaskTable;
