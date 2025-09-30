// components/product-details/ProductActions.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';

interface ProductActionsProps {
  onComparePrices: () => void;
  onAddToCart: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  onComparePrices,
  onAddToCart,
}) => {
  return (
    <View style={styles.container}>
      {/* Compare Prices Button */}
      <TouchableOpacity style={styles.comparePricesButton} onPress={onComparePrices}>
        <Ionicons name="analytics-outline" size={20} color={designTokens.colors.white} />
        <Text style={styles.comparePricesText}>Compare All Prices</Text>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  comparePricesButton: {
    backgroundColor: designTokens.colors.accent,
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.button,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: designTokens.spacing.md,
    ...designTokens.shadows.accent,
    gap: designTokens.spacing.sm,
  },
  comparePricesText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.subheading,
    fontWeight: designTokens.typography.weight.bold,
    letterSpacing: designTokens.typography.letterSpacing.wide,
  },
  addToCartButton: {
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.button,
    alignItems: 'center',
    marginVertical: designTokens.spacing.lg,
    ...designTokens.shadows.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  addToCartText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.subheading,
    fontWeight: designTokens.typography.weight.bold,
    letterSpacing: designTokens.typography.letterSpacing.wide,
  },
});

export default ProductActions;