
import { User, URLShortenRequest, URLShortenResponse, ShortenedURLDetail, QRCodeDetail, AnalyticsData, GeoAnalyticsData } from '../types/api';

const API_BASE_URL = 'http://localhost:8000';

// Helper function to include auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Generic fetch function with error handling
const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `HTTP error! Status: ${response.status}`
      }));
      throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
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
  
  return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(urlData),
    mode: 'cors',
    credentials: 'include'
  });
};

// User URLs
export const getUserUrls = async (skip = 0, limit = 10, search?: string): Promise<ShortenedURLDetail[]> => {
  let url = `${API_BASE_URL}/users/me/urls?skip=${skip}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  return fetchWithErrorHandling(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

// User QR codes
export const getUserQrCodes = async (skip = 0, limit = 10, search?: string): Promise<QRCodeDetail[]> => {
  let url = `${API_BASE_URL}/users/me/qrcodes?skip=${skip}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  return fetchWithErrorHandling(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

// Create QR code
export const createQrCode = async (originalUrl: string, customCode?: string): Promise<any> => {
  let url = `${API_BASE_URL}/qr/create-qr/?original_url=${encodeURIComponent(originalUrl)}`;
  if (customCode) {
    url += `&custom_code=${encodeURIComponent(customCode)}`;
  }
  
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

// Upgrade QR code
export const upgradeQrCode = async (shortCode: string): Promise<any> => {
  const url = `${API_BASE_URL}/qr/upgrade-qr/?short_code=${encodeURIComponent(shortCode)}`;
  
  return fetchWithErrorHandling(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

// Analytics functions
export const getDailyAnalytics = async (shortCode: string): Promise<AnalyticsData> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/analytics/analytics/${shortCode}/daily`, {
    method: 'GET',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

export const getMonthlyAnalytics = async (shortCode: string): Promise<AnalyticsData> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/analytics/analytics/${shortCode}/monthly`, {
    method: 'GET',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

export const getTotalAnalytics = async (shortCode: string): Promise<number> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/analytics/analytics/${shortCode}/total`, {
    method: 'GET',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

export const getGeoAnalytics = async (shortCode: string): Promise<GeoAnalyticsData[]> => {
  return fetchWithErrorHandling(`${API_BASE_URL}/analytics/analytics/${shortCode}/geo`, {
    method: 'GET',
    headers: getAuthHeaders(),
    mode: 'cors',
    credentials: 'include'
  });
};

// Get QR code image
export const getQrCodeImage = (shortCode: string): string => {
  return `${API_BASE_URL}/qr/${shortCode}`;
};
