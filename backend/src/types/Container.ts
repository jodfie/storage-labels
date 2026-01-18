export interface Container {
  id: string;
  qr_code: string;
  color: string;
  number: number;
  location_id?: string;
  location_text?: string;
  description?: string;
  photo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContainerRequest {
  color?: string;
  number?: number;
  location_id?: string;
  location_text?: string;
  description?: string;
}

export interface UpdateContainerRequest {
  location_id?: string;
  location_text?: string;
  description?: string;
  photo_url?: string;
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
