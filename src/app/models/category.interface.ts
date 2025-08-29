export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  company_id: number;
  parent_id?: number;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFilter {
  company_id: number;
  parent_id?: number;
  is_active?: boolean;
}
