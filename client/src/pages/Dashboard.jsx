import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSentRequests, getReceivedRequests } from '../services/mentorshipService';
import RequestActions from '../features/mentorship/components/RequestActions';
import { getErrorMessage } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sentRequests, setSentRequests] = useState({
    pending: [],
    accepted: [],
    declined: [],
    completed: []
  });
  const [receivedRequests, setReceivedRequests] = useState({
    pending: [],
    accepted: [],
    declined: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        getSentRequests(),
        getReceivedRequests()
      ]);

      console.log('Sent response:', sentResponse);
      console.log('Received response:', receivedResponse);

      if (sentResponse.success) {
        setSentRequests(sentResponse.data.requests || {
          pending: [],
          accepted: [],
          declined: [],
          completed: []
        });
      }

      if (receivedResponse.success) {
        setReceivedRequests(receivedResponse.data.requests || {
          pending: [],
          accepted: [],
          declined: [],
          completed: []
        });
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleActionComplete = (action, requestId) => {
    const messages = {
      accepted: 'Request accepted successfully!',
      declined: 'Request declined.',
      completed: 'Mentorship marked as complete!'
    };
    
    setSuccessMessage(messages[action] || 'Action completed successfully!');
    fetchRequests();
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pendingSent = sentRequests.pending || [];
  const acceptedSent = sentRequests.accepted || [];
  const pendingReceived = receivedRequests.pending || [];
  const acceptedReceived = receivedRequests.accepted || [];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          {user && (
            <p className="welcome-text">Welcome back, <strong>{user.name}</strong>!</p>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
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

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button 
            className="error-dismiss"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Received Requests Section */}
        <section className="dashboard-section">
          <h2>Received Requests</h2>
          
          {/* Pending Received */}
          <div className="request-category">
            <h3>Pending ({pendingReceived.length})</h3>
            {pendingReceived.length > 0 ? (
              <div className="requests-list">
                {pendingReceived.map(request => (
                  <div key={request.requestId} className="request-card pending">
                    <div className="request-header">
                      <div className="request-user">
                        <div className="user-avatar">
                          {request.sender.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4>{request.sender.name}</h4>
                          <p className="skill-tag">Wants to learn: {request.skill.skillName}</p>
                        </div>
                      </div>
                      <span className="status-badge status-pending">Pending</span>
                    </div>
                    {request.message && (
                      <p className="request-message">"{request.message}"</p>
                    )}
                    <div className="request-footer">
                      <span className="request-date">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <RequestActions
                        request={{
                          id: request.requestId,
                          senderId: request.sender.id,
                          senderName: request.sender.name,
                          receiverId: user.id,
                          receiverName: user.name,
                          skillId: request.skill.id,
                          skillName: request.skill.skillName,
                          status: request.status,
                          message: request.message,
                          createdAt: request.createdAt,
                          updatedAt: request.updatedAt
                        }}
                        currentUserId={user.id}
                        onActionComplete={handleActionComplete}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No pending requests</p>
            )}
          </div>

          {/* Active Mentorships (Received) */}
          <div className="request-category">
            <h3>Active Mentorships ({acceptedReceived.length})</h3>
            {acceptedReceived.length > 0 ? (
              <div className="requests-list">
                {acceptedReceived.map(request => (
                  <div key={request.requestId} className="request-card accepted">
                    <div className="request-header">
                      <div className="request-user">
                        <div className="user-avatar">
                          {request.sender.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4>{request.sender.name}</h4>
                          <p className="skill-tag">Learning: {request.skill.skillName}</p>
                        </div>
                      </div>
                      <span className="status-badge status-accepted">Active</span>
                    </div>
                    <div className="request-footer">
                      <span className="request-date">
                        Started: {new Date(request.updatedAt).toLocaleDateString()}
                      </span>
                      <RequestActions
                        request={{
                          id: request.requestId,
                          senderId: request.sender.id,
                          senderName: request.sender.name,
                          receiverId: user.id,
                          receiverName: user.name,
                          skillId: request.skill.id,
                          skillName: request.skill.skillName,
                          status: request.status,
                          message: request.message,
                          createdAt: request.createdAt,
                          updatedAt: request.updatedAt
                        }}
                        currentUserId={user.id}
                        onActionComplete={handleActionComplete}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No active mentorships</p>
            )}
          </div>
        </section>

        {/* Sent Requests Section */}
        <section className="dashboard-section">
          <h2>My Requests</h2>
          
          {/* Pending Sent */}
          <div className="request-category">
            <h3>Pending ({pendingSent.length})</h3>
            {pendingSent.length > 0 ? (
              <div className="requests-list">
                {pendingSent.map(request => (
                  <div key={request.requestId} className="request-card pending">
                    <div className="request-header">
                      <div className="request-user">
                        <div className="user-avatar">
                          {request.receiver.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4>{request.receiver.name}</h4>
                          <p className="skill-tag">Skill: {request.skill.skillName}</p>
                        </div>
                      </div>
                      <span className="status-badge status-pending">Pending</span>
                    </div>
                    {request.message && (
                      <p className="request-message">"{request.message}"</p>
                    )}
                    <div className="request-footer">
                      <span className="request-date">
                        Sent: {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No pending requests</p>
            )}
          </div>

          {/* Active Mentorships (Sent) */}
          <div className="request-category">
            <h3>Active Learning ({acceptedSent.length})</h3>
            {acceptedSent.length > 0 ? (
              <div className="requests-list">
                {acceptedSent.map(request => (
                  <div key={request.requestId} className="request-card accepted">
                    <div className="request-header">
                      <div className="request-user">
                        <div className="user-avatar">
                          {request.receiver.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4>{request.receiver.name}</h4>
                          <p className="skill-tag">Learning: {request.skill.skillName}</p>
                        </div>
                      </div>
                      <span className="status-badge status-accepted">Active</span>
                    </div>
                    <div className="request-footer">
                      <span className="request-date">
                        Started: {new Date(request.updatedAt).toLocaleDateString()}
                      </span>
                      <RequestActions
                        request={{
                          id: request.requestId,
                          senderId: user.id,
                          senderName: user.name,
                          receiverId: request.receiver.id,
                          receiverName: request.receiver.name,
                          skillId: request.skill.id,
                          skillName: request.skill.skillName,
                          status: request.status,
                          message: request.message,
                          createdAt: request.createdAt,
                          updatedAt: request.updatedAt
                        }}
                        currentUserId={user.id}
                        onActionComplete={handleActionComplete}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No active learning sessions</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
