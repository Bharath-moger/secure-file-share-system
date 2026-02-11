import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IconHome = () => (
  <svg width="20" height="20" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const IconUpload = () => (
  <svg width="18" height="18" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconFolder = () => (
  <svg width="18" height="18" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);
const IconSent = () => (
  <svg width="18" height="18" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);
const IconReceived = () => (
  <svg width="18" height="18" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const IconLogout = () => (
  <svg width="20" height="20" style={{ flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/**
 * Sidebar Navigation – fixed left sidebar with clear hierarchy and proportions
 */
const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { path: '/', label: 'Home', Icon: IconHome },
    { path: '/contacts', label: 'Users & Contacts', Icon: IconUsers },
    {
      path: '/steganography',
      label: 'Image Steganography',
      Icon: IconLock,
      children: [
        { path: '/steganography/upload', label: 'Upload Image', Icon: IconUpload },
        { path: '/sent', label: 'Sent Images', Icon: IconSent },
        { path: '/received', label: 'Received Images', Icon: IconReceived },
        { path: '/steganography/verify', label: 'Verify Image', Icon: IconCheck },
      ],
    },
    {
      path: '/secure-images',
      label: 'Secure Images',
      Icon: IconShield,
      children: [
        { path: '/secure-images/upload', label: 'Upload Encrypted Image', Icon: IconUpload },
        { path: '/secure-images/list', label: 'My Encrypted Images', Icon: IconFolder },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1 className="sidebar__title">Secure Image Share</h1>
        <p className="sidebar__subtitle" title={user?.username}>
          {user?.username || 'User'}
        </p>
      </div>

      {/* Nav – scrollable, consistent spacing */}
      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        <ul>
          {navItems.map((item) =>
            item.children ? (
              <li key={item.path} className="navSection">
                <div className="navSection__label">
                  <span className="navLink__icon" aria-hidden="true">
                    <item.Icon />
                  </span>
                  <span>{item.label}</span>
                </div>
                <ul>
                  {item.children.map((child) => {
                    const active = isActive(child.path);
                    return (
                      <li key={child.path}>
                        <Link
                          to={child.path}
                          className={`navLink ${active ? 'navLink--active' : ''}`}
                        >
                          <span className="navLink__icon" aria-hidden="true">
                            <child.Icon />
                          </span>
                          {child.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`navLink ${isActive(item.path) ? 'navLink--active' : ''}`}
                >
                  <span className="navLink__icon" aria-hidden="true">
                    <item.Icon />
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Logout – fixed at bottom */}
      <div className="sidebar__footer">
        <button
          type="button"
          onClick={logout}
          className="btnLogout"
        >
          <span className="navLink__icon" aria-hidden="true">
            <IconLogout />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
