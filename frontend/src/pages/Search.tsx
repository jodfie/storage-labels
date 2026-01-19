import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../lib/api';
import type { SearchResponse, SearchResult } from '../types';
import { COLOR_HEX_CODES, VALID_COLORS } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filterColor, setFilterColor] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

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

  const filteredResults = useMemo(() => {
    let filtered = [...results];
    
    // Filter by color
    if (filterColor !== 'all') {
      filtered = filtered.filter(r => r.container_color === filterColor);
    }
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.type === filterType);
    }
    
    // Sort results
    if (sortBy === 'color') {
      filtered.sort((a, b) => a.container_color.localeCompare(b.container_color));
    } else if (sortBy === 'qr') {
      filtered.sort((a, b) => a.container_qr_code.localeCompare(b.container_qr_code));
    }
    // relevance is already sorted from API
    
    return filtered;
  }, [results, filterColor, filterType, sortBy]);

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
          <div className="search-filters">
            <div className="filter-group">
              <label htmlFor="color-filter">Color:</label>
              <select 
                id="color-filter" 
                value={filterColor} 
                onChange={(e) => setFilterColor(e.target.value)}
              >
                <option value="all">All Colors</option>
                {VALID_COLORS.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="type-filter">Type:</label>
              <select 
                id="type-filter" 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="container">Containers</option>
                <option value="item">Items</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-by">Sort by:</label>
              <select 
                id="sort-by" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="color">Color</option>
                <option value="qr">QR Code</option>
              </select>
            </div>
          </div>

          <p>Showing {filteredResults.length} of {results.length} result{results.length !== 1 ? 's' : ''}!</p>
          
          {filteredResults.map((result, index) => {
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
