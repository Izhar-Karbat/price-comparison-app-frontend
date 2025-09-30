// components/product/QuickViewModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

interface RetailerPrice {
  name: string;
  price: number;
  isBestDeal?: boolean;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, visible, onClose }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when modal opens with new product
  useEffect(() => {
    if (visible) {
      setQuantity(1);
      setShowSuccess(false);
    }
  }, [visible, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    setIsAdding(true);

    try {
      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Show success state
      setShowSuccess(true);
      setIsAdding(false);

      // Close modal after a short delay
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Use real price data from the product
  const retailerPrices: RetailerPrice[] = [];

  if (product.prices && product.prices.length > 0) {
    // Group prices by retailer and show lowest price per retailer
    const retailerMap = new Map<string, any>();

    product.prices.forEach(p => {
      const key = p.retailer_name || 'Unknown Retailer';
      if (!retailerMap.has(key) || retailerMap.get(key).price > p.price) {
        retailerMap.set(key, {
          name: p.retailer_name,
          store: p.store_name,
          address: p.store_address,
          price: p.price
        });
      }
    });

    // Convert to array and sort by price
    const sortedRetailers = Array.from(retailerMap.values()).sort((a, b) => a.price - b.price);
    const lowestPrice = sortedRetailers[0]?.price;

    // Map to display format, limit to top 5 retailers
    retailerPrices.push(...sortedRetailers.slice(0, 5).map(r => ({
      name: r.name || 'Store',
      price: r.price,
      isBestDeal: r.price === lowestPrice
    })));
  } else {
    // Fallback for products without price data
    retailerPrices.push({
      name: 'Price',
      price: product.price_range?.min || product.price || 0,
      isBestDeal: false
    });
  }

  // Calculate lowest price from actual price data
  const lowestPrice = retailerPrices.length > 0
    ? Math.min(...retailerPrices.map(r => r.price))
    : (product.price_range?.min || 0);
  const totalPrice = lowestPrice * quantity;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Product Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#3A3937" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Product Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: product.images?.[0] || product.image_url || 'https://via.placeholder.com/200' }}
                style={styles.image}
              />
            </View>

            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.brand}>{product.brand || 'Brand'}</Text>
              <Text style={styles.productName}>{product.name}</Text>

              {product.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
              )}
            </View>

            {/* Price Comparison Section */}
            <View style={styles.priceComparisonSection}>
              <Text style={styles.sectionTitle}>Compare Prices</Text>

              {retailerPrices.map((retailer, index) => (
                <View key={index} style={styles.retailerRow}>
                  <View style={styles.retailerInfo}>
                    <Text style={styles.retailerName}>{retailer.name}</Text>
                    {retailer.isBestDeal && (
                      <View style={styles.bestDealBadge}>
                        <Text style={styles.bestDealText}>Best Deal</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.retailerPrice, retailer.isBestDeal && styles.bestPrice]}>
                    ₪{retailer.price.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Ionicons name="remove" size={20} color={quantity <= 1 ? '#CCC' : '#3A3937'} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                  <Ionicons name="add" size={20} color="#3A3937" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Total Price */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>₪{totalPrice.toFixed(2)}</Text>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              style={[styles.addToCartButton, (isAdding || showSuccess) && styles.addToCartButtonDisabled]}
              onPress={handleAddToCart}
              disabled={isAdding || showSuccess}
            >
              {showSuccess ? (
                <View style={styles.buttonContent}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.addToCartButtonText}>Added to Cart!</Text>
                </View>
              ) : isAdding ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="cart-outline" size={20} color="white" />
                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    maxHeight: '85%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3937',
  },
  closeButton: {
    padding: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  productInfo: {
    marginBottom: 20,
  },
  brand: {
    fontSize: 12,
    color: '#8A8680',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3A3937',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  priceComparisonSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3937',
    marginBottom: 10,
  },
  retailerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 8,
  },
  retailerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  retailerName: {
    fontSize: 14,
    color: '#3A3937',
    fontWeight: '500',
  },
  bestDealBadge: {
    backgroundColor: '#8FBF9F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bestDealText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  retailerPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  bestPrice: {
    color: '#8FBF9F',
    fontSize: 18,
    fontWeight: '700',
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3937',
    minWidth: 30,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A3937',
  },
  addToCartButton: {
    backgroundColor: '#F4B2B2',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  addToCartButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default QuickViewModal;