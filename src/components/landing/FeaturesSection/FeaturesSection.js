import React from 'react';
import styles from './FeaturesSection.module.css'; // Scoped styles using CSS Modules

// Functional component that renders a section showcasing the app's core features
const FeaturesSection = () => {
  return (
    // Semantic section element for accessibility and SEO
    <section className={styles.section}>

      {/* Outer container to center and constrain content width */}
      <div className={styles.container}>

        {/* Section heading area: title and subtitle */}
        <div className={styles.heading}>
          <h2 className={styles.title}>Core Features</h2>
          <p className={styles.subtitle}>
            Next-generation tools for intelligent decision support.
          </p>
        </div>

        {/* Responsive grid layout to display feature cards side by side */}
        <div className={styles.grid}>

          {/* --- Feature Card 1: Seamless Onboarding --- */}
          <div className={`${styles.featureCard} ${styles.borderCyan}`}>
            <h3 className={styles.cardTitle} style={{ color: 'var(--cyan)' }}>
              Seamless Onboarding
            </h3>
            <p className={styles.cardText}>
              Engineers are added via form and resume upload. Synapse AI extracts and normalizes skills automatically.
            </p>
          </div>

          {/* --- Feature Card 2: AI-Powered Matching --- */}
          <div className={`${styles.featureCard} ${styles.borderGreen}`}>
            <h3 className={styles.cardTitle} style={{ color: 'var(--green)' }}>
              AI-Powered Matching
            </h3>
            <p className={styles.cardText}>
              A hybrid recommendation engine suggests the best engineers by matching task needs with user skills and performance.
            </p>
          </div>

          {/* --- Feature Card 3: Streamlined Workflow --- */}
          <div className={`${styles.featureCard} ${styles.borderPink}`}>
            <h3 className={styles.cardTitle} style={{ color: 'var(--pink)' }}>
              Streamlined Workflow
            </h3>
            <p className={styles.cardText}>
              Assign tasks, track progress, and manage engineer availability with a reliable, transaction-based system.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; // Export for use in the landing page or home view
