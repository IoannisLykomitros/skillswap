import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useDashboard from '../features/dashboard/hooks/useDashboard';
import DashboardStats from '../features/dashboard/components/DashboardStats';
import RequestCard from '../features/mentorship/components/RequestCard';
import { acceptRequest, declineRequest, completeRequest } from '../services/mentorshipService';
import { getErrorMessage } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { loading, error, sentRequests, receivedRequests, stats, refetch } = useDashboard();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle accepting a request
  const handleAccept = async (requestId) => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      await acceptRequest(requestId);
      await refetch(); // Refresh dashboard data
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async (requestId) => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      await declineRequest(requestId);
      await refetch(); 
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (requestId) => {
    setActionLoading(true);
    setActionError(null);
    
    try {
      await completeRequest(requestId);
      await refetch();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p className="error-message">{error}</p>
          <button onClick={refetch} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          {user && (
            <>
              <p className="welcome-text">Welcome back, <strong>{user.name}</strong>!</p>
              <a href={`/profile/${user.id}`} className="btn btn-sm" style={{ marginTop: '0.5rem' }}>
                View My Profile
              </a>
            </>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>


      {/* Action Error Display */}
      {actionError && (
        <div className="error-message">
          <span>{actionError}</span>
          <button 
            className="error-dismiss"
            onClick={() => setActionError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Dashboard Content */}
      <div className="dashboard-content">
        
        {/* Pending Received Requests */}
        <section className="dashboard-section">
          <h2 className="section-title">
            📥 Pending Requests Received ({receivedRequests.pending.length})
          </h2>
          {receivedRequests.pending.length > 0 ? (
            <div className="requests-grid">
              {receivedRequests.pending.map((request) => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  type="received"
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending requests received</p>
              <small>When someone requests to learn from you, it will appear here</small>
            </div>
          )}
        </section>

        {/* Pending Sent Requests */}
        <section className="dashboard-section">
          <h2 className="section-title">
            📤 Pending Requests Sent ({sentRequests.pending.length})
          </h2>
          {sentRequests.pending.length > 0 ? (
            <div className="requests-grid">
              {sentRequests.pending.map((request) => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  type="sent"
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending sent requests</p>
              <small>Browse skills and send mentorship requests to start learning</small>
            </div>
          )}
        </section>

        {/* Active Mentorships */}
        <section className="dashboard-section">
          <h2 className="section-title">
            🤝 Active Mentorships ({sentRequests.accepted.length + receivedRequests.accepted.length})
          </h2>
          {(sentRequests.accepted.length + receivedRequests.accepted.length) > 0 ? (
            <div className="requests-grid">
              {/* Mentorships where I'm learning */}
              {sentRequests.accepted.map((request) => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  type="sent"
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                />
              ))}
              {/* Mentorships where I'm teaching */}
              {receivedRequests.accepted.map((request) => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  type="received"
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No active mentorships</p>
              <small>Accept pending requests or wait for your requests to be accepted</small>
            </div>
          )}
        </section>

        {/* Completed Mentorships */}
        <section className="dashboard-section">
          <h2 className="section-title">
            ✅ Completed Mentorships ({sentRequests.completed.length + receivedRequests.completed.length})
          </h2>
          {(sentRequests.completed.length + receivedRequests.completed.length) > 0 ? (
            <div className="requests-grid">
              {sentRequests.completed.map((request) => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  type="sent"
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                />
              ))}
              {receivedRequests.completed.map((request) => (
                <RequestCard
                  key={request.requestId}
                  request={request}
                  type="received"
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No completed mentorships yet</p>
              <small>Mark active mentorships as complete when finished</small>
            </div>
          )}
        </section>

        {/* Declined Requests (collapsible) */}
        {(sentRequests.declined.length + receivedRequests.declined.length) > 0 && (
          <section className="dashboard-section">
            <details>
              <summary className="section-title clickable">
                ❌ Declined Requests ({sentRequests.declined.length + receivedRequests.declined.length})
              </summary>
              <div className="requests-grid" style={{ marginTop: '1rem' }}>
                {sentRequests.declined.map((request) => (
                  <RequestCard
                    key={request.requestId}
                    request={request}
                    type="sent"
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onComplete={handleComplete}
                  />
                ))}
                {receivedRequests.declined.map((request) => (
                  <RequestCard
                    key={request.requestId}
                    request={request}
                    type="received"
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onComplete={handleComplete}
                  />
                ))}
              </div>
            </details>
          </section>
        )}

      </div>

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
