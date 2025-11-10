import { useState, useEffect, useCallback } from 'react';
import { getSentRequests, getReceivedRequests } from '../../../services/mentorshipService';
import { getErrorMessage } from '../../../utils/helpers';

/**
 * Custom hook for dashboard data management
 * Fetches and organizes mentorship requests by status
 */
const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [sentData, receivedData] = await Promise.all([
        getSentRequests(),
        getReceivedRequests()
      ]);

      if (sentData.success) {
        setSentRequests(sentData.data.requests);
      }

      if (receivedData.success) {
        setReceivedRequests(receivedData.data.requests);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = {
    sentPending: sentRequests.pending.length,
    sentAccepted: sentRequests.accepted.length,
    sentDeclined: sentRequests.declined.length,
    sentCompleted: sentRequests.completed.length,
    sentTotal: sentRequests.pending.length + 
               sentRequests.accepted.length + 
               sentRequests.declined.length + 
               sentRequests.completed.length,

    receivedPending: receivedRequests.pending.length,
    receivedAccepted: receivedRequests.accepted.length,
    receivedDeclined: receivedRequests.declined.length,
    receivedCompleted: receivedRequests.completed.length,
    receivedTotal: receivedRequests.pending.length + 
                   receivedRequests.accepted.length + 
                   receivedRequests.declined.length + 
                   receivedRequests.completed.length,

    activeMentorships: sentRequests.accepted.length + receivedRequests.accepted.length,
    pendingRequests: sentRequests.pending.length + receivedRequests.pending.length,
    completedTotal: sentRequests.completed.length + receivedRequests.completed.length
  };

  return {
    loading,
    error,
    sentRequests,
    receivedRequests,
    stats,
    refetch: fetchDashboardData
  };
};

export default useDashboard;
