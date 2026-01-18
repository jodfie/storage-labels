import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { containers } from '../lib/api';
import { Container, Item, COLOR_HEX_CODES } from '../types';

export default function ContainerDetail() {
  const { qrCode } = useParams<{ qrCode: string }>();
  const [container, setContainer] = useState<Container | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (qrCode) {
      loadContainer();
    }
  }, [qrCode]);

  async function loadContainer() {
    try {
      setLoading(true);
      const containerData = await containers.getByQRCode(qrCode!) as Container;
      setContainer(containerData);
      
      const itemsData = await containers.getItems(containerData.id) as Item[];
      setItems(itemsData);
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load container');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading container...</div>;
  }

  if (error || !container) {
    return (
      <div className="container">
        <div className="error">Uh oh! {error || 'Container not found'}</div>
        <Link to="/" className="btn">Go Home</Link>
      </div>
    );
  }

  const colorHex = COLOR_HEX_CODES[container.color as keyof typeof COLOR_HEX_CODES] || '#6B7280';

  return (
    <div className="container">
      <div className="container-detail-header" style={{ borderColor: colorHex }}>
        <h1>{container.qr_code}</h1>
        <span className="color-badge" style={{ backgroundColor: colorHex }}>
          {container.color}
        </span>
      </div>

      {container.description && (
        <p className="container-description">{container.description}</p>
      )}

      {container.location_text && (
        <p className="container-location">📍 {container.location_text}</p>
      )}

      {container.qr_code_image && (
        <div className="qr-code-section">
          <h3>QR Code</h3>
          <img 
            src={container.qr_code_image} 
            alt={`QR Code for ${container.qr_code}`}
            className="qr-code-image"
          />
        </div>
      )}

      <div className="items-section">
        <div className="section-header">
          <h2>Items ({items.length})</h2>
          <Link to={`/containers/${container.qr_code}/items/new`} className="btn btn-primary">
            + Add Item
          </Link>
        </div>

        {items.length === 0 && (
          <p>No items yet! Add some stuff!</p>
        )}

        {items.length > 0 && (
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="item-card">
                {item.photo_url && (
                  <img 
                    src={`http://localhost:3001${item.photo_url}`} 
                    alt={item.name}
                    className="item-photo"
                  />
                )}
                <div className="item-info">
                  <h3>{item.name}</h3>
                  {item.description && <p>{item.description}</p>}
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link to="/" className="btn">← Back to Containers</Link>
    </div>
  );
}
