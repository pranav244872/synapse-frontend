import React from 'react';
import styles from './CurrentTask.module.css';

// Component to display the engineer's current active task or "no task" state
const CurrentTask = ({ task, onComplete }) => {
  // Handle case when engineer has no active task assigned
  if (!task) {
    return (
      <div className={`${styles.card} ${styles.noTaskCard}`}>
        {/* Encouraging message for engineers with no current assignments */}
        <h2>Ready for Next Assignment</h2>
        <p>You have no task currently in progress. Great work!</p>
      </div>
    );
  }

  // Render active task details with completion option
  return (
    <div className={styles.card}>
      {/* Task header section with status and details */}
      <div className={styles.header}>
        {/* Visual indicator showing task is currently active */}
        <span className={styles.eyebrow}>IN PROGRESS</span>
        
        {/* Main task title */}
        <h2 className={styles.title}>{task.title}</h2>
        
        {/* Project context for the task */}
        <p className={styles.project}>in project: <strong>{task.projectName}</strong></p>
      </div>
      
      {/* Action button to mark task as completed */}
      <button onClick={() => onComplete(task.id)} className={styles.completeButton}>
        Mark as Complete
      </button>
    </div>
  );
};

export default CurrentTask;
