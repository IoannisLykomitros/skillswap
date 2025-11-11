import { useState, useEffect, useCallback } from 'react';
import { getAllSkills, addUserSkill, removeUserSkill } from '../../../services/skillService';
import { getErrorMessage } from '../../../utils/helpers';

/**
 * Custom hook for skills management
 * Fetches all available skills and provides functions to add/remove skills
 */
const useSkills = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fetchAllSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllSkills();
      
      if (response.success) {
        setAllSkills(response.data.skills);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSkills();
  }, [fetchAllSkills]);

  const addSkill = async (skillData) => {
    setActionLoading(true);
    setActionError(null);

    try {
      const response = await addUserSkill(skillData);
      
      if (response.success) {
        return { success: true, data: response.data };
      }
      
      return { success: false, error: 'Failed to add skill' };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setActionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const removeSkill = async (userSkillId) => {
    setActionLoading(true);
    setActionError(null);

    try {
      const response = await removeUserSkill(userSkillId);
      
      if (response.success) {
        return { success: true };
      }
      
      return { success: false, error: 'Failed to remove skill' };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setActionError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoading(false);
    }
  };

  const getSkillsByCategory = useCallback(() => {
    const grouped = {};
    
    allSkills.forEach(skill => {
      const category = skill.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });
    
    return grouped;
  }, [allSkills]);

  return {
    loading,
    error,
    allSkills,
    actionLoading,
    actionError,
    addSkill,
    removeSkill,
    refetch: fetchAllSkills,
    getSkillsByCategory
  };
};

export default useSkills;
