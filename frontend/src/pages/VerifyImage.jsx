import { useState } from 'react';
import { verifyImage } from '../api/images';

/**
 * Verify Image Page
 * Verifies steganography metadata in downloaded images
 */
const VerifyImage = () => {
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
    <div className="page-container">
      <h1>Verify Image</h1>
      <div className="verify-card">
        <div className="verify-info">
          <p>
            <strong>Important:</strong> Use the downloaded image file directly.
            Opening or editing the image will break the steganography verification.
            Renaming the file is safe.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="verify-file">Select Downloaded Image</label>
            <input
              type="file"
              id="verify-file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {selectedFile && (
              <p className="file-info">Selected: {selectedFile.name}</p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading || !selectedFile} className="btn-primary">
            {loading ? 'Verifying...' : 'Verify Image'}
          </button>
        </form>

        {verificationResult && (
          <div className="verification-result">
            <h2>Verification Result</h2>
            {verificationResult.valid ? (
              <div className="verification-success">
                <p className="valid-badge">✓ Valid Image</p>
                <div className="verification-details">
                  <h3>Image Details</h3>
                  <p><strong>ID:</strong> {verificationResult.image.id}</p>
                  <p><strong>Filename:</strong> {verificationResult.image.original_filename}</p>
                  <p><strong>Status:</strong> {verificationResult.image.status}</p>
                  <p><strong>Created At:</strong> {formatDate(verificationResult.image.created_at)}</p>
                  
                  <h3>Sender</h3>
                  <p><strong>Username:</strong> {verificationResult.sender.username}</p>
                  <p><strong>ID:</strong> {verificationResult.sender.id}</p>
                  
                  <h3>Receiver</h3>
                  <p><strong>Username:</strong> {verificationResult.receiver.username}</p>
                  <p><strong>ID:</strong> {verificationResult.receiver.id}</p>
                </div>
              </div>
            ) : (
              <div className="verification-error">
                <p>Invalid or tampered image</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyImage;

