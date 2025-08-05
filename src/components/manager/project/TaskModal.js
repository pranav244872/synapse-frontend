import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../../../api/managerService';
import Modal from '../../common/Modal/Modal';
import styles from './TaskModal.module.css';

const TaskModal = ({ isOpen, onClose, onSuccess, projectId, taskToEdit }) => {
  // State for task title input field
  const [title, setTitle] = useState('');
  
  // State for task description textarea
  const [description, setDescription] = useState('');
  
  // State for task priority selection, defaults to 'medium'
  const [priority, setPriority] = useState('medium');
  
  // State for displaying form validation or API errors
  const [error, setError] = useState('');

  // Determine if modal is in edit mode based on presence of taskToEdit prop
  const isEditMode = !!taskToEdit;

  // Populate form fields when editing existing task or reset when creating new task
  useEffect(() => {
    if (isEditMode) {
      // Pre-fill form with existing task data for editing
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description?.String || ''); // Handle nullable description
      setPriority(taskToEdit.priority);
    } else {
      // Reset form for "create" mode
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  }, [taskToEdit, isEditMode, isOpen]);

  // Handle form submission for both create and update operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Prepare task data object with form values
    const taskData = { title, description, priority, projectId };

    try {
      if (isEditMode) {
        // Update existing task
        await updateTask(taskToEdit.id, taskData);
      } else {
        // Create new task
        await createTask(taskData);
      }
      onSuccess(); // Refresh parent component data
      onClose();   // Close the modal
    } catch (err) {
      // Display error message from API response or generic fallback
      setError(err.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} task.`);
    }
  };

  return (
    // Modal wrapper with dynamic title based on create/edit mode
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit Task' : 'Create New Task'}>
      {/* Task form with validation and submission handling */}
      <form onSubmit={handleSubmit}>
        {/* Task title input field with required validation */}
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Task Title" 
          className={styles.input} 
          required 
        />
        
        {/* Task description textarea for skill extraction purposes */}
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Task Description (for skill extraction)" 
          className={styles.textarea} 
          required 
        />
        
        {/* Priority selection dropdown with predefined options */}
        <select value={priority} onChange={e => setPriority(e.target.value)} className={styles.select}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        
        {/* Error message display when form submission fails */}
        {error && <p className={styles.error}>{error}</p>}
        
        {/* Submit button with dynamic text based on create/edit mode */}
        <button type="submit" className={styles.submitButton}>
          {isEditMode ? 'Save Changes' : 'Create Task'}
        </button>
      </form>
    </Modal>
  );
};

export default TaskModal;
