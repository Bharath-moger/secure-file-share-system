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
      <div style={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <div style={{ color: 'rgba(15,23,42,0.65)', fontWeight: 800, fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Sent Images</h1>
        <p className="pageSubtitle">Images you've sent with steganography</p>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 14 }}>{error}</div>
      )}

      {images.length === 0 ? (
        <div className="card card--padded">
          <p className="pageSubtitle" style={{ margin: 0, textAlign: 'center' }}>No images sent yet.</p>
        </div>
      ) : (
        <div className="card tableWrap">
          <table className="table">
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
                    <span className={image.status === 'DOWNLOADED' ? 'badge badge--ok' : 'badge badge--pending'}>
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

