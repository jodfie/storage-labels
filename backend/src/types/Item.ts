export interface Item {
  id: string;
  container_id: string;
  name: string;
  description?: string;
  quantity: number;
  photo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  quantity?: number;
  photo?: Express.Multer.File;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  quantity?: number;
  photo?: Express.Multer.File;
}
