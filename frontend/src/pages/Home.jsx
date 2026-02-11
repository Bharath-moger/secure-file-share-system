import { Link } from 'react-router-dom';

/**
 * Home/Dashboard Page
 * Overview and quick actions
 */
const Home = () => {
  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Welcome to Secure Image Share</h1>
        <p className="pageSubtitle">Share images securely with steganography and encryption.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div className="card card--padded cardHover">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Image Steganography</h2>
          <p className="pageSubtitle" style={{ marginTop: 6 }}>
            Image looks normal but contains hidden metadata for later verification.
          </p>
          <div className="btnRow" style={{ marginTop: 14 }}>
            <Link to="/steganography/upload" className="btn btn--primary" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
              Upload Image
            </Link>
            <Link to="/steganography/verify" className="btn btn--neutral" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
              Verify Image
            </Link>
          </div>
        </div>

        <div className="card card--padded cardHover">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Secure Image Encryption</h2>
          <p className="pageSubtitle" style={{ marginTop: 6 }}>
            Image content is encrypted and unreadable until the receiver unlocks it with a password.
          </p>
          <div className="btnRow" style={{ marginTop: 14 }}>
            <Link to="/secure-images/upload" className="btn btn--violet" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
              Upload Encrypted Image
            </Link>
            <Link to="/secure-images/list" className="btn btn--neutral" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
              My Encrypted Images
            </Link>
          </div>
        </div>
      </div>

      <div className="card card--padded">
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>Quick Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 12 }}>
          <Link to="/contacts" className="card card--padded cardHover" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontWeight: 900 }}>Users & Contacts</div>
            <div className="pageSubtitle" style={{ marginTop: 4 }}>View all users</div>
          </Link>
          <Link to="/sent" className="card card--padded cardHover" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontWeight: 900 }}>Sent Images</div>
            <div className="pageSubtitle" style={{ marginTop: 4 }}>View sent images</div>
          </Link>
          <Link to="/received" className="card card--padded cardHover" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontWeight: 900 }}>Received Images</div>
            <div className="pageSubtitle" style={{ marginTop: 4 }}>View received images</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
