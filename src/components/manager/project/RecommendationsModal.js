import React, { useState, useEffect } from 'react';
import { getTaskRecommendations, updateTask } from '../../../api/managerService';
import Modal from '../../common/Modal/Modal';
import styles from './RecommendationsModal.module.css';

const RecommendationsModal = ({ task, isOpen, onClose, onSuccess }) => {
  // State to store the list of recommended engineers for the task
  const [recommendations, setRecommendations] = useState([]);
  
  // Loading state while fetching recommendations from the API
  const [loading, setLoading] = useState(true);

  // Fetch recommendations when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getTaskRecommendations(task.id)
        .then(res => {
          setRecommendations(res.data.recommendations);
        })
        .catch(err => console.error("Failed to get recommendations", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, task.id]);

  // Handle assigning a task to a recommended engineer
  const handleAssign = (userId) => {
    // When assigning, also move the task to 'in_progress'
    updateTask(task.id, { assigneeId: userId, status: 'in_progress' })
      .then(() => {
        onSuccess(); // Refresh the main task list
        onClose();   // Close this modal
      })
      .catch(err => console.error("Failed to assign task", err));
  };

  return (
    // Modal wrapper with dynamic title showing the task name
    <Modal isOpen={isOpen} onClose={onClose} title={`Recommendations for: "${task.title}"`}>
      {loading ? (
        //* Loading message while fetching recommendations
        <p>Analyzing skills and availability...</p>
      ) : (
        // List of recommended engineers
        <ul className={styles.recommendationList}>
          {recommendations.length > 0 ? recommendations.map(rec => (
            // Individual recommendation item with engineer details
            <li key={rec.userId} className={styles.recommendationItem}>
              {/* Engineer's basic information */}
              <div className={styles.userInfo}>
                <span className={styles.name}>{rec.name}</span>
                <span className={styles.email}>{rec.email}</span>
              </div>
              
              {/* Match score and assign button */}
              <div className={styles.scoreInfo}>
                {/* Display match percentage rounded to nearest whole number */}
                <span className={styles.score}>{`Match: ${Math.round(rec.score * 100)}%`}</span>
                
                {/* Button to assign task to this engineer */}
                <button onClick={() => handleAssign(rec.userId)} className={styles.assignButton}>
                  Assign
                </button>
              </div>
            </li>
          )) : (
            // Message when no recommendations are available
            <p>No suitable engineers found or task requires no specific skills.</p>
          )}
        </ul>
      )}
    </Modal>
  );
};

export default RecommendationsModal;
