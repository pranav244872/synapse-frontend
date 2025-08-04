import React from 'react';
// Import React library

import styles from './LoginPage.module.css';
// Import scoped CSS module for styling the login page container

import LoginForm from '../components/login/LoginForm/LoginForm';
// Import the LoginForm component which handles the actual login UI and logic

const LoginPage = () => {
  return (
    <div className={styles.container}>
      {/* Container div for page-level styling and layout */}
      
      <LoginForm />
      {/* Render the login form component */}
    </div>
  );
};

export default LoginPage;
// Export the LoginPage component for routing or rendering in the app
