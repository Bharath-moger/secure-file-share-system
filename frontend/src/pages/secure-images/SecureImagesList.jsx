import { useState, useEffect } from 'react';
import { downloadSecureImage, unlockSecureImage, getSentSecureImages, getReceivedSecureImages } from '../../api/secureImages';
import { getAllUsers } from '../../api/users';
import { useAuth } from '../../context/AuthContext';

/**
 * Secure Images List Page
 * Shows encrypted images (sent/received)
 * Note: This requires a backend endpoint to list secure images
 * For now, this is a placeholder that can be enhanced when the endpoint is added
 */
const SecureImagesList = () => {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unlocking, setUnlocking] = useState({});
  const [unlockModal, setUnlockModal] = useState({ open: false, image: null });
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [decryptedImageUrl, setDecryptedImageUrl] = useState(null);
  const [decryptedBlob, setDecryptedBlob] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, sentImages, receivedImages] = await Promise.all([
          getAllUsers(),
          getSentSecureImages(),
          getReceivedSecureImages(),
        ]);
        
        const userMap = {};
        usersData.forEach((u) => {
          userMap[u.id] = u.username;
        });
        setUsers(userMap);
        
        // Combine sent and received images
        const allImages = [
          ...sentImages.map(img => ({ ...img, type: 'sent' })),
          ...receivedImages.map(img => ({ ...img, type: 'received' }))
        ];
        setImages(allImages);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (imageId) => {
    try {
      const response = await downloadSecureImage(imageId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `encrypted_image_${imageId}.enc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to download encrypted image');
    }
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    const imageId = unlockModal.image?.id;
    if (!imageId) return;

    if (!unlockPassword) {
      setUnlockError('Please enter password');
      return;
    }

    setUnlocking({ ...unlocking, [imageId]: true });
    setUnlockError('');

    try {
      const response = await unlockSecureImage(imageId, unlockPassword);
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      setDecryptedBlob(blob);
      setDecryptedImageUrl(url);
      setUnlockPassword('');
    } catch (err) {
      setUnlockError(err.response?.data?.detail || 'Failed to unlock image. Wrong password?');
    } finally {
      setUnlocking({ ...unlocking, [imageId]: false });
    }
  };

  const closeUnlockModal = () => {
    setUnlockModal({ open: false, image: null });
    setUnlockPassword('');
    setUnlockError('');
    if (decryptedImageUrl) {
      window.URL.revokeObjectURL(decryptedImageUrl);
      setDecryptedImageUrl(null);
    }
    setDecryptedBlob(null);
  };

  const handleDownloadDecrypted = () => {
    const imageId = unlockModal.image?.id;
    if (!imageId || !decryptedBlob) return;

    const url = window.URL.createObjectURL(decryptedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `decrypted_${imageId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
        <h1 className="pageTitle">My Encrypted Images</h1>
        <p className="pageSubtitle">Download encrypted files and unlock clear images (receiver only)</p>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 14 }}>{error}</div>
      )}

      {/* Info Box */}
      <div className="alert alert--info" style={{ marginBottom: 14 }}>
        <strong>About Secure Images:</strong> The downloaded file is encrypted and unreadable. Only the
        receiver can unlock it (with the password) to view and download the clear image.
      </div>

      {images.length === 0 ? (
        <div className="card card--padded">
          <p className="pageSubtitle" style={{ margin: 0, textAlign: 'center' }}>
            No encrypted images found. Upload encrypted images to get started.
          </p>
        </div>
      ) : (
        <div className="card tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Image ID</th>
                <th>Type</th>
                <th>Other user</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id}>
                  <td>{image.id.substring(0, 8)}...</td>
                  <td>
                    <span className={image.type === 'sent' ? 'badge badge--pending' : 'badge badge--ok'}>
                      {image.type === 'sent' ? 'Sent' : 'Received'}
                    </span>
                  </td>
                  <td>
                    {image.type === 'sent' 
                      ? (users[image.receiver_id] || image.receiver_id)
                      : (users[image.sender_id] || image.sender_id)
                    }
                  </td>
                  <td>
                    <span className="badge badge--violet">
                      {image.status || 'LOCKED'}
                    </span>
                  </td>
                  <td>{image.created_at ? new Date(image.created_at).toLocaleString() : 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleDownload(image.id)}
                      className="linkBtn"
                    >
                      Download
                    </button>
                    {image.type === 'received' && (
                      <button
                        onClick={() => setUnlockModal({ open: true, image })}
                        className="linkBtn linkBtn--violet"
                        style={{ marginLeft: 12 }}
                      >
                        Unlock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Unlock Modal */}
      {unlockModal.open && (
        <div className="modalOverlay">
          <div className="modal">
            <h2 style={{ fontSize: 20, fontWeight: 900 }}>Unlock Encrypted Image</h2>
            <p className="pageSubtitle" style={{ marginTop: 6 }}>
              Receiver only. Enter the secret key to view the clear image.
            </p>
            
            <form onSubmit={handleUnlock}>
              <div className="field" style={{ marginTop: 12 }}>
                <label htmlFor="unlock-password">Enter Key</label>
                <input
                  type="password"
                  id="unlock-password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="input"
                  placeholder="sercret key for this image"
                  required
                  autoFocus
                />
              </div>

              {unlockError && (
                <div className="alert alert--error" style={{ marginTop: 12 }}>{unlockError}</div>
              )}

              {decryptedImageUrl && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ margin: '0 0 8px', fontWeight: 900 }}>Decrypted Preview</p>
                  <img 
                    src={decryptedImageUrl} 
                    alt="Decrypted" 
                    style={{ borderRadius: 12, border: '1px solid rgba(15,23,42,0.16)' }}
                  />
                  {unlockModal.image?.receiver_id === user?.id && (
                    <button
                      type="button"
                      onClick={handleDownloadDecrypted}
                      className="btn btn--emerald"
                      style={{ marginTop: 12, width: '100%' }}
                    >
                      Download clear image
                    </button>
                  )}
                </div>
              )}

              <div className="modalActions">
                <button
                  type="submit"
                  disabled={unlocking[unlockModal.image?.id]}
                  className="btn btn--violet"
                  style={{ flex: 1 }}
                >
                  {unlocking[unlockModal.image?.id] ? 'Unlocking...' : 'Unlock'}
                </button>
                <button
                  type="button"
                  onClick={closeUnlockModal}
                  className="btn btn--neutral"
                  style={{ flex: 1 }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecureImagesList;
