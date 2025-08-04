import apiClient from '../utils/auth';

// --- Team Management ---

/**
 * Fetches teams. Can fetch all paginated teams or only unmanaged teams.
 * @param {boolean} unmanaged - If true, fetches all teams without a manager.
 * @param {number} pageId - The page number for paginated results.
 * @param {number} pageSize - The number of items per page.
 * @returns {Promise} Axios response promise.
 */
export const getTeams = async (unmanaged = false, pageId = 1, pageSize = 10) => {
  if (unmanaged) {
    return await apiClient.get('/admin/teams', { params: { unmanaged: true } });
  }
  return await apiClient.get('/admin/teams', { params: { page_id: pageId, page_size: pageSize } });
};

export const createTeam = async (teamName) => {
  return await apiClient.post('/admin/teams', { team_name: teamName });
};


// --- Invitation Management (Admin) ---

/**
 * Fetches invitations with a filter for 'all' or 'me'.
 * @returns {Promise} Axios response promise with { total_count, data }.
 */
export const getAdminInvitations = async (pageId = 1, pageSize = 10, filter = 'all') => {
  const params = { page_id: pageId, page_size: pageSize };
  if (filter === 'me') {
    params.inviter_id = 'me';
  }
  return await apiClient.get('/admin/invitations', { params });
};

export const inviteManager = async (email, teamId) => {
  return await apiClient.post('/admin/invitations', { email, team_id: teamId });
};

export const deleteInvitation = async (invitationId) => {
  return await apiClient.delete(`/admin/invitations/${invitationId}`);
};


// --- Skill Management ---

/**
 * Fetches a paginated list of skills filtered by verification status and optional search query.
 * @param {boolean} verified - The verification status to filter by.
 * @param {number} pageId - The page number (default is 1).
 * @param {number} pageSize - The number of skills per page (default is 10).
 * @param {string} searchQuery - Optional search term to filter skills by name.
 * @returns {Promise} Axios response promise.
 */
export const getSkills = async (verified, pageId = 1, pageSize = 10, searchQuery = '') => {
  const params = {
    verified,
    page_id: pageId,
    page_size: pageSize,
  };
  if (searchQuery) {
    params.search = searchQuery;
  }
  return await apiClient.get('/admin/skills', { params });
};

/**
 * Retrieves all aliases associated with a specific skill.
 * @param {number} skillId - The ID of the skill.
 * @returns {Promise} Axios response promise containing the aliases.
 */
export const getSkillAliases = async (skillId) => {
  return await apiClient.get(`/admin/skills/${skillId}/aliases`);
};

/**
 * Updates the verification status of a specific skill.
 * @param {number} skillId - The ID of the skill.
 * @param {boolean} isVerified - The new verification status.
 * @returns {Promise} Axios response promise after the update.
 */
export const updateSkillVerification = async (skillId, isVerified) => {
  return await apiClient.patch(`/admin/skills/${skillId}`, { is_verified: isVerified });
};

/**
 * Deletes a skill by its ID.
 * @param {number} skillId - The ID of the skill to delete.
 * @returns {Promise} Axios response promise after deletion.
 */
export const deleteSkill = async (skillId) => {
  return await apiClient.delete(`/admin/skills/${skillId}`);
};

/**
 * Creates a new alias for a given skill.
 * @param {string} aliasName - The alias name to add.
 * @param {number} skillId - The ID of the skill to associate with the alias.
 * @returns {Promise} Axios response promise after creation.
 */
export const createSkillAlias = async (aliasName, skillId) => {
  return await apiClient.post('/admin/skill-aliases', { alias_name: aliasName, skill_id: skillId });
};

/**
 * Creates a new verified skill.
 * @param {string} skillName - The name of the skill to create.
 */
export const createSkill = async (skillName) => {
    return await apiClient.post('/admin/skills', { skill_name: skillName });
};

// --- User Management ---

/**
 * Fetches a paginated, searchable, and filterable list of users.
 * @param {number} pageId - The page number.
 * @param {number} pageSize - The number of items per page.
 * @param {string} search - Search term for name or email.
 * @param {string} role - Role to filter by ('admin', 'manager', 'engineer').
 */
export const getUsers = async (pageId = 1, pageSize = 10, search = '', role = '') => {
  const params = { page_id: pageId, page_size: pageSize, search, role };
  return await apiClient.get('/admin/users', { params });
};

/**
 * Updates a user's role and/or team assignment.
 * @param {number} userId - The ID of the user to update.
 * @param {object} updateData - The data to update (e.g., { role: 'manager', teamId: 5 }).
 */
export const updateUser = async (userId, updateData) => {
  return await apiClient.patch(`/admin/users/${userId}`, updateData);
};

/**
 * Gets the "dry run" impact assessment before deleting a user.
 * @param {number} userId - The ID of the user to analyze.
 */
export const getUserDeletionImpact = async (userId) => {
  return await apiClient.get(`/admin/users/${userId}/delete-impact`);
};

/**
 * Permanently deletes a user.
 * @param {number} userId - The ID of the user to delete.
 */
export const deleteUser = async (userId) => {
  return await apiClient.delete(`/admin/users/${userId}`);
}

