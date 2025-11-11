import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../features/profile/hooks/useProfile';
import ProfileCard from '../features/profile/components/ProfileCard';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error, profile, skills } = useProfile(userId);

  const isOwnProfile = user && user.id === parseInt(userId);

  const handleSendRequest = () => {
    alert('Send mentorship request');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

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
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <h1>{isOwnProfile ? 'My Profile' : `${profile.name}'s Profile`}</h1>
        {isOwnProfile && (
          <button onClick={handleEditProfile} className="btn btn-secondary">
            Edit Profile
          </button>
        )}
      </div>

      <ProfileCard
        profile={profile}
        skills={skills}
        isOwnProfile={isOwnProfile}
        onSendRequest={!isOwnProfile ? handleSendRequest : null}
      />
    </div>
  );
};

export default Profile;
