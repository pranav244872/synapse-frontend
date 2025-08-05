import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../../api/managerService';
import Modal from '../../common/Modal/Modal';
import styles from './CreateProjectModal.module.css';

const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  // State to store the project name input value
  const [name, setName] = useState('');
  
  // State to store the project description input value
  const [description, setDescription] = useState('');
  
  // State to store and display form validation errors
  const [error, setError] = useState('');
  
  // Hook for programmatic navigation to different routes
  const navigate = useNavigate();

  // Handles form submission to create project and navigate to its detail page
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await createProject({ name, description });
      const newProject = response.data;
      onSuccess(); // To refresh the dashboard list in the background
      onClose();   // Close the modal
      // Navigate to the new project's detail page
      navigate(`/manager/projects/${newProject.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create project.');
    }
  };
  
  return (
    // Modal wrapper with form for creating a new project
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit}>
        {/* Input field for project name */}
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Project Name" className={styles.input} required />
        
        {/* Textarea for project description */}
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Project Description" className={styles.textarea} required />
        
        {/* Error message display */}
        {error && <p className={styles.error}>{error}</p>}
        
        {/* Submit button to create project and navigate to it */}
        <button type="submit" className={styles.submitButton}>Create & Go to Project</button>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
