import axios from 'axios';
import { getToken, removeToken } from '../utils/helpers';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        removeToken();
        window.location.href = '/login';
      }
      
      if (status === 403) {
        console.error('Access forbidden');
      }
      
      if (status === 404) {
        console.error('Resource not found');
      }
      
      if (status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      console.error('Network error - no response from server');
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
