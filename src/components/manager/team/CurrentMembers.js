import React, { useState, useEffect } from 'react';
// Import React hooks for component state management and lifecycle effects

import { getTeamMembers } from '../../../api/managerService';
// Import API service function to fetch team member data from backend

import styles from './CurrentMembers.module.css';
// Import scoped CSS module for component-specific styling

/**
 * CurrentMembers Component
 * 
 * Displays a list of team members for the current manager's team.
 * Fetches team data on component mount and handles loading/error states.
 * 
 * Used in: Manager Dashboard, Team Management pages
 */
const CurrentMembers = () => {
  // State to store the array of team member objects
  const [members, setMembers] = useState([]);
  
  // Loading state to show spinner/message while data is being fetched
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch team members data on component mount
  useEffect(() => {
    // Call API to get team members for the authenticated manager
    getTeamMembers()
      .then(res => {
        // On successful response, update members state with fetched data
        setMembers(res.data);
      })
      .catch(err => {
        // Log any API errors to console for debugging
        console.error("Failed to fetch team members", err);
        // Note: Could add error state here for user-facing error messages
      })
      .finally(() => {
        // Always hide loading indicator regardless of success/failure
        setLoading(false);
      });
  }, []); // Empty dependency array means this effect runs only once on mount

  // Early return with loading message while data is being fetched
  if (loading) return <p>Loading team members...</p>;

  return (
    <div className={styles.container}>
      {/* Main container for the team members section */}
      
      <h3 className={styles.title}>Current Team Members</h3>
      {/* Section heading */}
      
      {members.length > 0 ? (
        // Conditional rendering: Show member list if team has members
        <ul className={styles.memberList}>
          {/* Unordered list to display team members */}
          
          {members.map(member => (
            // Map over members array to render each team member
            <li key={member.id} className={styles.memberItem}>
              {/* List item for each member, using unique ID as React key */}
              
              <span className={styles.memberName}>{member.name}</span>
              {/* Display member's full name */}
              
              <span className={styles.memberEmail}>{member.email}</span>
              {/* Display member's email address */}
            </li>
          ))}
        </ul>
      ) : (
        // Fallback message when team has no members
        <p>Your team has no members yet.</p>
      )}
    </div>
  );
};

export default CurrentMembers;
// Export component for use in parent components (Dashboard, Team pages, etc.)
