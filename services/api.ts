// services/api.ts
import { Platform } from 'react-native';

// API Configuration
// For iOS Simulator: 'http://localhost:8000'
// For Android Emulator: 'http://10.0.2.2:8000'
// For physical device on same Wi-Fi: 'http://<Your-Computer-IP>:8000'
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

// Product interface matching your backend response
export interface Product {
  product_id: string;
  name: string;
  brand?: string;
  image_url?: string;
  lowest_price?: number;
  description?: string;
  category?: string;
  manufacturer?: string;
  barcode?: string;
  promotions?: Promotion[];
}

// Deal/Promotion interface
export interface Deal {
  deal_id: number;
  retailer_name: string;
  title: string;
  description: string;
  image_url?: string;
}

// Promotion interface (for product-specific promotions)
export interface Promotion {
  deal_id: number;
  title: string;
  description: string;
  retailer_name: string;
}

// Store interface for nearby stores
export interface Store {
  store_id: string;
  name: string;
  retailer_name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance?: number;
  phone?: string;
  hours?: string;
  is_open?: boolean;
}

// Generic API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error ${response.status}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If not JSON, use the text as error message
      errorMessage = errorText || errorMessage;
    }

    console.error('[API Error]', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorMessage,
      errorText
    });

    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

// API Functions

/**
 * Text Search - Search for products by query string
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const url = `${API_BASE_URL}/api/search?q=${encodeURIComponent(query.trim())}`;
  console.log('[API Request] Searching products:', { query, url, platform: Platform.OS, baseUrl: API_BASE_URL });

  try {
    const response = await fetch(url);
    const result = await handleResponse<Product[]>(response);
    console.log('[API Success] Search results:', { query, resultCount: result.length });
    return result;
  } catch (error) {
    console.error('[API Failed] searchProducts:', {
      query,
      url,
      error: error instanceof Error ? error.message : error,
      platform: Platform.OS,
      baseUrl: API_BASE_URL
    });
    throw error;
  }
};

/**
 * Barcode Search - Get product by barcode
 */
export const getProductByBarcode = async (barcode: string): Promise<Product> => {
  if (!barcode || barcode.trim().length === 0) {
    throw new ApiError('Barcode is required');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/by-barcode/${encodeURIComponent(barcode.trim())}`
    );

    return await handleResponse<Product>(response);
  } catch (error) {
    console.error('Error in getProductByBarcode:', error);
    throw error;
  }
};

/**
 * Get Product by ID
 */
export const getProductById = async (productId: string): Promise<Product> => {
  if (!productId || productId.trim().length === 0) {
    throw new ApiError('Product ID is required');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/${encodeURIComponent(productId.trim())}`
    );

    return await handleResponse<Product>(response);
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
};

/**
 * Get Nearby Stores
 */
export const getNearbyStores = async (
  latitude: number,
  longitude: number,
  radius: number = 10000 // 10km default
): Promise<Store[]> => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new ApiError('Valid latitude and longitude are required');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/stores/nearby?lat=${latitude}&lon=${longitude}&radius=${radius}`
    );

    return await handleResponse<Store[]>(response);
  } catch (error) {
    console.error('Error in getNearbyStores:', error);
    throw error;
  }
};

/**
 * Get stores that have a specific product with prices
 */
export const getStoresWithProduct = async (
  productId: string,
  latitude: number,
  longitude: number,
  radius: number = 10000
): Promise<Store[]> => {
  if (!productId || productId.trim().length === 0) {
    throw new ApiError('Product ID is required');
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new ApiError('Valid latitude and longitude are required');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/${encodeURIComponent(productId.trim())}/stores?lat=${latitude}&lon=${longitude}&radius=${radius}`
    );

    return await handleResponse<Store[]>(response);
  } catch (error) {
    console.error('Error in getStoresWithProduct:', error);
    throw error;
  }
};

/**
 * Get All Active Deals
 */
export const fetchDeals = async (limit?: number, retailerId?: number): Promise<Deal[]> => {
  try {
    let url = `${API_BASE_URL}/api/deals`;
    const params = new URLSearchParams();

    if (limit) {
      params.append('limit', limit.toString());
    }
    if (retailerId) {
      params.append('retailer_id', retailerId.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('[API Request] Fetching deals:', { url });

    const response = await fetch(url);
    const result = await handleResponse<Deal[]>(response);

    console.log('[API Success] Deals fetched:', { count: result.length });
    return result;
  } catch (error) {
    console.error('[API Failed] fetchDeals:', error);
    throw error;
  }
};

// Utility functions
export const getApiBaseUrl = (): string => API_BASE_URL;

// Test connectivity function - call this to verify backend connection
export const testConnectivity = async (): Promise<boolean> => {
  try {
    console.log('[Connectivity Test] Testing API Base URL:', API_BASE_URL);
    console.log('[Connectivity Test] Platform:', Platform.OS);

    const response = await fetch(`${API_BASE_URL}/health`);
    const result = await response.json();

    console.log('[Connectivity Test] Health check result:', {
      status: response.status,
      ok: response.ok,
      result
    });

    return response.ok;
  } catch (error) {
    console.error('[Connectivity Test] Failed:', {
      error: error instanceof Error ? error.message : error,
      baseUrl: API_BASE_URL,
      platform: Platform.OS
    });
    return false;
  }
};

export const isApiAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};