// components/product-details/ProductHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';
import HealthScoreBadge from '../product/HealthScoreBadge';
import AnimatedSavingsIndicator from '../ui/AnimatedSavingsIndicator';

interface ProductHeaderProps {
  productName: string;
  brand: string;
  imageUrl: string;
  healthScore: number;
  price: number;
  onShare: () => void;
  onBack: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  productName,
  brand,
  imageUrl,
  healthScore,
  price,
  onShare,
  onBack,
  onFavorite,
  isFavorite,
}) => {
  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? designTokens.colors.danger : designTokens.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Ionicons name="share-outline" size={24} color={designTokens.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
          placeholder={{ blurhash }}
          contentFit="contain"
          transition={300}
        />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.brandName}>{brand}</Text>

        {/* Animated Savings Indicator */}
        <View style={styles.savingsSection}>
          <AnimatedSavingsIndicator
            originalPrice={price * 1.2} // Mock original price
            currentPrice={price}
            size="large"
          />
        </View>

        <View style={styles.scoreContainer}>
          <HealthScoreBadge score={healthScore} size="large" />
          <Text style={styles.scoreLabel}>Health Score</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.white,
    ...designTokens.shadows.xs,
  },
  backButton: {
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.cardBackground,
    borderRadius: designTokens.borderRadius.button,
    ...designTokens.shadows.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.sm,
  },
  favoriteButton: {
    padding: designTokens.spacing.sm,
  },
  shareButton: {
    padding: designTokens.spacing.sm,
  },
  imageContainer: {
    backgroundColor: designTokens.colors.white,
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.cardBorder,
  },
  productImage: {
    width: 250,
    height: 250,
    backgroundColor: designTokens.colors.gray.light,
  },
  productInfo: {
    padding: designTokens.spacing.lg,
  },
  productName: {
    fontSize: designTokens.typography.size.heading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xs,
    letterSpacing: designTokens.typography.letterSpacing.tight,
    lineHeight: designTokens.typography.lineHeight.tight * designTokens.typography.size.heading,
  },
  brandName: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
  },
  savingsSection: {
    marginVertical: designTokens.spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  scoreLabel: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginLeft: designTokens.spacing.md,
  },
});

export default ProductHeader;