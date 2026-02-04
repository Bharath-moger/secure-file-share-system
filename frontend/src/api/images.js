import api from './axios';

/**
 * Images API endpoints
 */

// Upload an image
export const uploadImage = async (receiverId, file) => {
  const formData = new FormData();
  formData.append('receiver_id', receiverId);
  formData.append('file', file);
  
  const response = await api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get sent images
export const getSentImages = async () => {
  const response = await api.get('/images/sent');
  return response.data;
};

// Get received images
export const getReceivedImages = async () => {
  const response = await api.get('/images/received');
  return response.data;
};

// Download an image
export const downloadImage = async (imageId) => {
  const response = await api.get(`/images/${imageId}/download`, {
    responseType: 'blob', // Important for file downloads
  });
  return response;
};

// Verify image steganography
export const verifyImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/images/verify', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

