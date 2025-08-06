import React, { useState, useEffect } from 'react';
import { getTaskRecommendations } from '../../../api/managerService';
import Modal from '../../common/Modal/Modal';
import styles from './RecommendationsModal.module.css';

// Modal component for displaying engineer recommendations and handling task assignments
const RecommendationsModal = ({ task, isOpen, onClose, onAssign }) => {
  // State to store the list of recommended engineers for the task - initialize as empty array
  const [recommendations, setRecommendations] = useState([]);
  
  // Loading state while fetching recommendations from the API
  const [loading, setLoading] = useState(true);
  
  // Error state for handling API failures
  const [error, setError] = useState('');

  // Fetch recommendations when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(''); // Reset error state
      getTaskRecommendations(task.id)
        .then(res => {
          // Safely handle the response - ensure recommendations is always an array
          const recs = res.data?.recommendations || [];
          setRecommendations(recs);
        })
        .catch(err => {
          console.error("Failed to get recommendations", err);
          setError("Failed to load recommendations. Please try again.");
          setRecommendations([]); // Ensure recommendations is an empty array on error
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, task.id]);

  // Handle assigning a task to a recommended engineer
  const handleAssign = (userId) => {
    // Call the onAssign function passed from the parent page
    onAssign(task.id, userId);
  };

  return (
    // Modal wrapper with dynamic title showing the task name
    <Modal isOpen={isOpen} onClose={onClose} title={`Recommendations for: "${task.title}"`}>
      {loading ? (
        // Loading message while fetching recommendations
        <p>Analyzing skills and availability...</p>
      ) : error ? (
        // Error message when API call fails
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : (
        // List of recommended engineers - safe to check length now
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
                
                {/* Button to assign task to this engineer using parent's assign handler */}
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
