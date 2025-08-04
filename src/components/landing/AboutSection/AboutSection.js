import React from 'react';
import styles from './AboutSection.module.css'; // Import scoped CSS Module styles

// Functional component that describes the Synapse platform in an "About" section
const AboutSection = () => {
  return (
    // Semantic <section> element for accessibility and SEO
    <section className={styles.section}>

      {/* Outer container to center content and apply consistent width */}
      <div className={styles.container}>

        {/* Glass-pane effect for visual styling (likely semi-transparent background with blur) */}
        <div className={styles.glassPane}>

          {/* Centered text block for heading and paragraph */}
          <div className={styles.textCenter}>

            {/* Section title */}
            <h2 className={styles.title}>What is Synapse?</h2>

            {/* Descriptive text explaining the product */}
            <p className={styles.text}>
              Synapse is an intelligent project management platform designed to eliminate the guesswork in task assignment. 
              By leveraging a powerful machine learning engine, it analyzes your team's skills, past performance, and current 
              availability to recommend the perfect engineer for any given task. This data-driven approach ensures that projects 
              are staffed efficiently, bottlenecks are minimized, and your team's talent is utilized to its fullest potential.
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection; // Export the component so it can be used on the landing or about page
