import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Dashboard layout: sidebar + main content with correct proportions
 */
const DashboardLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="appShell">
      <Sidebar />
      <main className="main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
