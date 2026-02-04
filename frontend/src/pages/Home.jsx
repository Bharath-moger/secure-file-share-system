import { useState, useEffect } from 'react';
import { getAllUsers } from '../api/users';
import { uploadImage } from '../api/images';
import { useAuth } from '../context/AuthContext';

/**
 * Home Page
 * Upload images to other users
 */
const Home = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        // Exclude current user from the list
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
      // Validate file type
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
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      // Reset form
      setSelectedReceiver('');
      setSelectedFile(null);
      // Reset file input
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
    <div className="page-container">
      <h1>Upload Image</h1>
      <div className="upload-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="receiver">Select Receiver</label>
            <select
              id="receiver"
              value={selectedReceiver}
              onChange={(e) => setSelectedReceiver(e.target.value)}
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

          <div className="form-group">
            <label htmlFor="file-input">Select Image</label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {selectedFile && (
              <p className="file-info">Selected: {selectedFile.name}</p>
            )}
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;

