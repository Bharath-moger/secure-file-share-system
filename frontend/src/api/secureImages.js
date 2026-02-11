import api from './axios';

/**
 * Secure Images API endpoints
 * For encrypted image functionality
 */

// Upload a secure encrypted image
export const uploadSecureImage = async (receiverId, password, file) => {
  const formData = new FormData();
  formData.append('receiver_id', receiverId);
  formData.append('password', password);
  formData.append('file', file);
  
  const response = await api.post('/images/secure/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Download encrypted image (public, but encrypted)
export const downloadSecureImage = async (imageId) => {
  const response = await api.get(`/images/secure/${imageId}/download`, {
    responseType: 'blob',
  });
  return response;
};

// Unlock/decrypt secure image with password
export const unlockSecureImage = async (imageId, password) => {
  const formData = new FormData();
  formData.append('password', password);
  
  const response = await api.post(`/images/secure/${imageId}/unlock`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'blob',
  });
  return response;
};

// Get sent secure images
export const getSentSecureImages = async () => {
  const response = await api.get('/images/secure/sent');
  return response.data;
};

// Get received secure images
export const getReceivedSecureImages = async () => {
  const response = await api.get('/images/secure/received');
  return response.data;
};
