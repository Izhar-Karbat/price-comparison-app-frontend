// context/FavoritesContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => Promise<void>;
  removeFavorite: (productId: number | string) => Promise<void>;
  isFavorite: (productId: number | string) => boolean;
  clearFavorites: () => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesState | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@favorites';

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites: Product[] = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Product[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async (product: Product) => {
    try {
      // Normalize product ID for comparison
      const productId = product.product_id?.toString() || product.masterproductid || '0';

      // Check if product is already in favorites
      const isAlreadyFavorite = favorites.some(fav => {
        const favId = fav.product_id?.toString() || fav.masterproductid || '0';
        return favId === productId;
      });

      if (isAlreadyFavorite) {
        console.log('Product already in favorites');
        return;
      }

      // Ensure product has all required fields
      const favoriteProduct: Product = {
        ...product,
        // Ensure we have both ID formats for compatibility
        product_id: product.product_id || parseInt(product.masterproductid || '0'),
        masterproductid: product.masterproductid || product.product_id?.toString() || '0',
        // Ensure we have both name formats
        name: product.name || product.productName || 'Unknown Product',
        productName: product.productName || product.name || 'Unknown Product',
        // Ensure we have both image formats
        image_url: product.image_url || product.imageUrl || product.image || '',
        imageUrl: product.imageUrl || product.image_url || product.image || '',
        // Ensure we have other required fields
        brand: product.brand || 'Unknown Brand',
        description: product.description || '',
        prices: product.prices || [],
      };

      const newFavorites = [...favorites, favoriteProduct];
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      console.log('Added to favorites:', favoriteProduct.name);
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (productId: number | string) => {
    try {
      const idString = productId.toString();
      const newFavorites = favorites.filter(product => {
        const favId = product.product_id?.toString() || product.masterproductid || '0';
        return favId !== idString;
      });

      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      console.log('Removed from favorites:', productId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorite = (productId: number | string): boolean => {
    const idString = productId.toString();
    return favorites.some(product => {
      const favId = product.product_id?.toString() || product.masterproductid || '0';
      return favId === idString;
    });
  };

  const clearFavorites = async () => {
    try {
      setFavorites([]);
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      console.log('Cleared all favorites');
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  const value: FavoritesState = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    isLoading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};