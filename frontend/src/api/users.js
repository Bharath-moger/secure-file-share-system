import api from './axios';

/**
 * Users API endpoints
 */

// Get all users
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

