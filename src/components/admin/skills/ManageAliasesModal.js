import React, { useState, useEffect, useCallback } from 'react';
import { getSkillAliases, createSkillAlias } from '../../../api/adminService';
import Modal from '../../common/Modal/Modal';
import styles from './ManageAliasesModal.module.css';

/**
 * MANAGE ALIASES MODAL COMPONENT
 * 
 * This modal provides a comprehensive interface for admins to manage aliases for a verified skill.
 * Aliases allow multiple names to refer to the same canonical skill, improving skill matching.
 * 
 * Real-world examples:
 * - "javascript" skill might have aliases: "js", "ecmascript", "es6", "node.js"
 * - "go" skill might have aliases: "golang", "go-lang"
 * - "kubernetes" skill might have aliases: "k8s", "kube"
 * 
 * Key Features:
 * - View all existing aliases for a skill
 * - Add new aliases with real-time updates
 * - Clean, modal-based interface that doesn't lose context
 * - Input validation and error handling
 * 
 * Current Context:
 * - Date: 2025-08-04 11:12:44 UTC
 * - User: pranav244872 (admin managing skill aliases)
 * 
 * Props:
 * @param {Object} skill - The verified skill object whose aliases are being managed
 * @param {Function} onClose - Callback to close the modal and return to parent view
 */
const ManageAliasesModal = ({ skill, onClose }) => {
  // STATE MANAGEMENT

  // Array to store all aliases associated with the current skill
  // Each alias object contains: { id, alias_name, skill_id, created_at }
  const [aliases, setAliases] = useState([]);

  // String value for the new alias input field (controlled component)
  // This tracks what the admin is typing for a new alias
  const [newAliasName, setNewAliasName] = useState('');

  /**
   * FETCH ALIASES FUNCTION
   * 
   * useCallback prevents this function from being recreated on every render,
   * which is important since it's used as a dependency in useEffect.
   * 
   * Makes API call to retrieve all aliases for the current skill.
   * Uses the new GET /admin/skills/:id/aliases endpoint.
   * 
   * API Response Structure:
   * {
   *   skill: { id, skill_name, is_verified, created_at, updated_at },
   *   aliases: [{ id, alias_name, skill_id, created_at }, ...]
   * }
   */
  const fetchAliases = useCallback(() => {
    // API call: GET /admin/skills/{skill.id}/aliases
    getSkillAliases(skill.id)
      .then(res => {
        // Extract aliases array from response, with defensive programming
        // The API returns both skill info and aliases, we only need aliases here
        setAliases(Array.isArray(res.data.aliases) ? res.data.aliases : []);
      })
      .catch(err => {
        console.error("Failed to fetch aliases:", err);
        // On error, set empty array to prevent UI issues
        setAliases([]);
      });
  }, [skill.id]); // Dependency on skill.id ensures function updates if skill changes

  /**
   * EFFECT FOR INITIAL DATA LOADING
   * 
   * Automatically fetches aliases when:
   * - Modal opens (component mounts)
   * - Skill changes (different skill selected)
   * - fetchAliases function reference changes (shouldn't happen due to useCallback)
   */
  useEffect(() => {
    fetchAliases();
  }, [fetchAliases]);

  /**
   * ADD ALIAS HANDLER
   * 
   * Handles the form submission to create a new alias for the current skill.
   * 
   * @param {Event} e - Form submission event
   * 
   * Workflow:
   * 1. Prevent default form submission behavior
   * 2. Validate that alias name is provided
   * 3. Call API to create alias
   * 4. Clear input field on success
   * 5. Refresh alias list to show new addition
   * 
   * Note: The API automatically normalizes alias names to lowercase for consistency
   */
  const handleAddAlias = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Input validation: don't submit empty aliases
    if (!newAliasName.trim()) return;

    try {
      // API call: POST /admin/skill-aliases
      // Body: { alias_name: newAliasName, skill_id: skill.id }
      // Server will normalize the alias name to lowercase automatically
      await createSkillAlias(newAliasName.trim(), skill.id);

      // SUCCESS: Clear the input field for next alias
      setNewAliasName('');

      // Refresh the aliases list to show the newly created alias
      // This ensures the UI is immediately updated with the new data
      fetchAliases();

    } catch (err) { 
      console.error("Failed to add alias", err);

      // Error handling: In production, you might want to:
      // - Show user-friendly error messages
      // - Handle specific error cases (e.g., duplicate alias)
      // - Provide retry functionality

      // For now, we keep the input value so user can retry
    }
  };

  // COMPONENT RENDER
  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Manage Aliases for "${skill.skill_name}"`}
    >
      {/* EXISTING ALIASES SECTION */}
      <div className={styles.aliasList}>
        <strong>Existing Aliases:</strong>

        {/* CONDITIONAL RENDERING: Show aliases or empty state */}
        {aliases.length > 0 ? (
          // ALIAS LIST: Display all current aliases
          <ul>
            {aliases.map(alias => (
              <li key={alias.id}>
                {alias.alias_name}
                {/* Future enhancement: Could add delete buttons here */}
                {/* <button onClick={() => deleteAlias(alias.id)}>Remove</button> */}
              </li>
            ))}
          </ul>
        ) : (
          // EMPTY STATE: Show when no aliases exist yet
          <p className={styles.noAliases}>No aliases found.</p>
        )}
      </div>

      {/* ADD NEW ALIAS FORM */}
      <form onSubmit={handleAddAlias} className={styles.addAliasForm}>
        {/* ALIAS NAME INPUT */}
        {/* Controlled component that tracks user input for new alias */}
        <input 
          type="text" 
          placeholder="Add new alias" 
          value={newAliasName} 
          onChange={e => setNewAliasName(e.target.value)} 
          className={styles.aliasInput}
          // Additional props that could be useful:
          // maxLength={50} // Prevent extremely long alias names
          // autoFocus // Focus input when modal opens
          // onKeyDown={handleKeyDown} // Handle Enter key, Escape key, etc.
        />

        {/* SUBMIT BUTTON */}
        {/* Submits the form to create a new alias */}
        <button 
          type="submit" 
          className={styles.addButton}
          // Optional: Disable button when input is empty
          // disabled={!newAliasName.trim()}
        >
          Add
        </button>
      </form>
    </Modal>
  );
};

export default ManageAliasesModal;
