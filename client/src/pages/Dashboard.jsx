import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      {user && (
        <div className="user-info">
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a href="/skills" className="btn btn-primary">Browse Skills</a>
      </div>
    </div>
  );
};

export default Dashboard;
