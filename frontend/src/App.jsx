import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Register from './pages/Register';
import Login from './pages/Login';

// Dashboard Pages
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import SentImages from './pages/SentImages';
import ReceivedImages from './pages/ReceivedImages';

// Steganography Pages
import UploadSteganography from './pages/steganography/UploadSteganography';
import VerifySteganography from './pages/steganography/VerifySteganography';

// Secure Images Pages
import UploadSecureImage from './pages/secure-images/UploadSecureImage';
import SecureImagesList from './pages/secure-images/SecureImagesList';

/**
 * Main App Component
 * Sets up React Router and protected routes
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes with Dashboard Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Home />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Contacts />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sent"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SentImages />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/received"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReceivedImages />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Steganography routes */}
          <Route
            path="/steganography/upload"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UploadSteganography />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/steganography/verify"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <VerifySteganography />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Secure Images routes */}
          <Route
            path="/secure-images/upload"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UploadSecureImage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secure-images/list"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SecureImagesList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Legacy routes - redirect to new paths */}
          <Route path="/verify" element={<Navigate to="/steganography/verify" replace />} />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
