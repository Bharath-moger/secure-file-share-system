import { useState, useEffect } from 'react';
import { getAllUsers } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Contacts/Users Page
 * Display all users and allow selection for image actions
 */
const Contacts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const allUsers = await getAllUsers();
        // Exclude current user
        const filteredUsers = allUsers.filter((u) => u.username !== user?.username);
        setUsers(filteredUsers);
        setError('');
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleUserSelect = (userId) => {
    // Navigate to steganography upload with selected user
    navigate(`/steganography/upload?receiver=${userId}`);
  };

  if (loading) {
    return (
      <div style={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <div style={{ color: 'rgba(15,23,42,0.65)', fontWeight: 800, fontSize: 14 }}>
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Users & Contacts</h1>
        <p className="pageSubtitle">Select a user to share images with</p>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 14 }}>{error}</div>
      )}

      {users.length === 0 ? (
        <div className="card card--padded">
          <p className="pageSubtitle" style={{ margin: 0, textAlign: 'center' }}>No other users found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {users.map((u) => (
            <button
              type="button"
              key={u.id}
              onClick={() => handleUserSelect(u.id)}
              className="card card--padded cardHover"
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
              <div
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 999,
                  background: '#dbeafe',
                  color: '#1d4ed8',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                }}
              >
                {u.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 900, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.username}
                </div>
                <div className="pageSubtitle" style={{ marginTop: 4, fontSize: 13 }}>Click to select</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
