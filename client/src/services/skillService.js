import api from './api';

/**
 * Skills Service
 * Handles all skills-related API calls
 */

export const getAllSkills = async (params = {}) => {
  const response = await api.get('/skills', { params });
  return response.data;
};

export const getUserSkills = async (userId) => {
  const response = await api.get(`/skills/user/${userId}`);
  return response.data;
};

export const addUserSkill = async (skillData) => {
  const response = await api.post('/skills/user', skillData);
  return response.data;
};

export const removeUserSkill = async (userSkillId) => {
  const response = await api.delete(`/skills/user/${userSkillId}`);
  return response.data;
};

export const getTopSkills = async (limit = 8) => {
  try {
    const response = await api.get(`/skills/top?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
