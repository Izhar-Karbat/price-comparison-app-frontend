import { useState, useCallback } from 'react';
import type { Product } from '../types';
import { searchProducts, ApiError } from '../services/api';

interface UseProductSearchParams {
  category?: string;
  searchType?: 'master' | 'nearby';
  latitude?: number;
  longitude?: number;
  itemsPerPage?: number;
}

interface UseProductSearchResult {
  data: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  isLoadingMore: boolean;
  allDataLoaded: boolean;
  search: (query: string) => void;
  loadMore: () => void;
  reset: () => void;
}

export const useProductSearch = ({
  category = 'pharma',
  searchType = 'master',
  latitude,
  longitude,
  itemsPerPage = 20,
}: UseProductSearchParams = {}): UseProductSearchResult => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const fetchSearchResults = useCallback(async (query: string, page: number = 1) => {
    if (!query || query.length < 2) {
      setData([]);
      setError(query ? 'Search query must be at least 2 characters.' : null);
      setIsLoading(false);
      setIsLoadingMore(false);
      setAllDataLoaded(true);
      return;
    }

    if (page === 1) {
      setIsLoading(true);
      setData([]);
      setAllDataLoaded(false);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      console.log(`[useProductSearch] Searching for: "${query}"`);

      // Use the new API service
      const apiResults = await searchProducts(query);
      console.log('[useProductSearch] API Response:', apiResults);

      if (apiResults && Array.isArray(apiResults)) {
        // Transform the new API response to match our Product interface
        const transformedProducts = apiResults.map((item: any) => ({
          product_id: parseInt(item.product_id) || 0,
          masterproductid: item.product_id,
          name: item.name || 'N/A',
          productname: item.name || 'N/A',
          brand: item.brand || '',
          image_url: (item.image_url && item.image_url.startsWith('http'))
            ? item.image_url
            : 'https://via.placeholder.com/120x120.png?text=No+Image',
          imageurl: (item.image_url && item.image_url.startsWith('http'))
            ? item.image_url
            : 'https://via.placeholder.com/120x120.png?text=No+Image',
          description: item.description || '',
          price: item.lowest_price ? parseFloat(item.lowest_price.toString()) : undefined,
          health_score: undefined,
          category: item.category || '',
          ingredients: undefined,
          prices: item.lowest_price ? [{
            retailer_name: 'Best Price',
            store_name: 'Available Store',
            price: parseFloat(item.lowest_price.toString()),
            updated_at: new Date().toISOString()
          }] : [],
          promotions: undefined,
          producturl: item.producturl || '',
          storename: item.storename || '',
          unitofmeasure: item.unitofmeasure || '',
          quantity: item.quantity || 1,
          manufacturer: item.manufacturer || '',
          barcode: item.barcode || '',
        }));

        if (transformedProducts.length > 0) {
          // For simplicity, we'll show all results at once instead of pagination
          // You can implement pagination later if needed
          setData(transformedProducts);
          setAllDataLoaded(true);
        } else {
          setData([]);
          setAllDataLoaded(true);
          setError(`No products found for "${query}".`);
        }
      } else {
        console.error('[useProductSearch] Invalid data structure:', apiResults);
        setData([]);
        setError('Received invalid data structure from server.');
        setAllDataLoaded(true);
      }
      setCurrentPage(page);
    } catch (e) {
      console.error("[useProductSearch] Fetch error:", e);
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError(e instanceof Error ? e.message : 'An error occurred while searching.');
      }
      setData([]);
      setAllDataLoaded(true);
    } finally {
      if (page === 1) setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const search = useCallback((query: string) => {
    setCurrentQuery(query);
    setCurrentPage(1);
    setAllDataLoaded(false);
    fetchSearchResults(query, 1);
  }, [fetchSearchResults]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && !allDataLoaded && !isLoading && data.length > 0 && currentQuery) {
      fetchSearchResults(currentQuery, currentPage + 1);
    }
  }, [isLoadingMore, allDataLoaded, isLoading, data.length, fetchSearchResults, currentQuery, currentPage]);

  const reset = useCallback(() => {
    setData([]);
    setIsLoading(false);
    setError(null);
    setCurrentPage(1);
    setIsLoadingMore(false);
    setAllDataLoaded(false);
    setCurrentQuery('');
  }, []);

  return {
    data,
    isLoading,
    error,
    currentPage,
    isLoadingMore,
    allDataLoaded,
    search,
    loadMore,
    reset,
  };
};