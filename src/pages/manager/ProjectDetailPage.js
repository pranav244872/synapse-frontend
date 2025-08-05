import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, getProjectTasks, updateTask } from '../../api/managerService';
import ProjectHeader from '../../components/manager/project/ProjectHeader';
import TaskModal from '../../components/manager/project/TaskModal';
import KanbanBoard from '../../components/manager/project/KanbanBoard';
import RecommendationsModal from '../../components/manager/project/RecommendationsModal';

const ProjectDetailPage = () => {
  // Extract projectId from URL parameters
  const { projectId } = useParams();
  
  // State to store the current project details
  const [project, setProject] = useState(null);
  
  // State to store the list of tasks for this project
  const [tasks, setTasks] = useState([]);
  
  // Loading state for initial data fetch only
  const [loading, setLoading] = useState(true);
  
  // Unified modal state to manage all modal types (create/edit task, recommendations)
  const [modal, setModal] = useState({ type: null, data: null }); // type: 'create_task', 'edit_task', 'recommend'

  // Memoized function to fetch project and task data in parallel
  const fetchData = useCallback(async () => {
    try {
      // Fetch project details and tasks simultaneously for better performance
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

  // Handle drag and drop operations on the Kanban board with optimistic updates
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    // Exit early if dropped outside a column or in the same position
    if (!destination || (destination.droppableId === source.droppableId)) return;
    
    // Extract task ID and new status from drag result
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    
    // Store original tasks for rollback on API failure
    const originalTasks = [...tasks];
    
    // Optimistic UI update - immediately update task status locally
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);

    // API call to persist change, rollback on failure
    updateTask(taskId, { status: newStatus }).catch(() => setTasks(originalTasks));
  };

  // Close any open modal by resetting the modal state
  const closeModal = () => setModal({ type: null, data: null });

  // Show loading state while fetching initial data
  if (loading) return <div>Loading Project...</div>;
  
  // Show error message if project not found
  if (!project) return <div>Project not found.</div>;

  return (
    <div>
      {/* Header section with project info and create task button */}
      <ProjectHeader 
        project={project} 
        onOpenCreateTaskModal={() => setModal({ type: 'create_task', data: null })} 
      />
      
      {/* Kanban board with drag-drop functionality and action callbacks */}
      <KanbanBoard 
        tasks={tasks} 
        onDragEnd={handleDragEnd}
        onEditTask={(task) => setModal({ type: 'edit_task', data: task })}
        onRecommend={(task) => setModal({ type: 'recommend', data: task })}
      />

      {/* Task modal for creating new tasks or editing existing ones */}
      <TaskModal 
        isOpen={modal.type === 'create_task' || modal.type === 'edit_task'}
        onClose={closeModal}
        onSuccess={fetchData}
        projectId={parseInt(projectId)}
        taskToEdit={modal.type === 'edit_task' ? modal.data : null}
      />
      
      {/* Recommendations modal shown only when requesting engineer recommendations */}
      {modal.type === 'recommend' &&
        <RecommendationsModal
          isOpen={true}
          onClose={closeModal}
          onSuccess={fetchData}
          task={modal.data}
        />
      }
    </div>
  );
};

export default ProjectDetailPage;
