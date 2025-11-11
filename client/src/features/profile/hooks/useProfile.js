import { useState, useEffect, useCallback } from 'react';
import { getProfile } from '../../../services/profileService';
import { getUserSkills } from '../../../services/skillService';
import { getErrorMessage } from '../../../utils/helpers';

/**
 * Custom hook for profile data management
 * Fetches user profile and their skills
 */
const useProfile = (userId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState({
    offered: [],
    wanted: []
  });

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [profileData, skillsData] = await Promise.all([
        getProfile(userId),
        getUserSkills(userId)
      ]);

      if (profileData.success && profileData.profile) {
        setProfile(profileData.profile);
      }

      if (skillsData.success && skillsData.data.skills) {
        setSkills(skillsData.data.skills);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    loading,
    error,
    profile,
    skills,
    refetch: fetchProfile
  };
};

export default useProfile;
