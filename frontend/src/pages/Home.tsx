import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { containers } from '../lib/api';
import type { Container } from '../types';
import ContainerCard from '../components/ContainerCard';
import { haptics } from '../utils/haptics';

export default function Home() {
  const [containerList, setContainerList] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pullStartY, setPullStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    loadContainers();
  }, []);

  // Pull-to-refresh handlers
  function handleTouchStart(e: React.TouchEvent) {
    if (window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (pullStartY > 0) {
      const pullDistance = e.touches[0].clientY - pullStartY;
      if (pullDistance > 80 && !loading) {
        setIsPulling(true);
        haptics.light();
      }
    }
  }

  function handleTouchEnd() {
    if (isPulling && !loading) {
      setIsPulling(false);
      setPullStartY(0);
      loadContainers();
      haptics.success();
    } else {
      setPullStartY(0);
      setIsPulling(false);
    }
  }

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
    <div 
      className="container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {isPulling && (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#2563eb' }}>
          🔄 Release to refresh!
        </div>
      )}
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
