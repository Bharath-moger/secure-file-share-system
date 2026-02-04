import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI } from '../api/auth';
import { getAllUsers } from '../api/users';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Invalid stored user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginAPI(username, password);
      const token = response.access_token;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Fetch full user info from users endpoint
      try {
        const users = await getAllUsers();
        const currentUser = users.find((u) => u.username === username);
        const userData = currentUser || { username }; // Fallback to username if not found
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (err) {
        // If fetching user fails, just store username
        const userData = { username };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

