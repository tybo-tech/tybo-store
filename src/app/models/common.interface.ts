export interface Company {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionData {
  id: number;
  collection: string;
  parent_id?: number;
  data: any;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UploadResponse {
  status: 'success' | 'error';
  message?: string;
  file_path?: string;
  file_name?: string;
}
