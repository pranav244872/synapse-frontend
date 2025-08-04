import apiClient from '../utils/auth'; // Pre-configured Axios instance with authentication headers

// ==============================
//    Invitation Management (Manager)
// ==============================

/**
 * Sends an invitation to an engineer via email.
 * Only managers can use this endpoint to invite engineers to their team.
 * 
 * @param {string} email - Email address of the engineer to invite.
 * @returns {Promise} - API response containing the created invitation.
 */
export const inviteEngineer = async (email) => {
  return await apiClient.post('/manager/invitations', { email });
};

/**
 * Fetches a paginated list of invitations sent by the manager.
 * 
 * @param {number} pageId - Current page number (default is 1).
 * @param {number} pageSize - Number of invitations per page (default is 10).
 * @returns {Promise} - API response containing a list of invitations.
 */
export const getManagerInvitations = async (pageId = 1, pageSize = 10) => {
  return await apiClient.get('/manager/invitations', {
    params: { page_id: pageId, page_size: pageSize }
  });
};

// ==============================
//         Project Management
// ==============================

/**
 * Creates a new project with the provided data.
 * 
 * @param {Object} projectData - An object containing project details such as name, description, deadline, etc.
 * @returns {Promise} - API response containing the created project.
 */
export const createProject = async (projectData) => {
  return await apiClient.post('/manager/projects', projectData);
};

// ==============================
//          Task Management
// ==============================

/**
 * Creates a new task and assigns it to a project or engineer.
 * 
 * @param {Object} taskData - An object containing task details such as title, description, assignee, deadline, etc.
 * @returns {Promise} - API response containing the created task.
 */
export const createTask = async (taskData) => {
  return await apiClient.post('/manager/tasks', taskData);
};

// ==============================
//     Recommendation Engine
// ==============================

/**
 * Gets task assignment recommendations based on the given input.
 * Typically used to suggest the most suitable engineers for a task.
 * 
 * @param {Object} recommendationData - An object with task and context information to generate recommendations.
 * @returns {Promise} - API response containing recommended engineer-task mappings.
 */
export const getTaskRecommendations = async (recommendationData) => {
  return await apiClient.post('/manager/recommendations', recommendationData);
};
