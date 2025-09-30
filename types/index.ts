// src/types/index.ts

export interface StorePrice {
  storeId: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  isLowestPrice?: boolean;
}

export interface Product {
  masterproductid: string;
  productName: string;
  brand: string;
  imageUrl: string;
  category?: string;
  subcategory?: string;
  storePrices: StorePrice[];
  // Computed properties for convenience
  lowestPrice?: number;
  highestPrice?: number;
  averagePrice?: number;
}