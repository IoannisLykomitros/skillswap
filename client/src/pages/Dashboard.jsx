import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../features/dashboard/hooks/useDashboard';
import DashboardStats from '../features/dashboard/components/DashboardStats';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { loading, error, stats } = useDashboard();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-message">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          {user && <p className="welcome-text">Welcome back, <strong>{user.name}</strong>!</p>}
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <DashboardStats stats={stats} />

      {/* Request lists will be added in next task */}
      <div className="dashboard-content">
        <p style={{ textAlign: 'center', color: '#999' }}>
          Request lists coming in next task...
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
