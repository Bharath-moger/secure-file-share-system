import { useState, useEffect } from 'react';
import { getReceivedImages, downloadImage } from '../api/images';
import { getAllUsers } from '../api/users';

/**
 * Received Images Page
 * Shows all images received by the logged-in user
 */
const ReceivedImages = () => {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState({}); // Map of user_id -> username
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState({}); // Track which image is downloading

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch received images and users in parallel
        const [imagesData, usersData] = await Promise.all([
          getReceivedImages(),
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
        setError(err.response?.data?.detail || 'Failed to load received images');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (imageId, filename) => {
    try {
      setDownloading((prev) => ({ ...prev, [imageId]: true }));
      
      const response = await downloadImage(imageId);
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Use original filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Refresh the list to update status
      const imagesData = await getReceivedImages();
      setImages(imagesData);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to download image');
    } finally {
      setDownloading((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Received Images</h1>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Received Images</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Received Images</h1>
      {images.length === 0 ? (
        <div className="empty-state">No images received yet.</div>
      ) : (
        <div className="images-list">
          <table className="images-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Sender</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id}>
                  <td>{image.original_filename}</td>
                  <td>{users[image.sender_id] || image.sender_id}</td>
                  <td>
                    <span className={`status status-${image.status.toLowerCase()}`}>
                      {image.status}
                    </span>
                  </td>
                  <td>{formatDate(image.created_at)}</td>
                  <td>
                    <button
                      onClick={() => handleDownload(image.id, image.original_filename)}
                      disabled={downloading[image.id]}
                      className="btn-download"
                    >
                      {downloading[image.id] ? 'Downloading...' : 'Download'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReceivedImages;

