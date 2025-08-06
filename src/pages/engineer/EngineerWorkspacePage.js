import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentTask, completeTask } from '../../api/engineerService';
import CurrentTask from '../../components/engineer/workspace/CurrentTask';
import TaskDetailsPanel from '../../components/engineer/workspace/TaskDetailsPanel';
import TeamProjectTasks from '../../components/engineer/workspace/TeamProjectTasks';
import styles from './EngineerWorkspacePage.module.css';

// Main workspace page for engineers to view and manage their current task
const EngineerWorkspacePage = () => {
  // State for the engineer's currently assigned active task
  const [currentTask, setCurrentTask] = useState(null);
  
  // State for which task details to show in the side panel
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  // Loading state for initial workspace data fetch
  const [loading, setLoading] = useState(true);

  // Memoized function to fetch current workspace data from API
  const fetchWorkspace = useCallback(() => {
    setLoading(true);
    // Get engineer's current active task
    getCurrentTask()
      .then(res => {
        const task = res.data;
        setCurrentTask(task);
        // Automatically show details for the current task in side panel
        setSelectedTaskId(task?.id || null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Effect to load workspace data on component mount
  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  // Handler for marking a task as complete with confirmation
  const handleCompleteTask = (taskId) => {
    // Show confirmation dialog before completing task
    if (window.confirm("Are you sure you want to mark this task as complete?")) {
      // Call API to complete the task
      completeTask(taskId).then(() => {
        // Refresh workspace data to get new assignment or clear current task
        fetchWorkspace();
      });
    }
  };

  // Show loading indicator while fetching initial data
  if (loading) return <div>Loading Workspace...</div>;

  // Render main workspace layout with current task and team overview
  return (
    <div className={styles.workspace}>
      {/* Main content area with current task and team activity */}
      <div className={styles.mainColumn}>
        {/* Engineer's current active task with completion button */}
        <CurrentTask task={currentTask} onComplete={handleCompleteTask} />
        
        {/* Read-only view of all tasks in the current project */}
        <TeamProjectTasks projectId={currentTask?.projectId} currentTaskId={currentTask?.id} />
      </div>
      
      {/* Side panel for detailed task information */}
      <aside className={styles.sideColumn}>
        {/* Detailed view of the selected task */}
        <TaskDetailsPanel taskId={selectedTaskId} />
      </aside>
    </div>
  );
};

export default EngineerWorkspacePage;
