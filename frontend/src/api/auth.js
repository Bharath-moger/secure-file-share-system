import api from './axios';

/**
 * Auth API endpoints
 */

// Register a new user
export const register = async (username, password) => {
  const response = await api.post('/auth/register', {
    username,
    password,
  });
  return response.data;
};

// Login and get JWT token
export const login = async (username, password) => {
  const response = await api.post('/auth/login', {
    username,
    password,
  });
  return response.data;
};

