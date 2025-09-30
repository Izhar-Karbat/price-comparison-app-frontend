// components/product-details/ProductInfo.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { designTokens } from '../../theme/designTokens';
import IngredientTag from '../IngredientTag';
import PromotionBadge, { Promotion } from '../product/PromotionBadge';

interface Ingredient {
  name: string;
  type: 'safe' | 'warning' | 'danger';
}

interface ProductInfoProps {
  description: string;
  ingredients: Ingredient[];
  promotions?: Promotion[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ description, ingredients, promotions }) => {
  return (
    <View style={styles.container}>
      {/* Promotions Section */}
      {promotions && promotions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <View style={styles.promotionsContainer}>
            {promotions.map((promotion) => (
              <PromotionBadge
                key={promotion.id}
                promotion={promotion}
                size="medium"
              />
            ))}
          </View>
        </View>
      )}

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Ingredients Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient, index) => (
            <IngredientTag
              key={index}
              name={ingredient.name}
              type={ingredient.type}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  description: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    lineHeight: 24,
    marginBottom: designTokens.spacing.lg,
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
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promotionsContainer: {
    gap: designTokens.spacing.sm,
  },
});

export default ProductInfo;