export interface OrderItem {
  id?: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price?: number;
  variation_details?: any;
}

export interface Order {
  id: number;
  customer_id?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  billing_address?: string;
  items: OrderItem[];
  subtotal: number;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderCreateRequest {
  customer_id?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  billing_address?: string;
  items: OrderItem[];
  notes?: string;
}
