import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { acceptInvitation } from '../api/authService';
import styles from './AcceptInvitationPage.module.css';

const AcceptInvitationPage = () => {
  // Hook to read query parameters from the URL (e.g., ?token=...)
  const [searchParams] = useSearchParams();

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // Access the login function from AuthContext to authenticate user after signup
  const { login } = useContext(AuthContext);

  // Form input states
  const [name, setName] = useState('');             // User's full name
  const [password, setPassword] = useState('');     // User's chosen password
  const [resumeText, setResumeText] = useState(''); // User's resume text

  // Error message state to show any API or validation errors
  const [error, setError] = useState('');

  // Loading state to disable form during API call
  const [loading, setLoading] = useState(false);
  
  // Extract the invitation token from URL query params
  const token = searchParams.get('token');

  // Validate presence of token on component mount
  useEffect(() => {
    if (!token) {
      setError('Invitation token is missing or invalid.');
    }
  }, [token]);

  /**
   * Handles form submission to accept the invitation.
   * Calls API with token and user input, logs in user on success,
   * and redirects to the dashboard.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If no token present, do nothing
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      // Call backend API to accept invitation and create user account
      const response = await acceptInvitation({ token, name, password, resumeText });

      // After successful signup, automatically log the user in
      await login(response.data.user.email, password);

      // Redirect user to their dashboard page
      navigate('/dashboard'); 
    } catch (err) {
      // Display error from backend if available, else show generic error
      setError(err.response?.data?.error || 'Failed to accept invitation.');
    } finally {
      setLoading(false);
    }
  };

  // If token is missing, show error message only and do not render form
  if (!token) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Accept Invitation</h2>
        <p className={styles.subtitle}>Create your Synapse account.</p>

        {/* Input fields for user details */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            className={styles.input}
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Create Password"
            className={styles.input}
            required
          />
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className={styles.textarea}
            required
          />
        </div>

        {/* Show any error messages */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Submit button disabled during loading */}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Creating Account...' : 'Join Synapse'}
        </button>
      </form>
    </div>
  );
};

export default AcceptInvitationPage;
