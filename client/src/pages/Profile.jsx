import React from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  
  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p>Viewing profile for user ID: {userId}</p>
      <a href="/">Back to Home</a>
    </div>
  );
};

export default Profile;
