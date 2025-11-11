import React from 'react';
import SkillBadge from '../../skills/components/SkillBadge';
import './ProfileCard.css';

/**
 * Profile Card Component
 * Display user info: name, bio, location
 * Display lists of offered and wanted skills using SkillBadge
 */
const ProfileCard = ({ profile, skills, isOwnProfile = false, onSendRequest = null }) => {
  return (
    <div className="profile-card">
      {/* Profile Header */}
      <div className="profile-card-header">
        <div className="profile-card-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-card-info">
          <h2 className="profile-card-name">{profile.name}</h2>
          <p className="profile-card-email">{profile.email}</p>
          {profile.location && (
            <p className="profile-card-location">📍 {profile.location}</p>
          )}
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="profile-card-bio">
          <h4>About</h4>
          <p>{profile.bio}</p>
        </div>
      )}

      {/* Skills Section */}
      <div className="profile-card-skills">
        {/* Offered Skills */}
        <div className="skill-group">
          <h4>Skills Offered ({skills.offered.length})</h4>
          {skills.offered.length > 0 ? (
            <div className="skill-badges">
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
            <p className="no-skills-text">No skills offered yet</p>
          )}
        </div>

        {/* Wanted Skills */}
        <div className="skill-group">
          <h4>Skills Wanted ({skills.wanted.length})</h4>
          {skills.wanted.length > 0 ? (
            <div className="skill-badges">
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
            <p className="no-skills-text">No skills wanted yet</p>
          )}
        </div>
      </div>

      {/* Action Button */}
      {!isOwnProfile && onSendRequest && skills.offered.length > 0 && (
        <div className="profile-card-actions">
          <button onClick={onSendRequest} className="btn btn-primary btn-full-width">
            Send Mentorship Request
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
