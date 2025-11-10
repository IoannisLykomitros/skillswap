import React from 'react';
import { formatRelativeTime } from '../../../utils/helpers';
import './RequestCard.css';

/**
 * Request Card Component
 * Displays mentorship request information
 * Adapts display based on perspective (sent vs received)
 */
const RequestCard = ({ request, type, onAccept, onDecline, onComplete }) => {
  const displayUser = type === 'sent' ? request.receiver : request.sender;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'declined':
        return 'status-declined';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  return (
    <div className={`request-card ${getStatusColor(request.status)}`}>
      <div className="request-header">
        <div className="request-user">
          <div className="user-avatar">
            {displayUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h4>{displayUser.name}</h4>
            <p className="user-email">{displayUser.email}</p>
          </div>
        </div>
        <span className={`status-badge ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </div>

      <div className="request-body">
        <div className="skill-info">
          <span className="skill-label">Skill:</span>
          <span className="skill-name">{request.skill.skillName}</span>
          <span className="skill-category">({request.skill.category})</span>
        </div>

        {request.message && (
          <div className="request-message">
            <p className="message-label">Message:</p>
            <p className="message-text">"{request.message}"</p>
          </div>
        )}

        <div className="request-meta">
          <span className="request-date">
            {type === 'sent' ? 'Sent' : 'Received'} {formatRelativeTime(request.createdAt)}
          </span>
          {request.completedAt && (
            <span className="completed-date">
              Completed {formatRelativeTime(request.completedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Action buttons based on status and type */}
      <div className="request-actions">
        {/* Received pending requests - show accept/decline */}
        {type === 'received' && request.status === 'pending' && (
          <>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onAccept(request.requestId)}
            >
              Accept
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onDecline(request.requestId)}
            >
              Decline
            </button>
          </>
        )}

        {/* Accepted requests - show complete button for both parties */}
        {request.status === 'accepted' && (
          <button 
            className="btn btn-success btn-sm"
            onClick={() => onComplete(request.requestId)}
          >
            Mark as Complete
          </button>
        )}

        {/* Sent pending requests - show waiting status */}
        {type === 'sent' && request.status === 'pending' && (
          <span className="waiting-text">Awaiting response...</span>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
