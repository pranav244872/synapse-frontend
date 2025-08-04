import React, { useState, useEffect } from 'react';
import { getUserDeletionImpact, deleteUser } from '../../../api/adminService';
import Modal from '../../common/Modal/Modal';
import styles from './DeleteUserModal.module.css';

const DeleteUserModal = ({ user, isOpen, onClose, onSuccess }) => {
  // State for deletion impact analysis and loading status
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch deletion impact analysis when modal opens
    if (isOpen) {
      setLoading(true);
      getUserDeletionImpact(user.id)
        .then(res => setImpact(res.data)) // Store impact data for display
        .finally(() => setLoading(false)); // Stop loading regardless of success/failure
    }
  }, [isOpen, user.id]); // Re-run when modal opens or user changes

  const handleDelete = async () => {
    try {
      // Execute actual user deletion after impact confirmation
      await deleteUser(user.id);
      onSuccess(); // Trigger parent component refresh
      onClose();   // Close modal on successful deletion
    } catch (err) {
      // Log deletion errors (could be enhanced with user-facing error display)
      console.error("Failed to delete user", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete User: ${user.name}`}>
      {/* Loading state while fetching deletion impact analysis */}
      {loading && <p>Analyzing impact...</p>}
      
      {/* Display impact analysis results when loaded */}
      {!loading && impact && (
        <div className={styles.impactContainer}>
          {/* Show deletion confirmation with impact details if deletion is allowed */}
          {impact.canDelete ? (
            <>
              {/* Warning message about irreversible action */}
              <p>Are you sure? This action cannot be undone. The following will occur:</p>
              
              {/* Conditional impact list - only show items with actual impact */}
              <ul className={styles.impactList}>
                {/* Task unassignment impact */}
                {impact.impact.tasksToUnassign.count > 0 && 
                  <li><strong>{impact.impact.tasksToUnassign.count}</strong> tasks will be unassigned.</li>
                }
                
                {/* Team management impact */}
                {impact.impact.teamsToOrphan.count > 0 && 
                  <li><strong>{impact.impact.teamsToOrphan.count}</strong> teams will be left unmanaged.</li>
                }
                
                {/* Skill association impact */}
                {impact.impact.skillsToRemove > 0 && 
                  <li><strong>{impact.impact.skillsToRemove}</strong> skill associations will be removed.</li>
                }
              </ul>
              
              {/* Final confirmation button to proceed with deletion */}
              <button onClick={handleDelete} className={styles.confirmButton}>Confirm & Delete User</button>
            </>
          ) : (
            /* Display blocking reason if deletion is not allowed (e.g., admin users) */
            <p className={styles.error}>{impact.blockingReason}</p>
          )}
        </div>
      )}
    </Modal>
  );
};

export default DeleteUserModal;
