import React from 'react';
import { useParams } from 'react-router-dom';
import useProfile from '../features/profile/hooks/useProfile';

const Profile = () => {
  const { userId } = useParams();
  const { loading, error, profile, skills } = useProfile(userId);

  console.log('userId from URL:', userId);
  console.log('loading:', loading);
  console.log('error:', error);
  console.log('profile:', profile);
  console.log('skills:', skills);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p>Profile not found (profile is null or undefined)</p>
        <p>userId from URL: {userId}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Profile of {profile.name}</h1>
      <p>Email: {profile.email}</p>
      {profile.bio && <p>Bio: {profile.bio}</p>}
      {profile.location && <p>Location: {profile.location}</p>}
      
      <h2>Skills Offered ({skills.offered.length})</h2>
      <ul>
        {skills.offered.map((skill) => (
          <li key={skill.userSkillId}>
            {skill.skillName} - {skill.proficiencyLevel}
          </li>
        ))}
      </ul>

      <h2>Skills Wanted ({skills.wanted.length})</h2>
      <ul>
        {skills.wanted.map((skill) => (
          <li key={skill.userSkillId}>
            {skill.skillName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
