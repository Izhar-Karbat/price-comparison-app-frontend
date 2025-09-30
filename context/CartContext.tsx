// context/CartContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  getCartItemCount: () => number;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addToCart = (product: Product) => {
    console.log('Adding product to cart:', product.masterproductid, product.name);
    setItems(prevItems => {
      console.log('Current cart items:', prevItems.map(item => ({ id: item.masterproductid, name: item.name })));
      const existingItem = prevItems.find(item => item.masterproductid === product.masterproductid);
      if (existingItem) {
        // If item exists, increase quantity
        console.log('Product already in cart, increasing quantity');
        return prevItems.map(item =>
          item.masterproductid === product.masterproductid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // If item is new, add it to the cart with quantity 1
      console.log('New product, adding to cart');
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const getCartItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.masterproductid === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItemFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.masterproductid !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      // Try multiple price fields and validate the value
      let price = 0;

      if (item.price && !isNaN(item.price) && item.price > 0) {
        price = item.price;
      } else if (item.lowest_price && !isNaN(item.lowest_price) && item.lowest_price > 0) {
        price = item.lowest_price;
      } else if (item.price_range?.min && !isNaN(item.price_range.min) && item.price_range.min > 0) {
        price = item.price_range.min;
      }

      // Ensure quantity is valid
      const quantity = item.quantity && !isNaN(item.quantity) && item.quantity > 0 ? item.quantity : 0;

      return total + (price * quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      cartItems: items,
      addToCart, 
      getCartItemCount,
      updateItemQuantity,
      removeItemFromCart,
      clearCart,
      getCartTotal,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};