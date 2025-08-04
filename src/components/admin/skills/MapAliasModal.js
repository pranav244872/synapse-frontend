import React, { useState, useEffect } from 'react';
import { getSkills, createSkillAlias, deleteSkill } from '../../../api/adminService';
import useDebounce from '../../../hooks/useDebounce';
import Modal from '../../common/Modal/Modal';
import styles from './MapAliasModal.module.css';

/**
 * MAP ALIAS MODAL COMPONENT
 * 
 * This modal allows admins to convert an unverified skill into an alias for an existing verified skill.
 * This is useful when users submit skills that are variations of existing skills 
 * (e.g., "golang" for "go", "js" for "javascript").
 * 
 * Workflow:
 * 1. Admin searches for verified skills to use as the canonical/target skill
 * 2. Admin selects the target skill from search results
 * 3. System creates an alias relationship (unverified skill name → verified skill)
 * 4. System deletes the original unverified skill (since it's now just an alias)
 * 
 * Props:
 * @param {Object} skillToAlias - The unverified skill object to be mapped as an alias
 * @param {Function} onClose - Callback to close the modal
 * @param {Function} onSuccess - Callback to refresh parent data after successful operation
 */
const MapAliasModal = ({ skillToAlias, onClose, onSuccess }) => {
  // STATE MANAGEMENT

  // Array to store verified skills that match the search query
  // These are potential "canonical" skills that the unverified skill can be aliased to
  const [searchResults, setSearchResults] = useState([]);

  // The raw search input from the user (updates on every keystroke)
  const [searchTerm, setSearchTerm] = useState('');

  // The ID of the verified skill selected as the alias target
  // null means no skill is selected yet
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  // Debounced version of searchTerm - only updates 500ms after user stops typing
  // This prevents making API calls on every keystroke, improving performance
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  /**
   * SEARCH EFFECT
   * 
   * Automatically searches for verified skills when the debounced search term changes.
   * Only makes API calls when there's actually a search term (prevents empty searches).
   * 
   * API Call Details:
   * - getSkills(true, 1, 10, debouncedSearchTerm)
   *   - true: only verified skills
   *   - 1: first page
   *   - 10: limit to 10 results (reasonable for dropdown)
   *   - debouncedSearchTerm: search filter
   */
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Search verified skills matching the term
      // API endpoint: GET /admin/skills?verified=true&page_id=1&page_size=10&search={term}
      getSkills(true, 1, 10, debouncedSearchTerm)
        .then(res => {
          // Defensive programming: ensure we always have an array
          setSearchResults(Array.isArray(res.data.data) ? res.data.data : []);
        })
        .catch(err => {
          console.error("Failed to search skills:", err);
          setSearchResults([]); // Clear results on error
        });
    } else {
      // Clear search results when search term is empty
      // This prevents showing stale results from previous searches
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]); // Only re-run when debounced search term changes

  /**
   * FORM SUBMISSION HANDLER
   * 
   * Executes the alias mapping workflow when user confirms their selection.
   * This is a two-step process that must be atomic (both succeed or both fail).
   * 
   * Steps:
   * 1. Create alias relationship: skillToAlias.skill_name becomes an alias for selectedSkillId
   * 2. Delete the original unverified skill (cleanup, since it's now just an alias)
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation: ensure a skill is selected before proceeding
    if (!selectedSkillId) return;

    try {
      // STEP 1: Create the alias relationship
      // API call: POST /admin/skill-aliases
      // Body: { alias_name: skillToAlias.skill_name, skill_id: selectedSkillId }
      // This makes "skillToAlias.skill_name" an alias that points to the verified skill
      await createSkillAlias(skillToAlias.skillName, selectedSkillId);

      // STEP 2: Delete the original unverified skill
      // API call: DELETE /admin/skills/{skillToAlias.id}
      // We can safely delete it because the skill name is now preserved as an alias
      await deleteSkill(skillToAlias.id);

      // SUCCESS: Notify parent components
      onSuccess(); // Refresh the unverified skills list
      onClose();   // Close this modal

    } catch (err) { 
      // ERROR HANDLING: Log the error for debugging
      // In a production app, you might want to show user-friendly error messages
      console.error("Failed to map alias", err); 

      // Note: We don't close the modal on error so user can retry
      // In future, could add error state to show specific error messages
    }
  };

  // COMPONENT RENDER
  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Map "${skillToAlias.skill_name}" as Alias`}
    >
      <form onSubmit={handleSubmit}>
        {/* INSTRUCTION TEXT */}
        <p>Search for the canonical skill to map to:</p>

        {/* SEARCH INPUT */}
        {/* User types here to search for verified skills */}
        <input 
          type="text" 
          placeholder="Search verified skills..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className={styles.searchInput} 
        />

        {/* SKILL SELECTION DROPDOWN */}
        {/* Populated with search results, allows user to pick the canonical skill */}
        <select 
          onChange={e => setSelectedSkillId(parseInt(e.target.value))} 
          required 
          className={styles.selectList}
        >
          {/* DEFAULT OPTION */}
          <option value="">-- Select from search results --</option>

          {/* DYNAMIC OPTIONS FROM SEARCH RESULTS */}
          {searchResults.map(skill => (
            <option key={skill.id} value={skill.id}>
              {skill.skillName}
            </option>
          ))}
        </select>

        {/* SUBMIT BUTTON */}
        {/* Disabled until user selects a skill, prevents accidental empty submissions */}
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={!selectedSkillId}
        >
          Confirm & Map
        </button>
      </form>
    </Modal>
  );
};

export default MapAliasModal;
