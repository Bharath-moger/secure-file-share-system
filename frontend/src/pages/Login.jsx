import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="authWrap">
      <div className="authCard card card--padded">
        <div className="pageHeader" style={{ textAlign: 'center' }}>
          <h1 className="authTitle">Sign in</h1>
          <p className="authHint">Welcome back to Secure Image Share</p>
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
              placeholder="Enter username"
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
              placeholder="Enter password"
              className="input"
            />
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <button type="submit" disabled={loading} className="btn btn--primary">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="authLink">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
