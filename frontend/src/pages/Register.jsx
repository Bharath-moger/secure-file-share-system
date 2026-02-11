import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerAPI } from '../api/auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerAPI(username, password);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authWrap">
      <div className="authCard card card--padded">
        <div className="pageHeader" style={{ textAlign: 'center' }}>
          <h1 className="authTitle">Create account</h1>
          <p className="authHint">Join Secure Image Share</p>
        </div>

        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              placeholder="Min 3 characters"
              className="input"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={72}
              placeholder="Min 8 characters"
              className="input"
            />
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <button type="submit" disabled={loading} className="btn btn--primary">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="authLink">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
