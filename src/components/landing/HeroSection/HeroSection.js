import React from 'react';
import { Link } from 'react-router-dom'; // Used for client-side navigation
import styles from './HeroSection.module.css'; // Scoped CSS Module styles

// 'HeroSection' functional component receives 'displayedText' and 'codeVisualHtml' as props
const HeroSection = ({ displayedText, codeVisualHtml }) => {
  return (
    // Main content area for the hero section (semantic HTML tag)
    <main className={styles.container}>
      
      {/* Two-column grid layout: left (text), right (code visual) */}
      <div className={styles.grid}>
        
        {/* Left side: Headline, animated text, CTA button */}
        <div className={styles.textLeft}>
          
          {/* Main heading */}
          <h1 className={styles.mainHeading}>
            Automate Your Workflow
          </h1>
          
          {/* Dynamic typing-style animated text with blinking cursor */}
          <p className={styles.animatedTextContainer}>
            {displayedText}
            <span className={styles.cursor}>|</span>
          </p>
          
          {/* Call-to-action button that navigates to login */}
          <div className={styles.buttonContainer}>
            <Link to="/login" className={styles.getStartedButton}>
              Get Started
            </Link>
          </div>

        </div>

        {/* Right side: code visual (syntax-highlighted or styled HTML) */}
        <div className={styles.codeVisual}>
          <pre className={styles.pre}>
            {/* 
              Renders HTML from a string.
              Ensure 'codeVisualHtml' is sanitized before use to prevent XSS attacks.
            */}
            <code dangerouslySetInnerHTML={{ __html: codeVisualHtml }} />
          </pre>
        </div>

      </div>
    </main>
  );
};

export default HeroSection; // Export the component for use in parent pages
