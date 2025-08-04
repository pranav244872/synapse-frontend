import React, { useState, useEffect } from 'react';
import { updateUser, getTeams } from '../../../api/adminService';
import Modal from '../../common/Modal/Modal';
import styles from './EditUserModal.module.css';

const EditUserModal = ({ user, isOpen, onClose, onSuccess }) => {
  // Form state management for user role and team assignment
  const [role, setRole] = useState(user.role);
  const [teamId, setTeamId] = useState(user.teamId || '');
  const [unmanagedTeams, setUnmanagedTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available unmanaged teams when user role changes to manager
    if (role === 'manager') {
      getTeams(true).then(res => {
        setUnmanagedTeams(res.data);
      });
    }
  }, [role]); // Re-run when role changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Build payload with role, conditionally add team assignment for managers
      const payload = { role };
      
      // Manager role requires team assignment - validate and add to payload
      if (role === 'manager') {
        if (!teamId) {
          setError('A team must be selected for a manager.');
          return;
        }
        payload.teamId = parseInt(teamId);
      }
      
      // Execute API call to update user with validation payload
      await updateUser(user.id, payload);
      onSuccess(); // Trigger parent component refresh
      onClose();   // Close modal on successful update
    } catch (err) {
      // Handle and display API errors with fallback message
      setError(err.response?.data?.error || 'Failed to update user.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user.name}`}>
      <form onSubmit={handleSubmit}>
        {/* Role selection dropdown - excludes admin for security */}
        <div className={styles.formGroup}>
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className={styles.select}>
            <option value="engineer">Engineer</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        
        {/* Conditional team selection - only shown when promoting to manager */}
        {role === 'manager' && (
          <div className={styles.formGroup}>
            <label>Assign to Unmanaged Team</label>
            <select value={teamId} onChange={e => setTeamId(e.target.value)} className={styles.select}>
              <option value="">-- Select a Team --</option>
              
              {/* Include current team if user is already a manager (allows team transfer) */}
              {user.role === 'manager' && <option value={user.teamId}>{user.teamName}</option>}
              
              {/* List all available unmanaged teams for assignment */}
              {unmanagedTeams.map(team => (
                <option key={team.id} value={team.id}>{team.teamName}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Error message display for validation and API errors */}
        {error && <p className={styles.error}>{error}</p>}
        
        {/* Submit button to save user changes */}
        <button type="submit" className={styles.submitButton}>Save Changes</button>
      </form>
    </Modal>
  );
};

export default EditUserModal;
