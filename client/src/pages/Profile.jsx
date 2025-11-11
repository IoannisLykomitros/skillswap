import React from 'react';
import { useParams } from 'react-router-dom';
import useProfile from '../features/profile/hooks/useProfile';
import SkillBadge from '../features/skills/components/SkillBadge';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { loading, error, profile, skills } = useProfile(userId);

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
        <div className="empty-state">
          <h2>Profile not found</h2>
          <p>The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            {profile.location && (
              <p className="profile-location">📍 {profile.location}</p>
            )}
          </div>
        </div>

        {profile.bio && (
          <div className="profile-bio">
            <h3>About</h3>
            <p>{profile.bio}</p>
          </div>
        )}

        <div className="profile-skills">
          <div className="skills-section">
            <h3>Skills Offered ({skills.offered.length})</h3>
            {skills.offered.length > 0 ? (
              <div className="skills-list">
                {skills.offered.map((skill) => (
                  <SkillBadge
                    key={skill.userSkillId}
                    skill={skill}
                    type="offer"
                    showLevel={true}
                  />
                ))}
              </div>
            ) : (
              <p className="no-skills">No skills offered yet</p>
            )}
          </div>

          <div className="skills-section">
            <h3>Skills Wanted ({skills.wanted.length})</h3>
            {skills.wanted.length > 0 ? (
              <div className="skills-list">
                {skills.wanted.map((skill) => (
                  <SkillBadge
                    key={skill.userSkillId}
                    skill={skill}
                    type="want"
                    showLevel={false}
                  />
                ))}
              </div>
            ) : (
              <p className="no-skills">No skills wanted yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
