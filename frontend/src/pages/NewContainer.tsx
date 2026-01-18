import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { containers } from '../lib/api';
import { VALID_COLORS } from '../types';

export default function NewContainer() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const newContainer = await containers.generate({
        description: description || undefined,
        location_text: locationText || undefined,
      });
      
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to create container');
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>✨ Make New Container</h1>
      <p>I'm making a new one!</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="description">What's in it?</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Winter clothes, holiday decorations, etc."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Where is it?</label>
          <input
            type="text"
            id="location"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="Attic, Garage, Basement..."
          />
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
            disabled={loading}
          >
            {loading ? 'Making container...' : '📦 Create Container'}
          </button>
          <button 
            type="button" 
            className="btn"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="info-box">
        <p>💡 A color and number will be picked for you automatically!</p>
        <p>Colors: {VALID_COLORS.join(', ')}</p>
      </div>
    </div>
  );
}
