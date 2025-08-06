import React, { useState, useEffect } from 'react';
import { getTaskDetails } from '../../../api/engineerService';
import styles from './TaskDetailsPanel.module.css';

// Component to display detailed information about a selected task
const TaskDetailsPanel = ({ taskId }) => {
  // State to store the full task details from API
  const [details, setDetails] = useState(null);
  
  // Loading state to show spinner while fetching data
  const [loading, setLoading] = useState(false);

  // Effect to fetch task details whenever taskId changes
  useEffect(() => {
    // Only fetch if a valid taskId is provided
    if (taskId) {
      setLoading(true);
      // Call API to get comprehensive task information
      getTaskDetails(taskId)
        .then(res => setDetails(res.data))
        .finally(() => setLoading(false));
    } else {
      // Clear details when no task is selected
      setDetails(null);
    }
  }, [taskId]);

  // Show placeholder message when no task is selected
  if (!taskId) {
    return <div className={styles.panel}><p className={styles.placeholder}>Select a task to see details</p></div>;
  }
  
  // Show loading indicator while fetching data
  if (loading) return <div className={styles.panel}><p>Loading details...</p></div>;
  
  // Show error message if data couldn't be loaded
  if (!details) return <div className={styles.panel}><p>Could not load task details.</p></div>;

  // Render complete task details with all information
  return (
    <div className={styles.panel}>
      {/* Main task title */}
      <h3>{details.title}</h3>
      
      {/* Task description content */}
      <p className={styles.description}>{details.description}</p>
      
      {/* Skills section header */}
      <h4>Required Skills</h4>
      
      {/* List of skills required for this task */}
      <div className={styles.skillList}>
        {details.requiredSkills.map(skill => 
          <span key={skill.id} className={styles.skillTag}>{skill.skillName}</span>
        )}
      </div>
      
      {/* Placeholder for future activity log feature */}
      {/* Activity log can be added here later */}
    </div>
  );
};

export default TaskDetailsPanel;
