import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import useProfile from '../hooks/useProfile';
import ProfileEditForm from '../components/ProfileEditForm';
import './EditProfilePage.css';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { loading, error, profile, refetch } = useProfile(user?.id);

  const handleSuccess = (updatedProfile) => {
    console.log('Update success! Response:', updatedProfile); 
    
    if (updatedProfile && updatedProfile.name) {
      updateUser({
        ...user,
        name: updatedProfile.name
      });
    }
    
    refetch();
    
    navigate(`/profile/${user.id}`);
  };

  const handleCancel = () => {
    navigate(`/profile/${user.id}`);
  };

  if (loading) {
    return (
      <div className="edit-profile-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-profile-page">
        <div className="error-message">
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <h1>Edit Profile</h1>
        <p>Update your profile information</p>
      </div>

      <ProfileEditForm
        profile={profile}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditProfilePage;
