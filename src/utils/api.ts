
import { User, URLShortenRequest, URLShortenResponse, ShortenedURLDetail, QRCodeDetail, AnalyticsData, GeoAnalyticsData } from '../types/api';

const API_BASE_URL = '';

// Helper function to include auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// URL shortening functions
export const shortenUrl = async (urlData: URLShortenRequest): Promise<URLShortenResponse> => {
  const token = localStorage.getItem('token');
  const endpoint = token ? '/shorten/shrink' : '/shorten/short';
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(urlData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to shorten URL');
  }
  
  return response.json();
};

// User URLs
export const getUserUrls = async (skip = 0, limit = 10, search?: string): Promise<ShortenedURLDetail[]> => {
  let url = `${API_BASE_URL}/users/me/urls?skip=${skip}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch URLs');
  }
  
  return response.json();
};

// User QR codes
export const getUserQrCodes = async (skip = 0, limit = 10, search?: string): Promise<QRCodeDetail[]> => {
  let url = `${API_BASE_URL}/users/me/qrcodes?skip=${skip}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch QR codes');
  }
  
  return response.json();
};

// Create QR code
export const createQrCode = async (originalUrl: string, customCode?: string): Promise<any> => {
  let url = `${API_BASE_URL}/qr/create-qr/?original_url=${encodeURIComponent(originalUrl)}`;
  if (customCode) {
    url += `&custom_code=${encodeURIComponent(customCode)}`;
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create QR code');
  }
  
  return response.json();
};

// Upgrade QR code
export const upgradeQrCode = async (shortCode: string): Promise<any> => {
  const url = `${API_BASE_URL}/qr/upgrade-qr/?short_code=${encodeURIComponent(shortCode)}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to upgrade QR code');
  }
  
  return response.json();
};

// Analytics functions
export const getDailyAnalytics = async (shortCode: string): Promise<AnalyticsData> => {
  const response = await fetch(`${API_BASE_URL}/analytics/analytics/${shortCode}/daily`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch daily analytics');
  }
  
  return response.json();
};

export const getMonthlyAnalytics = async (shortCode: string): Promise<AnalyticsData> => {
  const response = await fetch(`${API_BASE_URL}/analytics/analytics/${shortCode}/monthly`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch monthly analytics');
  }
  
  return response.json();
};

export const getTotalAnalytics = async (shortCode: string): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/analytics/analytics/${shortCode}/total`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch total analytics');
  }
  
  return response.json();
};

export const getGeoAnalytics = async (shortCode: string): Promise<GeoAnalyticsData[]> => {
  const response = await fetch(`${API_BASE_URL}/analytics/analytics/${shortCode}/geo`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch geo analytics');
  }
  
  return response.json();
};

// Get QR code image
export const getQrCodeImage = (shortCode: string): string => {
  return `${API_BASE_URL}/qr/${shortCode}`;
};
