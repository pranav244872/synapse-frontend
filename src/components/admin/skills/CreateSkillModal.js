import React, { useState } from 'react';
import { createSkill } from '../../../api/adminService';
import Modal from '../../common/Modal/Modal';
import styles from './CreateSkillModal.module.css';

/**
 * CREATE SKILL MODAL COMPONENT
 * 
 * This modal provides an interface for admins to manually create new verified skills
 * directly in the system, bypassing the normal workflow of skill extraction from resumes.
 * 
 * Business Context:
 * - Allows proactive skill management for emerging technologies
 * - Enables standardization of skill names before user submissions
 * - Provides immediate skill verification for known technologies
 * 
 * Key Features:
 * - Simple form with skill name input
 * - Real-time error handling and display
 * - Automatic state cleanup on modal close
 * - Success/failure feedback to parent components
 * 
 * Current Context:
 * - Date: 2025-08-04 11:59:03 UTC
 * - User: pranav244872 (admin with skill creation privileges)
 * 
 * Props:
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Function} onClose - Callback to close the modal and reset parent state
 * @param {Function} onSuccess - Callback to refresh parent data after successful creation
 */
const CreateSkillModal = ({ isOpen, onClose, onSuccess }) => {
    // STATE MANAGEMENT
    
    // Tracks the skill name input value (controlled component)
    // This stores what the admin types in the skill name field
    const [skillName, setSkillName] = useState('');
    
    // Stores any error messages from API calls or validation
    // Displayed to the user when skill creation fails
    const [error, setError] = useState('');

    /**
     * FORM SUBMISSION HANDLER
     * 
     * Handles the skill creation workflow when admin submits the form.
     * 
     * @param {Event} e - Form submission event
     * 
     * Workflow:
     * 1. Prevent default form submission behavior
     * 2. Clear any previous error messages
     * 3. Call API to create skill (automatically verified)
     * 4. On success: notify parent and close modal
     * 5. On failure: display error message to user
     * 
     * API Integration:
     * - Calls POST /admin/skills endpoint
     * - Server handles normalization (lowercase, trim whitespace)
     * - Server prevents duplicates and provides appropriate responses
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh on form submission
        
        // Clear any previous error state before new attempt
        setError('');
        
        try {
            // API call: POST /admin/skills with { skill_name: skillName }
            // Server will:
            // - Normalize the skill name (lowercase, trim)
            // - Check for duplicates
            // - Create verified skill or update existing unverified skill
            await createSkill(skillName);
            
            // SUCCESS WORKFLOW:
            // 1. Notify parent component to refresh skill lists
            //    (This will update both verified and unverified tabs)
            onSuccess();
            
            // 2. Close the modal and reset internal state
            //    (handleClose will clear form fields and error)
            onClose();
            
        } catch (err) {
            // ERROR HANDLING:
            // Extract error message from API response or use fallback
            // Common scenarios:
            // - 409 Conflict: "skill already exists and is verified"
            // - 400 Bad Request: validation errors
            // - 500 Internal Server Error: database issues
            
            const errorMessage = err.response?.data?.error || 'Failed to create skill.';
            setError(errorMessage);
            
            // Note: Modal stays open on error so user can:
            // - See the error message
            // - Modify the skill name
            // - Retry the operation
        }
    };
    
    /**
     * MODAL CLOSE HANDLER
     * 
     * Provides clean state reset when modal is closed.
     * This ensures the modal starts fresh next time it's opened.
     * 
     * State Cleanup:
     * - Clear skill name input field
     * - Clear any error messages
     * - Call parent's onClose callback
     * 
     * Called when:
     * - User clicks close button/overlay
     * - User presses Escape key
     * - Successful skill creation completes
     */
    const handleClose = () => {
        // Reset form to pristine state
        setSkillName('');
        setError('');
        
        // Notify parent component that modal should be hidden
        onClose();
    }

    // COMPONENT RENDER
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            title="Create New Verified Skill"
        >
            {/* SKILL CREATION FORM */}
            <form onSubmit={handleSubmit}>
                {/* SKILL NAME INPUT */}
                {/* 
                    Controlled input component that tracks user's typing.
                    The 'required' attribute provides basic HTML5 validation.
                */}
                <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="Enter new skill name (e.g., Terraform)"
                    className={styles.input}
                    required
                    // Additional props that could enhance UX:
                    // autoFocus        // Focus input when modal opens
                    // maxLength={100}  // Prevent extremely long skill names
                    // onBlur={handleBlur} // Validation on field exit
                />
                
                {/* ERROR MESSAGE DISPLAY */}
                {/* 
                    Conditionally rendered error message.
                    Only shows when there's an actual error to display.
                    Provides immediate feedback for failed operations.
                */}
                {error && <p className={styles.error}>{error}</p>}
                
                {/* SUBMIT BUTTON */}
                {/* 
                    Triggers form submission and skill creation workflow.
                    Could be enhanced with loading state and disabled state.
                */}
                <button 
                    type="submit" 
                    className={styles.submitButton}
                    // Future enhancements:
                    // disabled={!skillName.trim() || isLoading}
                    // {isLoading ? 'Creating...' : 'Create Skill'}
                >
                    Create Skill
                </button>
            </form>
        </Modal>
    );
};

export default CreateSkillModal;
