// services/storeService.ts
import { getNearbyStores, getStoresWithProduct, ApiError, Store as ApiStore } from './api';
import { LocationData } from '../hooks/useLocation';

export interface Store {
  id: string;
  name: string;
  retailerName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance?: number;
  phone?: string;
  hours?: string;
  isOpen?: boolean;
}

export interface StoreWithPrice extends Store {
  price?: number;
  hasProduct?: boolean;
}

export interface NearbyStoresResponse {
  stores: Store[];
  total: number;
}

export interface ProductPricesAtStoresResponse {
  stores: StoreWithPrice[];
  total: number;
}

class StoreService {
  /**
   * Find nearby stores based on user location
   */
  async findNearbyStores(
    location: LocationData,
    radius: number = 10000, // 10km default
    limit: number = 20
  ): Promise<Store[]> {
    try {
      // Use the new API service
      const apiStores = await getNearbyStores(location.latitude, location.longitude, radius);

      // Transform API response to our Store interface
      const transformedStores = apiStores.map((apiStore: ApiStore) => ({
        id: apiStore.store_id,
        name: apiStore.name,
        retailerName: apiStore.retailer_name,
        address: apiStore.address,
        city: apiStore.city,
        latitude: apiStore.latitude,
        longitude: apiStore.longitude,
        distance: apiStore.distance,
        phone: apiStore.phone,
        hours: apiStore.hours,
        isOpen: apiStore.is_open,
      }));

      return transformedStores;
    } catch (error) {
      console.error('Error fetching nearby stores:', error);
      // Return mock data for development
      return this.getMockNearbyStores(location);
    }
  }

  /**
   * Find stores that carry a specific product, sorted by distance
   */
  async findStoresWithProduct(
    productId: string,
    location: LocationData,
    radius: number = 10000
  ): Promise<StoreWithPrice[]> {
    try {
      // Use the new API service
      const apiStores = await getStoresWithProduct(productId, location.latitude, location.longitude, radius);

      // Transform API response to our StoreWithPrice interface
      const transformedStores = apiStores.map((apiStore: ApiStore) => ({
        id: apiStore.store_id,
        name: apiStore.name,
        retailerName: apiStore.retailer_name,
        address: apiStore.address,
        city: apiStore.city,
        latitude: apiStore.latitude,
        longitude: apiStore.longitude,
        distance: apiStore.distance,
        phone: apiStore.phone,
        hours: apiStore.hours,
        isOpen: apiStore.is_open,
        price: undefined, // The API might not include price info in this endpoint
        hasProduct: true, // Since these stores were returned for this product
      }));

      return transformedStores;
    } catch (error) {
      console.error('Error fetching stores with product:', error);
      // Return mock data for development
      return this.getMockStoresWithProduct(location);
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  /**
   * Normalize different API response formats to our Store interface
   */
  private normalizeStoreData(data: any): Store[] {
    if (data.stores && Array.isArray(data.stores)) {
      return data.stores;
    }

    if (data.results && Array.isArray(data.results)) {
      return data.results.map((item: any) => ({
        id: item.store_id || item.id || Math.random().toString(),
        name: item.store_name || item.name || 'Pharmacy',
        retailerName: item.retailer_name || item.retailer || 'Pharmacy',
        address: item.address || 'Address not available',
        city: item.city || 'City not available',
        latitude: item.latitude || item.lat || 0,
        longitude: item.longitude || item.lon || 0,
        distance: item.distance,
        phone: item.phone,
        hours: item.hours,
        isOpen: item.is_open,
      }));
    }

    return [];
  }

  /**
   * Normalize product store data with prices
   */
  private normalizeProductStoreData(data: any): StoreWithPrice[] {
    if (data.prices && Array.isArray(data.prices)) {
      return data.prices.map((item: any) => ({
        id: item.store_id || Math.random().toString(),
        name: item.storename || item.store_name || 'Pharmacy',
        retailerName: item.retailername || item.retailer_name || 'Pharmacy',
        address: item.address || 'Address not available',
        city: item.city || 'City not available',
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        price: item.price,
        hasProduct: true,
        phone: item.phone,
        hours: item.hours,
        isOpen: item.is_open,
      }));
    }

    return [];
  }

  /**
   * Mock data for development when API is not available
   */
  private getMockNearbyStores(location: LocationData): Store[] {
    const mockStores: Store[] = [
      {
        id: '1',
        name: 'Super-Pharm Center',
        retailerName: 'Super-Pharm',
        address: 'Dizengoff St 123',
        city: 'Tel Aviv',
        latitude: location.latitude + 0.005,
        longitude: location.longitude + 0.005,
        phone: '03-1234567',
        hours: '24/7',
        isOpen: true,
      },
      {
        id: '2',
        name: 'Pharmacy Plus',
        retailerName: 'Pharmacy Plus',
        address: 'Ben Yehuda St 45',
        city: 'Tel Aviv',
        latitude: location.latitude - 0.003,
        longitude: location.longitude + 0.002,
        phone: '03-7654321',
        hours: '08:00-22:00',
        isOpen: true,
      },
      {
        id: '3',
        name: 'Health Corner',
        retailerName: 'Independent',
        address: 'Rothschild Blvd 78',
        city: 'Tel Aviv',
        latitude: location.latitude + 0.002,
        longitude: location.longitude - 0.004,
        phone: '03-9876543',
        hours: '09:00-20:00',
        isOpen: false,
      },
    ];

    // Calculate distances
    return mockStores.map(store => ({
      ...store,
      distance: this.calculateDistance(
        location.latitude,
        location.longitude,
        store.latitude,
        store.longitude
      ),
    }));
  }

  /**
   * Mock product store data for development
   */
  private getMockStoresWithProduct(location: LocationData): StoreWithPrice[] {
    const mockStores: StoreWithPrice[] = [
      {
        id: '1',
        name: 'Super-Pharm Center',
        retailerName: 'Super-Pharm',
        address: 'Dizengoff St 123',
        city: 'Tel Aviv',
        latitude: location.latitude + 0.005,
        longitude: location.longitude + 0.005,
        price: 29.90,
        hasProduct: true,
        phone: '03-1234567',
        isOpen: true,
      },
      {
        id: '2',
        name: 'Pharmacy Plus',
        retailerName: 'Pharmacy Plus',
        address: 'Ben Yehuda St 45',
        city: 'Tel Aviv',
        latitude: location.latitude - 0.003,
        longitude: location.longitude + 0.002,
        price: 32.50,
        hasProduct: true,
        phone: '03-7654321',
        isOpen: true,
      },
    ];

    // Calculate distances
    return mockStores.map(store => ({
      ...store,
      distance: this.calculateDistance(
        location.latitude,
        location.longitude,
        store.latitude,
        store.longitude
      ),
    }));
  }
}

export const storeService = new StoreService();