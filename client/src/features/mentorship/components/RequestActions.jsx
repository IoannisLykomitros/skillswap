import React, { useState } from 'react';
import { acceptRequest, declineRequest, completeRequest } from '../../../services/mentorshipService';
import { getErrorMessage } from '../../../utils/helpers';
import './RequestActions.css';

/**
 * Request Actions Component
 * Shows Accept/Decline buttons for pending requests (receiver)
 * Shows Complete button for accepted mentorships (both parties)
 * Only shows relevant actions based on status and user role
 */
const RequestActions = ({ request, currentUserId, onActionComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isReceiver = currentUserId === request.receiverId;
  const isSender = currentUserId === request.senderId;

  const handleAccept = async () => {
    if (!window.confirm('Accept this mentorship request?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await acceptRequest(request.id);

      if (response.success) {
        if (onActionComplete) {
          onActionComplete('accepted', request.id);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!window.confirm('Decline this mentorship request?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await declineRequest(request.id);

      if (response.success) {
        if (onActionComplete) {
          onActionComplete('declined', request.id);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Mark this mentorship as completed?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await completeRequest(request.id);

      if (response.success) {
        if (onActionComplete) {
          onActionComplete('completed', request.id);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="request-actions-error">
        <span>{error}</span>
        <button onClick={() => setError(null)} className="error-close">×</button>
      </div>
    );
  }

  if (request.status === 'pending' && isReceiver) {
    return (
      <div className="request-actions">
        <button
          onClick={handleAccept}
          className="btn btn-success btn-sm"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Accept'}
        </button>
        <button
          onClick={handleDecline}
          className="btn btn-danger btn-sm"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Decline'}
        </button>
      </div>
    );
  }

  if (request.status === 'accepted') {
    return (
      <div className="request-actions">
        <button
          onClick={handleComplete}
          className="btn btn-primary btn-sm"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Mark as Complete'}
        </button>
      </div>
    );
  }

  return null;
};

export default RequestActions;
