// components/product-details/SuggestedAlternatives.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { designTokens } from '../../theme/designTokens';
import ProductCard from '../product/ProductCard';
import { Product } from '../../types';

interface SuggestedAlternativesProps {
  alternativeProduct: Product;
  onAlternativePress: (product: Product) => void;
}

const SuggestedAlternatives: React.FC<SuggestedAlternativesProps> = ({
  alternativeProduct,
  onAlternativePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Alternative</Text>
        <Text style={styles.alternativeSubtitle}>
          Alternative product option
        </Text>
        <ProductCard
          product={alternativeProduct}
          onPress={onAlternativePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  section: {
    marginVertical: designTokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: designTokens.typography.size.xl,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
    letterSpacing: designTokens.typography.letterSpacing.tight,
  },
  alternativeSubtitle: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
  },
});

export default SuggestedAlternatives;