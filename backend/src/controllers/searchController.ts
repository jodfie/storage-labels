import { Request, Response } from 'express';
import pool from '../config/database';
import { SearchResult, SearchResponse } from '../types/Search';

/**
 * Full-text search across containers and items
 * GET /api/search?q={query}
 */
export async function search(req: Request, res: Response) {
  try {
    const startTime = Date.now();
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query parameter required',
        message: 'Please provide a search query using ?q=your-search-term',
      });
    }

    const searchTerm = query.trim();

    // Sanitize the search term for ts_query
    // Replace special characters and prepare for PostgreSQL full-text search
    const tsQueryTerm = searchTerm
      .replace(/[^\w\s]/g, ' ')  // Remove special chars
      .trim()
      .split(/\s+/)               // Split on whitespace
      .filter(word => word.length > 0)
      .join(' & ');               // Join with AND operator

    if (tsQueryTerm.length === 0) {
      return res.json({
        query: searchTerm,
        results: [],
        total: 0,
        execution_time_ms: Date.now() - startTime,
      });
    }

    // Search containers and items in parallel
    const [containerResults, itemResults] = await Promise.all([
      searchContainers(tsQueryTerm),
      searchItems(tsQueryTerm),
    ]);

    // Combine and sort by relevance
    const allResults: SearchResult[] = [
      ...containerResults,
      ...itemResults,
    ].sort((a, b) => b.relevance - a.relevance);

    const response: SearchResponse = {
      query: searchTerm,
      results: allResults,
      total: allResults.length,
      execution_time_ms: Date.now() - startTime,
    };

    res.json(response);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

/**
 * Search containers by description using full-text search
 */
async function searchContainers(tsQueryTerm: string): Promise<SearchResult[]> {
  const result = await pool.query(
    `SELECT 
       c.id as container_id,
       c.qr_code as container_qr_code,
       c.color as container_color,
       c.number as container_number,
       c.description as container_description,
       c.location_text as container_location_text,
       ts_rank(
         to_tsvector('english', COALESCE(c.description, '')),
         plainto_tsquery('english', $1)
       ) as relevance
     FROM containers c
     WHERE to_tsvector('english', COALESCE(c.description, '')) @@ plainto_tsquery('english', $1)
     ORDER BY relevance DESC
     LIMIT 50`,
    [tsQueryTerm]
  );

  return result.rows.map((row: any) => ({
    type: 'container' as const,
    relevance: parseFloat(row.relevance),
    container_id: row.container_id,
    container_qr_code: row.container_qr_code,
    container_color: row.container_color,
    container_number: row.container_number,
    container_description: row.container_description,
    container_location_text: row.container_location_text,
  }));
}

/**
 * Search items by name and description using full-text search
 */
async function searchItems(tsQueryTerm: string): Promise<SearchResult[]> {
  const result = await pool.query(
    `SELECT 
       i.id as item_id,
       i.name as item_name,
       i.description as item_description,
       i.quantity as item_quantity,
       i.photo_url as item_photo_url,
       c.id as container_id,
       c.qr_code as container_qr_code,
       c.color as container_color,
       c.number as container_number,
       c.description as container_description,
       c.location_text as container_location_text,
       ts_rank(
         to_tsvector('english', COALESCE(i.name || ' ' || i.description, '')),
         plainto_tsquery('english', $1)
       ) as relevance
     FROM items i
     INNER JOIN containers c ON i.container_id = c.id
     WHERE to_tsvector('english', COALESCE(i.name || ' ' || i.description, '')) @@ plainto_tsquery('english', $1)
     ORDER BY relevance DESC
     LIMIT 50`,
    [tsQueryTerm]
  );

  return result.rows.map((row: any) => ({
    type: 'item' as const,
    relevance: parseFloat(row.relevance),
    container_id: row.container_id,
    container_qr_code: row.container_qr_code,
    container_color: row.container_color,
    container_number: row.container_number,
    container_description: row.container_description,
    container_location_text: row.container_location_text,
    item_id: row.item_id,
    item_name: row.item_name,
    item_description: row.item_description,
    item_quantity: row.item_quantity,
    item_photo_url: row.item_photo_url,
  }));
}
