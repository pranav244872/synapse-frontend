import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink is used for navigation with active link styling
import styles from './Header.module.css';   // CSS Modules for scoped styling

// Functional Header component
const Header = () => {
  return (
    // Apply glass-style header using CSS module class
    <header className={styles.glassHeader}>
      <div className={styles.container}>

        {/* Logo or brand text, navigates to home */}
        <div className={styles.logoText}>
          <NavLink to="/">\\Synapse</NavLink>
        </div>

        {/* Navigation menu with login button */}
        <nav>
          <NavLink to="/login" className={styles.loginButton}>
            Login
          </NavLink>
        </nav>

      </div>
    </header>
  );
};

export default Header; // Export the component to be used in other parts of the app
