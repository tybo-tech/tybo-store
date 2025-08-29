export interface Category {
  id: number;
  company_id: number;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
  featured?: number;
  slug?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryFilter {
  company_id: number;
  parent_id?: number;
  is_active?: boolean;
}
