import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProfile from '../features/profile/hooks/useProfile';
import ProfileCard from '../features/profile/components/ProfileCard';
import SendRequestForm from '../features/mentorship/components/SendRequestForm';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, error, profile, skills, refetch } = useProfile(userId);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isOwnProfile = user && user.id === parseInt(userId);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleSendRequest = () => {
    setShowRequestModal(true);
  };

  const handleRequestSuccess = () => {
    setShowRequestModal(false);
    setSuccessMessage('Mentorship request sent successfully!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleCloseModal = () => {
    setShowRequestModal(false);
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
      {/* Page Header */}
      <div className="profile-page-header">
        <h1>{isOwnProfile ? 'My Profile' : `${profile.name}'s Profile`}</h1>
        {isOwnProfile && (
          <button onClick={handleEditProfile} className="btn btn-secondary">
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <span>✓ {successMessage}</span>
          <button 
            className="success-dismiss"
            onClick={() => setSuccessMessage('')}
          >
            ×
          </button>
        </div>
      )}

      {/* Profile Card */}
      <ProfileCard
        profile={profile}
        skills={skills}
        isOwnProfile={isOwnProfile}
        onSendRequest={!isOwnProfile && skills.offered.length > 0 ? handleSendRequest : null}
      />

      {/* Send Request Modal */}
      {showRequestModal && (
        <SendRequestForm
          mentorProfile={profile}
          mentorSkills={skills.offered}
          onClose={handleCloseModal}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
};

export default Profile;
