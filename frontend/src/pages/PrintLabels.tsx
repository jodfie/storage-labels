import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { containers } from '../lib/api';
import { Container, COLOR_HEX_CODES } from '../types';

export default function PrintLabels() {
  const [searchParams] = useSearchParams();
  const [containerList, setContainerList] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContainers();
  }, []);

  async function loadContainers() {
    try {
      setLoading(true);
      const ids = searchParams.get('ids')?.split(',') || [];
      
      if (ids.length === 0) {
        // Load all containers
        const data = await containers.getAll() as Container[];
        setContainerList(data);
      } else {
        // Load specific containers (would need API endpoint for this)
        const data = await containers.getAll() as Container[];
        setContainerList(data.filter(c => ids.includes(c.id)));
      }
    } catch (err) {
      console.error('Failed to load containers:', err);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return <div className="loading">Getting labels ready...</div>;
  }

  return (
    <div className="print-page">
      <div className="print-controls no-print">
        <h1>🖨️ Print Labels</h1>
        <p>Ready to print {containerList.length} label{containerList.length !== 1 ? 's' : ''}!</p>
        <p>Use Avery 5160 labels (30 labels per sheet)</p>
        <button onClick={handlePrint} className="btn btn-primary">
          Print Labels
        </button>
      </div>

      <div className="avery-5160">
        {containerList.map((container) => {
          const colorHex = COLOR_HEX_CODES[container.color as keyof typeof COLOR_HEX_CODES];
          
          return (
            <div 
              key={container.id} 
              className="label" 
              style={{ borderColor: colorHex }}
            >
              <div className="label-qr">
                {container.qr_code_image && (
                  <img src={container.qr_code_image} alt={container.qr_code} />
                )}
              </div>
              <div className="label-info">
                <div className="label-code" style={{ color: colorHex }}>
                  {container.qr_code}
                </div>
                {container.description && (
                  <div className="label-desc">{container.description.substring(0, 40)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
