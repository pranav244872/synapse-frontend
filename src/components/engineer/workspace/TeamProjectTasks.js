import React, { useState, useEffect } from 'react';
import { getProjectTasksReadOnly } from '../../../api/engineerService';
import styles from './TeamProjectTasks.module.css';

// Component to display a read-only table of all tasks in the engineer's current project
const TeamProjectTasks = ({ projectId, currentTaskId }) => {
  // State to store all tasks for the current project
  const [tasks, setTasks] = useState([]);

  // Effect to fetch project tasks when projectId changes
  useEffect(() => {
    // Only fetch if a valid projectId is provided
    if (projectId) {
      // Call API to get all tasks for this project (read-only view)
      getProjectTasksReadOnly(projectId).then(res => setTasks(res.data));
    }
  }, [projectId]);

  // Don't render anything if no project is selected
  if (!projectId) return null;

  // Render table with all project tasks and their current status
  return (
    <div className={styles.container}>
      {/* Section title for team activity overview */}
      <h3 className={styles.title}>Team's Project Activity</h3>
      
      {/* Table displaying all tasks in the project */}
      <table className={styles.table}>
        <thead>
          <tr>
            {/* Column headers for task information */}
            <th>Task</th>
            <th>Status</th>
            <th>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through all tasks to create table rows */}
          {tasks.map(task => (
            <tr 
              key={task.id} 
              // Highlight the row if this is the engineer's current active task
              className={task.id === currentTaskId ? styles.highlight : ''}
            >
              {/* Task title/name */}
              <td>{task.title}</td>
              
              {/* Task status with formatting and styling */}
              <td>
                <span className={`${styles.status} ${styles[task.status]}`}>
                  {/* Convert underscores to spaces for display */}
                  {task.status.replace('_', ' ')}
                </span>
              </td>
              
              {/* Assigned engineer name or "Unassigned" if no one is assigned */}
              <td>{task.assigneeName?.String || 'Unassigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamProjectTasks;
