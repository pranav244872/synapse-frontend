import React from 'react';
import styles from './SectionSeparator.module.css'; // Import scoped CSS module styles

// Functional component to render a decorative separator between sections
const SectionSeparator = () => {
  return (
    // Container wrapping the entire separator (lines and diamond)
    <div className={styles.separatorContainer}>

      {/* Left horizontal line */}
      <div className={styles.line}></div>

      {/* Center diamond shape used as a visual focal point */}
      <div className={styles.diamond}></div>

      {/* Right horizontal line */}
      <div className={styles.line}></div>
      
    </div>
  );
};

export default SectionSeparator; // Export component for use in other parts of the app

