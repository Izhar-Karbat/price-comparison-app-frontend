import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { designTokens } from '../../theme/designTokens';
import { useCart } from '../../context/CartContext';
import { CartItem as CartItemType } from '../../context/CartContext';

const CartItem: React.FC<CartItemType> = (item) => {
  const { updateItemQuantity, removeItemFromCart } = useCart();
  const { name, brand, images, price_range, quantity, masterproductid } = item;

  // Safely get the price from various possible fields
  let displayPrice = 0;
  if (item.price && !isNaN(item.price) && item.price > 0) {
    displayPrice = item.price;
  } else if (item.lowest_price && !isNaN(item.lowest_price) && item.lowest_price > 0) {
    displayPrice = item.lowest_price;
  } else if (price_range?.min && !isNaN(price_range.min) && price_range.min > 0) {
    displayPrice = price_range.min;
  }

  // Get image URL from various possible fields
  const imageUrl = item.imageUrl || item.image_url || item.image || images?.[0];

  return (
    <View style={styles.container}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{brand || 'Unknown Brand'}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.productName || name || 'Unknown Product'}</Text>
        {displayPrice > 0 ? (
          <Text style={styles.price}>₪{displayPrice.toFixed(2)}</Text>
        ) : (
          <Text style={[styles.price, { fontStyle: 'italic' }]}>Price unavailable</Text>
        )}
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateItemQuantity(masterproductid, quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateItemQuantity(masterproductid, quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: designTokens.colors.white, padding: designTokens.spacing.md, marginBottom: designTokens.spacing.sm, alignItems: 'center', },
  image: { width: 60, height: 60, borderRadius: designTokens.borderRadius.small, },
  infoContainer: { flex: 1, marginLeft: designTokens.spacing.md, justifyContent: 'center', },
  brand: { fontSize: designTokens.typography.size.small, color: designTokens.colors.textSecondary, },
  productName: { fontSize: designTokens.typography.size.body, fontWeight: designTokens.typography.weight.bold, color: designTokens.colors.text, },
  price: { fontSize: designTokens.typography.size.body, color: designTokens.colors.primary, marginTop: designTokens.spacing.xs, },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: designTokens.colors.gray.light, borderRadius: designTokens.borderRadius.large, },
  quantityButton: { paddingHorizontal: designTokens.spacing.md, paddingVertical: designTokens.spacing.sm, },
  quantityButtonText: { fontSize: 20, color: designTokens.colors.primary, fontWeight: designTokens.typography.weight.bold, },
  quantityText: { fontSize: 16, fontWeight: designTokens.typography.weight.bold, minWidth: 20, textAlign: 'center', },
});

export default CartItem;