import React from 'react';
import styles from './ProjectHeader.module.css';

// Component that displays project header with title, description, and action buttons
const ProjectHeader = ({ project, onOpenCreateTaskModal, onArchive }) => {
  // Return null if no project data is provided
  if (!project) return null;

  return (
    // Main header container
    <div className={styles.header}>
      {/* Left section: Project information */}
      <div>
        {/* Project title display */}
        <h1 className={styles.title}>{project.projectName}</h1>
        {/* Project description display */}
        <p className={styles.description}>{project.description.String}</p>
      </div>
      {/* Right section: Action buttons */}
      <div className={styles.actions}>
        {/* Button to open task creation modal */}
        <button onClick={onOpenCreateTaskModal} className={styles.createButton}>
          Create Task
        </button>
        {/* Archive button - only visible for non-archived projects */}
        {!project.archived && (
          <button onClick={onArchive} className={styles.archiveButton}>
            Archive Project
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
