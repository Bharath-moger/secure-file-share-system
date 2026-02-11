import { useState } from 'react';
import { verifyImage } from '../../api/images';

/**
 * Verify Steganography Image Page
 * Verifies hidden metadata in downloaded images
 */
const VerifySteganography = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
      setVerificationResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const result = await verifyImage(selectedFile);
      setVerificationResult(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <div className="pageHeader">
        <h1 className="pageTitle">Verify Image (Steganography)</h1>
        <p className="pageSubtitle">Extract hidden metadata from an image</p>
      </div>

      {/* Warning Box */}
      <div className="alert alert--warning" style={{ marginBottom: 14 }}>
        <strong>Important:</strong> Use the downloaded image file directly. Opening or editing the image
        can break steganography verification. Renaming the file is safe.
      </div>

      <div className="card card--padded" style={{ marginBottom: 14 }}>
        <form onSubmit={handleSubmit} className="formGrid">
          <div className="field">
            <label htmlFor="verify-file">Select Downloaded Image</label>
            <input
              type="file"
              id="verify-file"
              accept="image/*"
              onChange={handleFileChange}
              className="input"
              required
            />
            {selectedFile && (
              <p className="pageSubtitle" style={{ marginTop: 8 }}>Selected: {selectedFile.name}</p>
            )}
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <button type="submit" disabled={loading || !selectedFile} className="btn btn--primary">
            {loading ? 'Verifying...' : 'Verify Image'}
          </button>
        </form>
      </div>

      {verificationResult && (
        <div className="card card--padded">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Verification Result</h2>
          {verificationResult.valid ? (
            <div style={{ marginTop: 12 }}>
              <span className="badge badge--ok">✓ Valid</span>

              <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                <div className="card card--padded" style={{ background: '#f8fafc' }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Image Details</div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div><strong>ID:</strong> {verificationResult.image.id}</div>
                    <div><strong>Filename:</strong> {verificationResult.image.original_filename}</div>
                    <div>
                      <strong>Status:</strong>{' '}
                      <span className={verificationResult.image.status === 'DOWNLOADED' ? 'badge badge--ok' : 'badge badge--pending'}>
                        {verificationResult.image.status}
                      </span>
                    </div>
                    <div><strong>Created At:</strong> {formatDate(verificationResult.image.created_at)}</div>
                  </div>
                </div>

                <div className="card card--padded" style={{ background: '#f8fafc' }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Sender</div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div><strong>Username:</strong> {verificationResult.sender.username}</div>
                    <div><strong>ID:</strong> {verificationResult.sender.id}</div>
                  </div>
                </div>

                <div className="card card--padded" style={{ background: '#f8fafc' }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Receiver</div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <div><strong>Username:</strong> {verificationResult.receiver.username}</div>
                    <div><strong>ID:</strong> {verificationResult.receiver.id}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert--error" style={{ marginTop: 12 }}>Invalid or tampered image</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifySteganography;
