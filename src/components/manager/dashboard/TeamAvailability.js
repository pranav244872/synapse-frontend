import React from 'react';
import styles from './TeamAvailability.module.css';

/**
 * TeamAvailability component displays a list of team members with their current availability status.
 * Used in manager dashboards to quickly assess team capacity and member workload.
 * Shows each member's name alongside a colored status badge (available/busy).
 */
const TeamAvailability = ({ members }) => {
  return (
    <div className={styles.container}>
      {/* Section heading for the team availability overview */}
      <h3 className={styles.title}>Team Availability</h3>
      
      {/* List of team members with their availability status */}
      <ul className={styles.memberList}>
        {members.map(member => (
          <li key={member.id} className={styles.memberItem}>
            {/* Member's display name */}
            <span>{member.name}</span>
            
            {/* Status badge with dynamic styling based on availability (available/busy) */}
            <span className={`${styles.statusBadge} ${styles[member.availability]}`}>
              {member.availability}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamAvailability;
