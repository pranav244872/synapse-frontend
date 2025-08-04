import apiClient, { setAuthToken } from '../utils/auth';
// Import the configured API client (e.g., axios instance)
// and a helper to set the auth token in headers or storage

// Function to login a user with given credentials
export const loginUser = async (credentials) => {
  try {
    // Send POST request to /auth/login with user credentials (email/password)
    const response = await apiClient.post('/auth/login', credentials);

    // If response contains a token, save it (e.g., in localStorage or axios headers)
    if (response.data && response.data.token) {
      const { token } = response.data;
      setAuthToken(token);
    }

    // Return the full response data (may include user info and token)
    return response.data;

  } catch (error) {
    // Handle and standardize different types of errors for cleaner UI feedback

    if (error.response) {
      // Server responded with a status outside the 2xx range
      const errorMsg = error.response.data.message || 'Login failed';
      // Throw error with message and optionally include HTTP status code as cause
      throw new Error(errorMsg, { cause: error.response.status });

    } else if (error.request) {
      // Request was made but no response received (e.g., network issues)
      throw new Error('Network error. Could not connect to the server.');

    } else {
      // An error occurred setting up the request itself
      throw new Error('An unexpected error occurred.');
    }
  }
};

// Function to logout the user by clearing the stored token
export const logoutUser = () => {
  setAuthToken(null);
  // Note: You might want to call a backend /logout endpoint here to invalidate the token server-side
};

/**
 * Allows a new user to accept an invitation and create an account.
 * @param {object} acceptanceData - { token, name, password, resumeText }
 */
export const acceptInvitation = async (acceptanceData) => {
  return await apiClient.post('/invitations/accept', acceptanceData);
};
