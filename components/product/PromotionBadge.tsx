// components/product/PromotionBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';

export interface Promotion {
  id: number;
  description: string;
  type?: 'discount' | 'bogo' | 'sale' | 'clearance' | 'special';
  discount_percentage?: number;
  valid_until?: string;
}

interface PromotionBadgeProps {
  promotion: Promotion;
  size?: 'small' | 'medium' | 'large';
  compact?: boolean; // For showing just an icon indicator
}

const PromotionBadge: React.FC<PromotionBadgeProps> = ({
  promotion,
  size = 'medium',
  compact = false,
}) => {
  const getPromotionStyle = () => {
    switch (promotion.type) {
      case 'bogo':
        return {
          backgroundColor: '#FF6B35', // Orange for BOGO
          icon: 'gift-outline' as const,
        };
      case 'sale':
        return {
          backgroundColor: '#E63946', // Red for sales
          icon: 'pricetag-outline' as const,
        };
      case 'clearance':
        return {
          backgroundColor: '#8E2DE2', // Purple for clearance
          icon: 'flash-outline' as const,
        };
      case 'special':
        return {
          backgroundColor: '#4ECDC4', // Teal for special offers
          icon: 'star-outline' as const,
        };
      case 'discount':
      default:
        return {
          backgroundColor: '#F77F00', // Golden orange for discounts
          icon: 'percent-outline' as const,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: designTokens.typography.size.caption,
          padding: designTokens.spacing.xs,
          iconSize: 12,
        };
      case 'large':
        return {
          fontSize: designTokens.typography.size.body,
          padding: designTokens.spacing.md,
          iconSize: 18,
        };
      case 'medium':
      default:
        return {
          fontSize: designTokens.typography.size.small,
          padding: designTokens.spacing.sm,
          iconSize: 14,
        };
    }
  };

  const promotionStyle = getPromotionStyle();
  const sizeStyles = getSizeStyles();

  if (compact) {
    return (
      <View style={[styles.compactBadge, { backgroundColor: promotionStyle.backgroundColor }]}>
        <Ionicons
          name={promotionStyle.icon}
          size={12}
          color={designTokens.colors.white}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: promotionStyle.backgroundColor,
          padding: sizeStyles.padding,
        },
      ]}
    >
      <View style={styles.badgeContent}>
        <Ionicons
          name={promotionStyle.icon}
          size={sizeStyles.iconSize}
          color={designTokens.colors.white}
          style={styles.badgeIcon}
        />
        <Text
          style={[
            styles.badgeText,
            {
              fontSize: sizeStyles.fontSize,
            },
          ]}
          numberOfLines={size === 'small' ? 1 : 2}
        >
          {promotion.description}
        </Text>
      </View>
      {promotion.valid_until && size !== 'small' && (
        <Text style={styles.validUntil}>
          Until {new Date(promotion.valid_until).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: designTokens.borderRadius.medium,
    marginVertical: designTokens.spacing.xs,
    ...designTokens.shadows.sm,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginRight: designTokens.spacing.xs,
  },
  badgeText: {
    color: designTokens.colors.white,
    fontWeight: designTokens.typography.weight.bold,
    flex: 1,
  },
  validUntil: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: designTokens.typography.size.caption,
    marginTop: designTokens.spacing.xs,
    fontWeight: designTokens.typography.weight.medium,
  },
  compactBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 4,
    left: 4,
    ...designTokens.shadows.sm,
  },
});

export default PromotionBadge;