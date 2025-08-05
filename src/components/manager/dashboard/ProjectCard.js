import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';

/**
 * ProjectCard displays a clickable project overview with task completion progress.
 * Used in project lists to show project name, task statistics, and visual progress bar.
 * Clicking the card navigates to the detailed project view with full task management.
 */
const ProjectCard = ({ project }) => {
    // Calculate completion percentage, handling edge case of projects with no tasks
    const progress = project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0;

    return (
        /* Entire card is clickable and navigates to project detail page */
        <Link to={`/manager/projects/${project.id}`} className={styles.projectCard}>
            {/* Project name as the main heading */}
            <h4 className={styles.projectName}>{project.projectName}</h4>

            {/* Task completion statistics and percentage display */}
            <div className={styles.progressInfo}>
                <span>{project.completedTasks} / {project.totalTasks} Tasks Completed</span>
                <span>{Math.round(progress)}%</span>
            </div>

            {/* Visual progress bar showing completion percentage */} 
            <div className={styles.progressBar}>

                {/* Filled portion of progress bar, width determined by completion percentage */}
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
        </Link>
    );
};

export default ProjectCard;
