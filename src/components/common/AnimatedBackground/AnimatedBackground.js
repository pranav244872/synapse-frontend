import React from 'react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground = ({ children }) => {
  return (
    <div className={styles.background}>
      <div className={styles.grid}></div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
