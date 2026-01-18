import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { containers } from '../lib/api';
import { Container } from '../types';
import ContainerCard from '../components/ContainerCard';

export default function Home() {
  const [containerList, setContainerList] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContainers();
  }, []);

  async function loadContainers() {
    try {
      setLoading(true);
      const data = await containers.getAll();
      setContainerList(data as Container[]);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load containers');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>📦 My Containers</h1>
      <p>I'm keeping track of all my stuff!</p>
      
      <div className="actions">
        <Link to="/containers/new" className="btn btn-primary">
          + New Container
        </Link>
        <Link to="/search" className="btn">
          🔍 Search
        </Link>
      </div>

      {loading && <p className="loading">Loading containers...</p>}
      
      {error && (
        <div className="error">
          Uh oh! {error}
        </div>
      )}

      {!loading && !error && containerList.length === 0 && (
        <p>No containers yet! Make one!</p>
      )}

      {!loading && containerList.length > 0 && (
        <div className="container-grid">
          {containerList.map((c) => (
            <Link 
              key={c.id} 
              to={`/containers/${c.qr_code}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ContainerCard container={c} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
