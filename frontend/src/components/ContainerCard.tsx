import type { Container } from '../types';
import { COLOR_HEX_CODES } from '../types';

interface Props {
  container: Container;
  onClick?: () => void;
}

export default function ContainerCard({ container, onClick }: Props) {
  const colorHex = COLOR_HEX_CODES[container.color as keyof typeof COLOR_HEX_CODES] || '#6B7280';
  
  return (
    <div 
      className="container-card" 
      onClick={onClick}
      style={{ borderLeftColor: colorHex }}
    >
      <div className="container-header">
        <h3>{container.qr_code}</h3>
        <span 
          className="color-badge" 
          style={{ backgroundColor: colorHex }}
        >
          {container.color}
        </span>
      </div>
      {container.description && (
        <p className="container-description">{container.description}</p>
      )}
      {container.location_text && (
        <p className="container-location">📍 {container.location_text}</p>
      )}
      <p className="container-date">
        Added {new Date(container.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
