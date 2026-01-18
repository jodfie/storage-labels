import { Link } from 'react-router-dom';
import QRScanner from '../components/QRScanner';

export default function ScanQR() {
  return (
    <div className="container">
      <h1>📸 Scan QR Code</h1>
      <p>I can find containers with my camera!</p>

      <QRScanner />

      <div className="scan-help">
        <h3>Tips for scanning:</h3>
        <ul>
          <li>Make sure there's good light!</li>
          <li>Hold the camera steady!</li>
          <li>Get the whole QR code in the box!</li>
        </ul>
      </div>

      <Link to="/" className="btn">
        ← Go Back
      </Link>
    </div>
  );
}
