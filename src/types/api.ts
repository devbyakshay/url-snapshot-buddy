
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  username: string;
  email: string;
  is_active: boolean;
  plan_type: string;
  id: number;
}

export interface URLShortenRequest {
  original_url: string;
  custom_code?: string;
  expiration_date?: string;
}

export interface URLShortenResponse {
  original_url: string;
  short_code: string;
  expiration_date?: string;
}

export interface ShortenedURLDetail {
  id: number;
  original_url: string;
  short_code: string;
  expiration_date?: string;
  created_at: string;
  clicks: number;
  scans: number;
}

export interface QRCodeDetail {
  id: number;
  shortened_url_id: number;
  short_code: string;
  created_at: string;
  scans: number;
}

export interface AnalyticsData {
  labels: string[];
  data: number[];
  total?: number;
}

export interface GeoAnalyticsData {
  country: string;
  count: number;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiError {
  detail: ValidationError[];
}
