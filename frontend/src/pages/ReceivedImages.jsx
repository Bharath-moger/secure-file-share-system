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
      <div style={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <div style={{ color: 'rgba(15,23,42,0.65)', fontWeight: 800, fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Received Images</h1>
        <p className="pageSubtitle">Images you've received with steganography</p>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 14 }}>{error}</div>
      )}

      {images.length === 0 ? (
        <div className="card card--padded">
          <p className="pageSubtitle" style={{ margin: 0, textAlign: 'center' }}>No images received yet.</p>
        </div>
      ) : (
        <div className="card tableWrap">
          <table className="table">
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
                    <span className={image.status === 'DOWNLOADED' ? 'badge badge--ok' : 'badge badge--pending'}>
                      {image.status}
                    </span>
                  </td>
                  <td>{formatDate(image.created_at)}</td>
                  <td>
                    <button
                      onClick={() => handleDownload(image.id, image.original_filename)}
                      disabled={downloading[image.id]}
                      className="btn btn--emerald"
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

