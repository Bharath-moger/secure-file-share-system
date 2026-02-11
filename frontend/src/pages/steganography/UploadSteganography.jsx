import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllUsers } from '../../api/users';
import { uploadImage } from '../../api/images';
import { useAuth } from '../../context/AuthContext';

/**
 * Upload Image with Steganography Page
 * Uploads image with hidden metadata
 */
const UploadSteganography = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(searchParams.get('receiver') || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const filteredUsers = allUsers.filter((u) => u.username !== user?.username);
        setUsers(filteredUsers);
      } catch (error) {
        setMessage({
          type: 'error',
          text: error.response?.data?.detail || 'Failed to load users',
        });
      }
    };

    fetchUsers();
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReceiver) {
      setMessage({ type: 'error', text: 'Please select a receiver' });
      return;
    }

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await uploadImage(selectedReceiver, selectedFile);
      setMessage({ type: 'success', text: 'Image uploaded successfully! Metadata is hidden inside the image.' });
      setSelectedReceiver('');
      setSelectedFile(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to upload image',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Upload Image (Steganography)</h1>
        <p className="pageSubtitle">Hide sender and receiver metadata inside the image</p>
      </div>

      {/* Info Box */}
      <div className="alert alert--info" style={{ marginBottom: 14 }}>
        <strong>How Steganography Works:</strong> The image will look normal, but sender and receiver
        info is hidden inside it. Verify later using “Verify Image”.
      </div>

      <div className="card card--padded">
        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label htmlFor="receiver">Select Receiver</label>
            <select
              id="receiver"
              value={selectedReceiver}
              onChange={(e) => setSelectedReceiver(e.target.value)}
              className="select"
              required
            >
              <option value="">-- Select a user --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="file-input">Select Image</label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileChange}
              className="input"
              required
            />
            {selectedFile && (
              <p className="pageSubtitle" style={{ marginTop: 8 }}>Selected: {selectedFile.name}</p>
            )}
          </div>

          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert--success' : 'alert--error'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary"
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSteganography;
