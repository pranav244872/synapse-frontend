import React, { useState } from 'react';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal'; // Import the modal
import styles from './ProjectList.module.css';

const ProjectList = ({ projects, onProjectCreated }) => {
  // State to control the visibility of the create project modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Main container for the project list section */}
      <div className={styles.container}>
        {/* Header section with title and create button */}
        <div className={styles.header}>
          <h3 className={styles.title}>Active Projects</h3>
          <button onClick={() => setIsModalOpen(true)} className={styles.createButton}>
            Create Project
          </button>
        </div>
        
        {/* Grid layout to display project cards */}
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      
      {/* Modal component for creating new projects */}
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onProjectCreated}
      />
    </>
  );
};

export default ProjectList;
