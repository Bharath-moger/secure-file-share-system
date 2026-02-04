import { useState, useEffect } from 'react';
import { getSentImages } from '../api/images';
import { getAllUsers } from '../api/users';

/**
 * Sent Images Page
 * Shows all images sent by the logged-in user
 */
const SentImages = () => {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState({}); // Map of user_id -> username
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sent images and users in parallel
        const [imagesData, usersData] = await Promise.all([
          getSentImages(),
          getAllUsers(),
        ]);

        // Create user map for quick lookup
        const userMap = {};
        usersData.forEach((user) => {
          userMap[user.id] = user.username;
        });

        setUsers(userMap);
        setImages(imagesData);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load sent images');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Sent Images</h1>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Sent Images</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Sent Images</h1>
      {images.length === 0 ? (
        <div className="empty-state">No images sent yet.</div>
      ) : (
        <div className="images-list">
          <table className="images-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id}>
                  <td>{image.original_filename}</td>
                  <td>{users[image.receiver_id] || image.receiver_id}</td>
                  <td>
                    <span className={`status status-${image.status.toLowerCase()}`}>
                      {image.status}
                    </span>
                  </td>
                  <td>{formatDate(image.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SentImages;

