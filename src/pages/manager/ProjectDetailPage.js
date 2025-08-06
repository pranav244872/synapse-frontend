import React, { useState, useEffect, useCallback } from 'react';
// Import navigation hook for redirecting after project operations
import { useParams, useNavigate } from 'react-router-dom';
// Import API functions for project and task management including archive functionality
import { getProjectById, getProjectTasks, assignTask, updateTaskDetails, archiveProject } from '../../api/managerService';
import ProjectHeader from '../../components/manager/project/ProjectHeader';
import TaskModal from '../../components/manager/project/TaskModal';
import RecommendationsModal from '../../components/manager/project/RecommendationsModal';
import TaskTable from '../../components/manager/project/TaskTable';
import styles from './ProjectDetailPage.module.css';

// Main page component for viewing and managing project details and tasks
const ProjectDetailPage = () => {
  // Extract project ID from URL parameters
  const { projectId } = useParams();
  
  // Initialize navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // State for project details
  const [project, setProject] = useState(null);
  
  // State for all tasks in the project
  const [tasks, setTasks] = useState([]);
  
  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);
  
  // Active tab state for task filtering by status
  const [activeTab, setActiveTab] = useState('open');
  
  // Modal state management for different modal types
  const [modal, setModal] = useState({ type: null, data: null });

  // Memoized function to fetch project and task data in parallel
  const fetchData = useCallback(async () => {
    try {
      // Fetch project details and tasks simultaneously
      const [projectRes, tasksRes] = await Promise.all([
        getProjectById(projectId),
        getProjectTasks(projectId, 1, 100)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Failed to load project details", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch data when component mounts or projectId changes
  useEffect(() => { setLoading(true); fetchData(); }, [fetchData]);

  // Handler for assigning tasks to engineers using dedicated assignment endpoint
  const handleAssignTask = (taskId, userId) => {
    assignTask(taskId, userId).then(() => {
      fetchData(); // Refresh all data after successful assignment
      setModal({ type: null, data: null }); // Close the recommendations modal
    }).catch(err => console.error("Failed to assign task", err));
  };
  
  // Handler for archiving the entire project and all its tasks
  const handleArchiveProject = () => {
    // Show confirmation dialog with project name for safety
    if (window.confirm(`Are you sure you want to archive the project "${project.projectName}"? This will also archive all of its tasks.`)) {
      archiveProject(project.id)
        .then(() => {
          // Navigate back to dashboard after successful archival
          navigate('/manager/dashboard');
        })
        .catch(err => {
          console.error("Failed to archive project", err);
          // Show user-friendly error message
          alert(err.response?.data?.error || 'Could not archive the project.');
        });
    }
  };

  // Filter tasks based on currently selected tab/status
  const filteredTasks = tasks.filter(task => task.status === activeTab);
  
  // Helper function to close any open modal
  const closeModal = () => setModal({ type: null, data: null });

  // Show loading state while fetching data
  if (loading) return <div>Loading Project...</div>;
  
  // Show error state if project not found
  if (!project) return <div>Project not found.</div>;

  return (
    <div>
      {/* Header section with project info, create task button, and archive functionality */}
      <ProjectHeader 
        project={project} 
        onOpenCreateTaskModal={() => setModal({ type: 'create_task', data: null })}
        onArchive={handleArchiveProject} // Pass archive handler to header component
      />

      {/* Tab navigation for filtering tasks by status */}
      <div className={styles.tabHeader}>
        <button onClick={() => setActiveTab('open')} className={activeTab === 'open' ? styles.active : ''}>Open</button>
        <button onClick={() => setActiveTab('in_progress')} className={activeTab === 'in_progress' ? styles.active : ''}>In Progress</button>
        <button onClick={() => setActiveTab('done')} className={activeTab === 'done' ? styles.active : ''}>Done</button>
      </div>
      
      {/* Task table showing filtered tasks with edit and recommendation actions */}
      <TaskTable 
        tasks={filteredTasks}
        onEdit={(task) => setModal({ type: 'edit_task', data: task })}
        onRecommend={(task) => setModal({ type: 'recommend', data: task })}
      />

      {/* Modal for creating new tasks or editing existing task details */}
      <TaskModal 
        isOpen={modal.type === 'create_task' || modal.type === 'edit_task'}
        onClose={closeModal}
        onSuccess={fetchData}
        projectId={parseInt(projectId)}
        taskToEdit={modal.type === 'edit_task' ? modal.data : null}
        updateTaskApi={updateTaskDetails} // Pass specific update function for task details
      />
      
      {/* Modal for viewing engineer recommendations and assignments */}
      {modal.type === 'recommend' &&
        <RecommendationsModal
          isOpen={true}
          onClose={closeModal}
          onAssign={handleAssignTask} // Pass assignment handler function
          task={modal.data}
        />
      }
    </div>
  );
};

export default ProjectDetailPage;
