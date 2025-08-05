import React from 'react';
import styles from './ProjectHeader.module.css';

const ProjectHeader = ({ project, onOpenCreateTaskModal }) => {
  // Return null if no project data is provided to avoid rendering errors
  if (!project) return null;

  return (
    // Main header container for project information and actions
    <div className={styles.header}>
      {/* Left side: Project title and description */}
      <div>
        <h1 className={styles.title}>{project.projectName}</h1>
        <p className={styles.description}>{project.description.String}</p>
      </div>
      
      {/* Right side: Action button to create new tasks */}
      <button onClick={onOpenCreateTaskModal} className={styles.createButton}>
        Create Task
      </button>
    </div>
  );
};

export default ProjectHeader;
