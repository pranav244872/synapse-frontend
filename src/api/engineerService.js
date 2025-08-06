import apiClient from '../utils/auth';

/**
 * Retrieves the single task currently assigned to the engineer.
 */
export const getCurrentTask = () => apiClient.get('/engineer/current-task');

/**
 * Retrieves a read-only list of all tasks for a given project.
 * @param {number} projectId - The ID of the project.
 */
export const getProjectTasksReadOnly = (projectId) => apiClient.get(`/engineer/projects/${projectId}/tasks`);

/**
 * Retrieves full details for a single task.
 * @param {number} taskId - The ID of the task.
 */
export const getTaskDetails = (taskId) => apiClient.get(`/engineer/tasks/${taskId}`);

/**
 * Marks the engineer's currently assigned task as "done".
 * @param {number} taskId - The ID of the task to complete.
 */
export const completeTask = (taskId) => apiClient.post(`/engineer/tasks/${taskId}/complete`);

/**
 * Retrieves the engineer's paginated and searchable task history.
 * @param {number} pageId - The page number.
 * @param {number} pageSize - The number of items per page.
 * @param {string} search - The search term.
 */
export const getTaskHistory = (pageId = 1, pageSize = 10, search = '') => {
    return apiClient.get('/engineer/tasks/history', { params: { page_id: pageId, page_size: pageSize, search } });
};
