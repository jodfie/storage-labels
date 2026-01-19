import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { containers } from '../lib/api';
import type { Container } from '../types';

export default function NewItem() {
  const { qrCode } = useParams<{ qrCode: string }>();
  const navigate = useNavigate();
  
  const [container, setContainer] = useState<Container | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (qrCode) {
      loadContainer();
    }
  }, [qrCode]);

  async function loadContainer() {
    try {
      const data = await containers.getByQRCode(qrCode!) as Container;
      setContainer(data);
    } catch (err) {
      setError('Container not found');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!container) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await containers.addItem(container.id, {
        name,
        description: description || undefined,
        quantity,
        photo: photo || undefined,
      });
      
      navigate(`/containers/${qrCode}`, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  }

  if (!container) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>➕ Add Item</h1>
      <p>Adding to {container.qr_code}</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">What is it? *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Winter jacket, Christmas lights, etc."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Tell me more about it</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Size, color, brand, condition..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">How many?</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo">Take a picture!</label>
          <input
            type="file"
            id="photo"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
          />
          {photo && (
            <p className="file-selected">📸 {photo.name}</p>
          )}
        </div>

        {error && (
          <div className="error">
            Uh oh! {error}
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !name}
          >
            {loading ? 'Adding item...' : '✨ Add Item'}
          </button>
          <button 
            type="button" 
            className="btn"
            onClick={() => navigate(`/containers/${qrCode}`)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
