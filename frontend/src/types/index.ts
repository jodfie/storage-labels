// Type definitions matching backend API

export interface Container {
  id: string;
  qr_code: string;
  color: string;
  number: number;
  location_id?: string;
  location_name?: string;
  location_text?: string;
  description?: string;
  photo_url?: string;
  qr_code_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  container_id: string;
  name: string;
  description?: string;
  quantity: number;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  type: 'container' | 'item';
  relevance: number;
  container_id: string;
  container_qr_code: string;
  container_color: string;
  container_number: number;
  container_description?: string;
  container_location_text?: string;
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

export const VALID_COLORS = [
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Turquoise',
] as const;

export type ContainerColor = typeof VALID_COLORS[number];

export const COLOR_HEX_CODES: Record<ContainerColor, string> = {
  Red: '#EF4444',
  Blue: '#3B82F6',
  Green: '#10B981',
  Yellow: '#F59E0B',
  Orange: '#F97316',
  Purple: '#A855F7',
  Pink: '#EC4899',
  Turquoise: '#14B8A6',
};
