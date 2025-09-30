import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';
import { API_URL } from '../config';
import { mockCartItems } from '../src/data/mock-data';

// Create the context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { userToken } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [useMockData, setUseMockData] = useState(false);
    // RENAMED: from 'loading' to 'cartLoading' to perfectly match your ShoppingCartScreen.js
    const [cartLoading, setCartLoading] = useState(false);
    const [activeCartId, setActiveCartId] = useState(null);
    const [isOffline, setIsOffline] = useState(false);
    const retryTimeoutRef = useRef(null);
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        if (userToken) {
            fetchUserCartsAndItems(userToken);
        } else {
            // Use mock data when no user token
            setCartItems(mockCartItems.map((item, index) => ({
                ...item,
                id: item.masterproductid || `mock-${index}`,
                name: item.productName,
                image: item.imageUrl,
                retailer: item.retailer || 'Mock Store',
                quantity: item.quantity || 1,
                price: item.price || 0,
            })));
            setActiveCartId(null);
            setIsOffline(false);
            setUseMockData(true);
        }
    }, [userToken]);

    useEffect(() => {
        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const fetchWithRetry = async (url, options, maxRetries = 3) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    setIsOffline(false);
                    return response;
                }
                
                if (response.status >= 500 && attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                
                throw new Error(`Server error: ${response.status}`);
            } catch (error) {
                if (attempt === maxRetries || error.name === 'AbortError') {
                    throw error;
                }
                
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    const fetchUserCartsAndItems = async (token, skipDebounce = false) => {
        if (!skipDebounce) {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            
            debounceTimeoutRef.current = setTimeout(() => {
                fetchUserCartsAndItems(token, true);
            }, 300);
            return;
        }

        if (isOffline) {
            console.log("Currently offline - skipping cart fetch");
            return;
        }

        setCartLoading(true);
        try {
            const cartsResponse = await fetchWithRetry(`${API_URL}/api/carts`, {
                headers: { 'x-access-token': token },
            });
            
            const cartsData = await cartsResponse.json();

            if (cartsData.carts && cartsData.carts.length > 0) {
                const mainCart = cartsData.carts[0];
                setActiveCartId(mainCart.cart_id);
                
                const itemsResponse = await fetchWithRetry(`${API_URL}/api/carts/${mainCart.cart_id}/items`, {
                    headers: { 'x-access-token': token },
                });
                
                const itemsData = await itemsResponse.json();
                setCartItems(itemsData || []);
            } else {
                console.log("User has no shopping carts on the backend.");
                setCartItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch user cart:", error);
            setIsOffline(true);
            
            if (error.name === 'AbortError') {
                console.warn("Cart fetch timeout - server may be unavailable");
            } else if (error.message.includes('Failed to fetch') || error.message.includes('Network request failed')) {
                console.warn("Cart server unavailable - working in offline mode with mock data");
                
                // Use mock data as fallback
                setCartItems(mockCartItems.map((item, index) => ({
                    ...item,
                    id: item.masterproductid || `mock-${index}`,
                    name: item.productName,
                    image: item.imageUrl,
                    retailer: item.retailer || 'Mock Store',
                    quantity: item.quantity || 1,
                    price: item.price || 0,
                })));
                setUseMockData(true);
                
                if (retryTimeoutRef.current) {
                    clearTimeout(retryTimeoutRef.current);
                }
                
                retryTimeoutRef.current = setTimeout(() => {
                    console.log("Attempting to reconnect to cart server...");
                    setIsOffline(false);
                    fetchUserCartsAndItems(token, true);
                }, 30000);
            }
        } finally {
            setCartLoading(false);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        // IMPORTANT: Ensure the product object has `masterproductid`
        if (!product.masterproductid) {
            console.error("addToCart failed: product is missing masterproductid", product);
            Alert.alert("Error", "Cannot add item without a product ID.");
            return;
        }

        if (userToken && activeCartId && !isOffline) {
            try {
                await fetchWithRetry(`${API_URL}/api/carts/${activeCartId}/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': userToken },
                    body: JSON.stringify({ masterproductid: product.masterproductid, quantity }),
                });
                await fetchUserCartsAndItems(userToken, true); // Re-sync to get the latest state
            } catch (error) {
                console.error("Failed to add to cart:", error);
                Alert.alert('Sync Error', `Could not add ${product.productname || 'item'} to your list.`);
                
                // Add to local cart as fallback
                setCartItems((prevItems) => {
                    const existingItem = prevItems.find(item => item.masterproductid === product.masterproductid);
                    if (existingItem) {
                        return prevItems.map(item =>
                            item.masterproductid === product.masterproductid
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        );
                    }
                    return [...prevItems, { ...product, quantity }];
                });
            }
        } else {
            setCartItems((prevItems) => {
                const existingItem = prevItems.find(item => item.masterproductid === product.masterproductid);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.masterproductid === product.masterproductid
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prevItems, { ...product, quantity }];
            });
        }
    };
    
    const updateItemQuantity = async (masterproductid, newQuantity) => {
        if (userToken && activeCartId && !isOffline) {
            try {
                await fetchWithRetry(`${API_URL}/api/carts/${activeCartId}/items/${masterproductid}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': userToken },
                    body: JSON.stringify({ quantity: newQuantity }),
                });
                await fetchUserCartsAndItems(userToken, true); // Re-sync
            } catch (error) {
                console.error("Failed to update quantity:", error);
                Alert.alert('Sync Error', 'Could not update item quantity.');
                
                // Update locally as fallback
                setCartItems(prev => prev.map(item => item.masterproductid === masterproductid ? {...item, quantity: newQuantity} : item));
            }
        } else {
            setCartItems(prev => prev.map(item => item.masterproductid === masterproductid ? {...item, quantity: newQuantity} : item));
        }
    };
    
    const removeItemFromCart = async (masterproductid) => {
        if (userToken && activeCartId && !isOffline) {
            try {
                await fetchWithRetry(`${API_URL}/api/carts/${activeCartId}/items/${masterproductid}`, {
                    method: 'DELETE',
                    headers: { 'x-access-token': userToken },
                });
                await fetchUserCartsAndItems(userToken, true); // Re-sync
            } catch (error) {
                console.error("Failed to remove item:", error);
                Alert.alert('Sync Error', 'Could not remove item from your list.');
                
                // Remove locally as fallback
                setCartItems(prev => prev.filter(item => item.masterproductid !== masterproductid));
            }
        } else {
            setCartItems(prev => prev.filter(item => item.masterproductid !== masterproductid));
        }
    };

    // NEW: Implemented clearCart function
    const clearCart = async () => {
        if (userToken && activeCartId) {
            try {
                // This assumes a backend endpoint that deletes all items for a cart_id.
                // If it doesn't exist, we would need to loop and delete one by one.
                // For now, we'll just clear the local state and log a TODO.
                console.log("TODO: Implement DELETE /api/carts/<cart_id>/items/all endpoint on backend.");
                
                // Optimistic UI update: clear locally right away.
                setCartItems([]);
                // In a real scenario, you might want to call a bulk delete endpoint
                // and then re-fetch.
            } catch (error) {
                 Alert.alert('Sync Error', 'Could not clear your list.');
            }
        } else {
            setCartItems([]);
        }
    };

    const getCartTotal = () => cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const getCartItemCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const value = {
        cartItems,
        cartLoading, // Use the renamed state variable
        activeCartId,
        isOffline,
        addToCart,
        updateItemQuantity,
        removeItemFromCart,
        clearCart, // Export the new function
        getCartTotal,
        getCartItemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
