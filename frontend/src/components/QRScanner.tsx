import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

export default function QRScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    // Create scanner when component mounts
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;
    setScanning(true);

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error('Failed to clear scanner:', error);
        });
      }
    };
  }, []);

  function onScanSuccess(decodedText: string) {
    console.log('QR Code detected:', decodedText);
    
    // Stop scanning
    if (scannerRef.current) {
      scannerRef.current.clear();
      setScanning(false);
    }

    // Navigate to container
    navigate(`/containers/${decodedText}`);
  }

  function onScanFailure(error: any) {
    // This happens a lot when scanning, so we don't log it
    // console.warn(`QR scan error:`, error);
  }

  return (
    <div className="qr-scanner-container">
      <div id="qr-reader"></div>
      {scanning && (
        <div className="scanner-instructions">
          <p>📱 Point your camera at a QR code!</p>
          <p>Make sure it's in the box!</p>
        </div>
      )}
    </div>
  );
}
