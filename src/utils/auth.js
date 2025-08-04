import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

// Create a reusable Axios instance
const rawClient = axios.create({
    baseURL: process.env.REACT_APP_SYNAPSE_BASE_URL,
    withCredentials: true
});

// Create the case converter middleware with a custom configuration
const apiClient = applyCaseMiddleware(rawClient, {
    // This option tells the middleware to NOT convert API responses
    ignoreHeaders: true 
});

// Request interceptor to automatically add the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('synapse_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to set or remove the JWT token from localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('synapse_token', token);
  } else {
    localStorage.removeItem('synapse_token');
  }
};

// Export the configured Axios instance
export default apiClient;
