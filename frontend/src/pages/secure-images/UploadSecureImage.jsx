import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllUsers } from '../../api/users';
import { uploadSecureImage } from '../../api/secureImages';
import { useAuth } from '../../context/AuthContext';

/**
 * Upload Secure Encrypted Image Page
 * Uploads image that will be encrypted and locked
 */
const UploadSecureImage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(searchParams.get('receiver') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!password) {
      setMessage({ type: 'error', text: 'Please enter a password' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await uploadSecureImage(selectedReceiver, password, selectedFile);
      setMessage({ 
        type: 'success', 
        text: 'Secure image uploaded successfully! The image is now encrypted and locked. Only the receiver with the password can unlock it.' 
      });
      setSelectedReceiver('');
      setPassword('');
      setConfirmPassword('');
      setSelectedFile(null);
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Failed to upload secure image',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Upload Encrypted Image</h1>
        <p className="pageSubtitle">Encrypt and lock an image with a password</p>
      </div>

      {/* Info Box */}
      <div className="alert alert--info" style={{ marginBottom: 14 }}>
        <strong>How Secure Encryption Works:</strong> The image content is encrypted. Anyone can download
        the encrypted file, but it will be unreadable. Only the receiver with the password can unlock and
        download the clear image.
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
            <label htmlFor="password">Encryption Key</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter key for receiver"
              required
            />
            <p className="pageSubtitle" style={{ marginTop: 6, fontSize: 13 }}>Share this Secret key securely with the receiver</p>
          </div>

          <div className="field">
            <label htmlFor="confirm-password">Confirm Key</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Confirm key"
              required
            />
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
            className="btn btn--violet"
          >
            {loading ? 'Encrypting & Uploading...' : 'Upload Encrypted Image'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSecureImage;
