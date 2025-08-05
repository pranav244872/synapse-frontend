import React from 'react';
import styles from './StatCard.module.css';

/**
 * StatCard is a reusable component for displaying key metrics and statistics.
 * Used in dashboard views to show numerical data with descriptive labels.
 * Follows a simple design pattern: large value display with smaller title below.
 */
const StatCard = ({ title, value }) => {
  return (
    <div className={styles.statCard}>
      {/* Large numerical value or main statistic display */}
      <span className={styles.value}>{value}</span>
      
      {/* Descriptive label explaining what the value represents */}
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default StatCard;
