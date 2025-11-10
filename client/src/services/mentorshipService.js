import api from './api';

/**
 * Mentorship Service
 * Handles all mentorship request-related API calls
 */

export const getSentRequests = async () => {
  const response = await api.get('/requests/sent');
  return response.data;
};

export const getReceivedRequests = async () => {
  const response = await api.get('/requests/received');
  return response.data;
};

export const sendRequest = async (requestData) => {
  const response = await api.post('/requests', requestData);
  return response.data;
};

export const acceptRequest = async (requestId) => {
  const response = await api.put(`/requests/${requestId}/accept`);
  return response.data;
};

export const declineRequest = async (requestId) => {
  const response = await api.put(`/requests/${requestId}/decline`);
  return response.data;
};

export const completeRequest = async (requestId) => {
  const response = await api.put(`/requests/${requestId}/complete`);
  return response.data;
};
