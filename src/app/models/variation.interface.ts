export interface Variation {
  id: number;
  name: string;
  type: 'color' | 'size' | 'material' | 'style' | 'other';
  company_id: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VariationOption {
  id: number;
  variation_id: number;
  name: string;
  value: string;
  color_code?: string;
  image?: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ItemVariation {
  id: number;
  product_id: number;
  variation_option_id: number;
  price_adjustment?: number;
  stock_quantity?: number;
  sku?: string;
  is_active?: boolean;
}
