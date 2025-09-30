import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import * as Haptics from 'expo-haptics';

interface ClayProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  style?: any;
}

const ClayProductCard: React.FC<ClayProductCardProps> = ({ product, onPress, style }) => {
  const { addToCart } = useCart();
  // Calculate potential savings if multiple prices exist
  const lowestPrice = product.price_range?.min || 0;
  const highestPrice = product.price_range?.max || lowestPrice;
  const savings = highestPrice > lowestPrice ? (highestPrice - lowestPrice) : 0;

  const handleAddToCart = (e: any) => {
    e.stopPropagation(); // Prevent triggering the card's onPress
    addToCart(product);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress(product)}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <Image
        source={{ uri: product.images?.[0] || product.image_url || 'https://via.placeholder.com/100' }}
        style={styles.productImage}
        resizeMode="contain"
      />

      {/* Brand */}
      <Text style={styles.brand} numberOfLines={1}>
        {product.brand}
      </Text>

      {/* Product Name */}
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <Text style={styles.price}>
          ₪{lowestPrice.toFixed(2)}
        </Text>
        {savings > 0 && (
          <Text style={styles.savings}>Save ₪{savings.toFixed(0)}</Text>
        )}
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Ionicons name="add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginRight: 12,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#D4A5A5',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  productImage: {
    width: '100%',
    height: 90,
    marginTop: 8,
    marginBottom: 8,
  },
  brand: {
    fontSize: 10,
    color: '#8A8680',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3937',
    marginBottom: 8,
    minHeight: 32,
    lineHeight: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3937',
  },
  savings: {
    fontSize: 11,
    color: '#8FBF9F',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F4B2B2',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#F4B2B2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

export default ClayProductCard;