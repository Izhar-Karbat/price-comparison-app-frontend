// types.ts
export interface Promotion {
  id: number;
  description: string;
  type?: 'discount' | 'bogo' | 'sale' | 'clearance' | 'special';
  discount_percentage?: number;
  valid_until?: string;
}

export interface Product {
  product_id: number | string;
  masterproductid: string; // Required for cart functionality
  name: string;
  productName?: string; // Keep for backward compatibility
  brand: string;
  image?: string; // Keep for backward compatibility
  image_url: string;
  imageUrl?: string; // Keep for backward compatibility
  description: string;
  price?: number; // Keep for backward compatibility
  health_score?: number;
  healthScore?: number; // Keep for backward compatibility
  category?: string;
  ingredients?: string[];
  prices: PriceInfo[];
  promotions?: Promotion[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface PriceInfo {
  retailer_name: string;
  store_name: string;
  price: number;
  updated_at: string;
}

export interface ProductAttributes {
  product_type?: string;
  variant?: string;
  size_value?: number;
  size_unit?: string;
}

export interface ProductGroup {
  groupId: number;
  name: string;
  brand: string;
  attributes: ProductAttributes;
  prices: PriceInfo[];
}

export interface SearchApiResponse {
  results: ProductGroup[];
}