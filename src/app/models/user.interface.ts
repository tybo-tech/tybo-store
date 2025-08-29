export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
  company_id?: number;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  user?: User;
  token?: string;
}

export interface PasswordUpdateRequest {
  id: number;
  current_password: string;
  new_password: string;
}
