import React, { useState, useContext } from 'react';
// Import React hooks for managing local component state and accessing context

import styles from './LoginForm.module.css';
// Scoped CSS module for form styling

import { AuthContext } from '../../../context/AuthContext';
// Importing authentication context to access the `login` function

const LoginForm = () => {
  // Local state for email and password inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for showing error messages and loading status
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  // Get the `login` function from the auth context

  // ✅ Removed useNavigate since AuthContext handles redirection

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError('');       // Clear any previous errors
    setLoading(true);   // Show loading state

    try {
      await login(email, password);
      // ✅ Let AuthContext handle the redirect based on user role
      // No need to navigate manually here
    } catch (err) {
      // If login fails, display an error message
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false); // Always remove loading state
    }
  };

  return (
    <div className={styles.formContainer}>
      {/* Outer container for styling/layout */}
      <h2 className={styles.title}>System Access</h2>
      {/* Form title */}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Login form that triggers handleSubmit on submission */}

        <div className={styles.inputGroup}>
          {/* Grouping for label + input styling */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            autoComplete="email"
            placeholder="Email"
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            autoComplete="current-password"
            placeholder="Password"
          />
        </div>

        {error && (
          // Display an error message if present
          <p className={styles.error}>
            <span className={styles.errorIcon}>!</span> {error}
          </p>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          {/* Submit button changes label when loading */}
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
