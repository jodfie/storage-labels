export interface SearchResult {
  type: 'container' | 'item';
  relevance: number;
  
  // Container fields (always present)
  container_id: string;
  container_qr_code: string;
  container_color: string;
  container_number: number;
  container_description?: string;
  container_location_text?: string;
  
  // Item fields (only for type: 'item')
  item_id?: string;
  item_name?: string;
  item_description?: string;
  item_quantity?: number;
  item_photo_url?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  execution_time_ms: number;
}
