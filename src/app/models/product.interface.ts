export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  image?: string;
  images?: string[];
  category_id?: number;
  company_id: number;
  stock_quantity?: number;
  min_stock_level?: number;
  is_active?: boolean;
  is_featured?: boolean;
  is_on_sale?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFilter {
  company_id: number;
  category_id?: number;
  featured?: boolean;
  on_sale?: boolean;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}

export interface ProductSearchParams {
  query: string;
  company_id: number;
}
