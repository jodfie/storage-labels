import { useState } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../lib/api';
import { SearchResponse, SearchResult, COLOR_HEX_CODES } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      const data = await search.query(query) as SearchResponse;
      setResults(data.results);
      setSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>🔍 Search My Stuff</h1>
      <p>I can find things super good!</p>
      
      <form onSubmit={handleSearch}>
        <input 
          type="search" 
          placeholder="Type to search..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading && <p className="loading">Searching...</p>}

      {!loading && searched && results.length === 0 && (
        <p>I didn't find anything!</p>
      )}

      {!loading && results.length > 0 && (
        <div className="search-results">
          <p>Found {results.length} thing{results.length !== 1 ? 's' : ''}!</p>
          
          {results.map((result, index) => {
            const colorHex = COLOR_HEX_CODES[result.container_color as keyof typeof COLOR_HEX_CODES];
            
            return (
              <div key={index} className="search-result-card">
                <div className="result-type-badge" style={{ 
                  backgroundColor: result.type === 'container' ? '#2563eb' : '#10b981' 
                }}>
                  {result.type === 'container' ? '📦' : '📄'} {result.type}
                </div>
                
                <Link 
                  to={`/containers/${result.container_qr_code}`}
                  className="result-link"
                >
                  <div className="result-header">
                    <h3>
                      {result.type === 'item' ? result.item_name : result.container_qr_code}
                    </h3>
                    <span className="color-badge" style={{ backgroundColor: colorHex }}>
                      {result.container_color}
                    </span>
                  </div>
                  
                  {result.type === 'item' && result.item_description && (
                    <p className="result-description">{result.item_description}</p>
                  )}
                  
                  {result.type === 'container' && result.container_description && (
                    <p className="result-description">{result.container_description}</p>
                  )}
                  
                  <p className="result-location">
                    📦 {result.container_qr_code}
                    {result.container_location_text && ` • 📍 ${result.container_location_text}`}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
