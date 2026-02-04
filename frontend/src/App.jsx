import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import SentImages from './pages/SentImages';
import ReceivedImages from './pages/ReceivedImages';
import VerifyImage from './pages/VerifyImage';

/**
 * Main App Component
 * Sets up React Router and protected routes
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sent"
              element={
                <ProtectedRoute>
                  <SentImages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/received"
              element={
                <ProtectedRoute>
                  <ReceivedImages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify"
              element={
                <ProtectedRoute>
                  <VerifyImage />
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
