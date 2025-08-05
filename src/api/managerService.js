import apiClient from '../utils/auth';

// --- Dashboard & Team Management ---

/**
 * Retrieves comprehensive dashboard statistics for the manager's team.
 * Provides real-time metrics including active projects, open tasks, and engineer availability.
 * @returns {Promise} Axios response promise with dashboard stats object:
 *   { active_projects, open_tasks, available_engineers, total_engineers }
 */
export const getDashboardStats = () => apiClient.get('/manager/dashboard/stats');

/**
 * Fetches all engineers in the manager's team with their current availability status.
 * Essential for understanding team capacity and assignment possibilities.
 * @returns {Promise} Axios response promise with array of team members:
 *   [{ id, name, email, availability }]
 */
export const getTeamMembers = () => apiClient.get('/manager/team/members');

// --- Invitation Management (Manager) ---

/**
 * Creates and sends an invitation for a new engineer to join the manager's team.
 * Team association is automatically determined from the manager's JWT token.
 * @param {string} email - Email address of the engineer to invite.
 * @returns {Promise} Axios response promise with invitation details.
 */
export const inviteEngineer = (email) => apiClient.post('/manager/invitations', { email });

/**
 * Retrieves a paginated list of invitations sent by the current manager.
 * Allows tracking of team recruitment efforts and invitation status.
 * @param {number} pageId - The page number to retrieve (default: 1).
 * @param {number} pageSize - Number of invitations per page (default: 10, max: 20).
 * @returns {Promise} Axios response promise with paginated invitation data:
 *   { total_count, data: [{ id, email, status, inviter_name, created_at }] }
 */
export const getManagerInvitations = (pageId = 1, pageSize = 10) => 
  apiClient.get('/manager/invitations', { params: { page_id: pageId, page_size: pageSize } });

/**
 * Cancels a pending invitation that was sent by the current manager.
 * Only pending invitations can be canceled, and managers can only cancel their own invitations.
 * @param {number} id - ID of the invitation to cancel.
 * @returns {Promise} Axios response promise (204 No Content on success).
 */
export const cancelInvitation = (id) => apiClient.delete(`/manager/invitations/${id}`);

// --- Project Management ---

/**
 * Creates a new project within the manager's team.
 * Projects serve as containers for organizing related tasks.
 * @param {object} projectData - Project details { name, description }.
 * @returns {Promise} Axios response promise with created project details.
 */
export const createProject = (projectData) => apiClient.post('/manager/projects', projectData);

/**
 * Retrieves a paginated list of projects owned by the manager's team.
 * Enhanced with task counts (total_tasks, completed_tasks) for performance optimization.
 * Supports filtering between active and archived projects.
 * @param {number} pageId - The page number to retrieve (default: 1).
 * @param {number} pageSize - Number of projects per page (default: 10, max: 50).
 * @param {boolean} archived - Filter: true for archived projects, false for active (default: false).
 * @returns {Promise} Axios response promise with paginated project data including task counts:
 *   { total_count, data: [{ id, project_name, total_tasks, completed_tasks, archived, ... }] }
 */
export const getProjects = (pageId = 1, pageSize = 10, archived = false) => 
  apiClient.get('/manager/projects', { params: { page_id: pageId, page_size: pageSize, archived } });

/**
 * Retrieves a specific project by ID, ensuring it belongs to the manager's team.
 * @param {number} id - ID of the project to retrieve.
 * @returns {Promise} Axios response promise with project details.
 */
export const getProjectById = (id) => apiClient.get(`/manager/projects/${id}`);

/**
 * Updates a project's name and/or description.
 * Only active (non-archived) projects can be updated.
 * @param {number} id - ID of the project to update.
 * @param {object} projectData - Updated project data { name?, description? }.
 *   At least one field must be provided.
 * @returns {Promise} Axios response promise with updated project details.
 */
export const updateProject = (id, projectData) => apiClient.put(`/manager/projects/${id}`, projectData);

/**
 * Archives a project and all its associated tasks in a single atomic operation.
 * This is the only way projects get archived - representing completion of work.
 * @param {number} id - ID of the project to archive.
 * @returns {Promise} Axios response promise with archive result:
 *   { archived_project, archived_tasks_count, message }
 */
export const archiveProject = (id) => apiClient.post(`/manager/projects/${id}/archive`);

// --- Task Management ---

/**
 * Retrieves all tasks for a specific project with assignee names included.
 * Essential for Project Detail Page to display comprehensive task information efficiently.
 * @param {number} projectId - ID of the project to get tasks for.
 * @param {number} pageId - The page number to retrieve (default: 1).
 * @param {number} pageSize - Number of tasks per page (default: 100, max: 100).
 * @returns {Promise} Axios response promise with array of tasks:
 *   [{ id, title, status, priority, assignee_id, assignee_name }]
 */
export const getProjectTasks = (projectId, pageId = 1, pageSize = 100) => 
  apiClient.get(`/manager/projects/${projectId}/tasks`, { params: { page_id: pageId, page_size: pageSize } });

/**
 * Creates a new task within a project owned by the manager's team.
 * Automatically extracts required skills from the task description using ML processing.
 * @param {object} taskData - Task details { project_id, title, description, priority }.
 *   Priority must be one of: 'low', 'medium', 'high', 'critical'.
 * @returns {Promise} Axios response promise with created task and required skills:
 *   { Task: {...}, TaskRequiredSkills: [...] }
 */
export const createTask = (taskData) => apiClient.post('/manager/tasks', taskData);

/**
 * Updates task details, status, or assignment in a unified endpoint.
 * Supports partial updates for Kanban boards, engineer assignments, and detail modifications.
 * Automatically handles user availability updates based on assignment changes.
 * @param {number} id - ID of the task to update.
 * @param {object} taskData - Fields to update { title?, description?, priority?, status?, assignee_id? }.
 *   - status: 'open', 'in_progress', 'done'
 *   - priority: 'low', 'medium', 'high', 'critical'
 *   - assignee_id: engineer ID (0 to unassign)
 *   At least one field must be provided.
 * @returns {Promise} Axios response promise with updated task details.
 */
export const updateTask = (id, taskData) => apiClient.patch(`/manager/tasks/${id}`, taskData);

// --- Engineer Recommendations ---

/**
 * Retrieves ML-powered recommendations of engineers best suited for a specific task.
 * Analyzes task's required skills and matches against team members' skill profiles.
 * @param {number} taskId - ID of the task to get recommendations for.
 * @param {number} limit - Maximum number of recommendations to return (default: 5, max: 50).
 * @returns {Promise} Axios response promise with ranked recommendations:
 *   { recommendations: [{ user_id, name, email, score }] }
 */
export const getTaskRecommendations = (taskId, limit = 5) => 
  apiClient.post('/manager/recommendations', { task_id: taskId, limit });
