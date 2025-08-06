import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import styles from './ProjectList.module.css';

// Component that displays a list of projects with filtering and creation capabilities
const ProjectList = ({ projects, onProjectCreated, activeFilter, onFilterChange }) => {
  // State to control the visibility of the create project modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Main container for the project list */}
      <div className={styles.container}>
        {/* Header section with filter controls and create button */}
        <div className={styles.header}>
          {/* View switcher to toggle between active and archived projects */}
          <div className={styles.viewSwitcher}>
            {/* Button to show active projects */}
            <button onClick={() => onFilterChange(false)} className={!activeFilter ? styles.active : ''}>Active</button>
            {/* Button to show archived projects */}
            <button onClick={() => onFilterChange(true)} className={activeFilter ? styles.active : ''}>Archived</button>
          </div>
          {/* Button to open the create project modal */}
          <button onClick={() => setIsModalOpen(true)} className={styles.createButton}>
            Create Project
          </button>
        </div>
        {/* Grid layout for displaying project cards */}
        <div className={styles.grid}>
          {/* Render a ProjectCard for each project in the list */}
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {/* Show message when no projects are found for current filter */}
          {projects.length === 0 && <p className={styles.noProjects}>No {activeFilter ? 'archived' : 'active'} projects found.</p>}
        </div>
      </div>
      {/* Modal for creating new projects */}
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onProjectCreated}
      />
    </>
  );
};

export default ProjectList;
