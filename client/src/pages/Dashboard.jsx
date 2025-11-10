import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../features/dashboard/hooks/useDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { loading, error, stats } = useDashboard();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-page">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-page">Error: {error}</div>;
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      {user && (
        <div className="user-info">
          <p>Welcome, <strong>{user.name}</strong>!</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* Temporary stats display for testing */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Statistics</h3>
        <p>Active Mentorships: {stats.activeMentorships}</p>
        <p>Pending Requests: {stats.pendingRequests}</p>
        <p>Completed: {stats.completedTotal}</p>
      </div>

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
