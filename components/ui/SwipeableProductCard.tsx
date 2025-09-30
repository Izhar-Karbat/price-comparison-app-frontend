// components/ui/SwipeableProductCard.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';
import HealthScoreBadge from '../product/HealthScoreBadge';
import AnimatedSavingsIndicator from './AnimatedSavingsIndicator';
import { Product } from '../../types';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.25;

interface SwipeableProductCardProps {
  product: Product & {
    originalPrice?: number;
    retailer_count?: number;
    store_count?: number;
  };
  onSwipeRight?: () => void; // Add to cart
  onSwipeLeft?: () => void; // Save for later
  onPress?: () => void;
}

const SwipeableProductCard: React.FC<SwipeableProductCardProps> = ({
  product,
  onSwipeRight,
  onSwipeLeft,
  onPress,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const actionOpacity = useRef(new Animated.Value(0)).current;

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS === 'ios') {
      // iOS-specific haptic feedback would go here
      // React Native doesn't have built-in iOS haptic support
      // You'd need to use a library like react-native-haptic-feedback
    } else {
      // Android vibration
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
      };
      Vibration.vibrate(patterns[type]);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        triggerHaptic('light');
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
        
        // Show action indicators
        const opacity = Math.min(Math.abs(gestureState.dx) / SWIPE_THRESHOLD, 1);
        actionOpacity.setValue(opacity);
        
        // Haptic feedback at threshold
        if (Math.abs(gestureState.dx) === Math.floor(SWIPE_THRESHOLD)) {
          triggerHaptic('medium');
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldTriggerAction = Math.abs(gestureState.dx) > SWIPE_THRESHOLD;
        
        if (shouldTriggerAction) {
          const isRightSwipe = gestureState.dx > 0;
          
          // Trigger haptic for action
          triggerHaptic('heavy');
          
          // Animate off screen
          Animated.timing(translateX, {
            toValue: isRightSwipe ? screenWidth : -screenWidth,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            // Trigger action
            if (isRightSwipe) {
              onSwipeRight?.();
            } else {
              onSwipeLeft?.();
            }
            
            // Reset position
            translateX.setValue(0);
            actionOpacity.setValue(0);
          });
        } else {
          // Spring back to center
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              tension: 50,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(actionOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const leftActionOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const rightActionOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const cardScale = translateX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Action Indicators */}
      <View style={styles.actionsContainer}>
        <Animated.View
          style={[
            styles.actionLeft,
            { opacity: rightActionOpacity },
          ]}
        >
          <Ionicons name="bookmark" size={32} color={designTokens.colors.white} />
          <Text style={styles.actionText}>Save</Text>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.actionRight,
            { opacity: leftActionOpacity },
          ]}
        >
          <Ionicons name="cart" size={32} color={designTokens.colors.white} />
          <Text style={styles.actionText}>Add to Cart</Text>
        </Animated.View>
      </View>

      {/* Swipeable Card */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              { translateX },
              { scale: cardScale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>{product.productName}</Text>
          
          {/* Vibrant Savings Indicator */}
          {product.originalPrice && product.price && product.originalPrice > product.price && (
            <View style={styles.savingsContainer}>
              <AnimatedSavingsIndicator
                originalPrice={product.originalPrice}
                currentPrice={product.price}
                size="medium"
                showAnimation={true}
              />
            </View>
          )}
          
          {/* Multi-retailer indicator */}
          {product.retailer_count && product.retailer_count > 1 && (
            <View style={styles.retailerBadge}>
              <Ionicons name="storefront" size={12} color={designTokens.colors.primary} />
              <Text style={styles.retailerText}>
                {product.retailer_count} retailers • {product.store_count} stores
              </Text>
            </View>
          )}
          
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text style={styles.originalPrice}>₪{product.originalPrice.toFixed(2)}</Text>
              )}
              <Text style={styles.price}>₪{product.price?.toFixed(2) || 'N/A'}</Text>
            </View>
            {product.healthScore && <HealthScoreBadge score={product.healthScore} />}
          </View>
        </View>
      </Animated.View>

      {/* Swipe hint */}
      <View style={styles.swipeHint}>
        <Ionicons name="swap-horizontal" size={16} color={designTokens.colors.gray.medium} />
        <Text style={styles.swipeHintText}>Swipe to add or save</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.md,
    position: 'relative',
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl,
  },
  actionLeft: {
    alignItems: 'center',
  },
  actionRight: {
    alignItems: 'center',
  },
  actionText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.caption,
    fontWeight: designTokens.typography.weight.bold,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: designTokens.colors.cardBackground,
    borderRadius: designTokens.borderRadius.card,
    padding: designTokens.spacing.lg,
    borderWidth: 1,
    borderColor: designTokens.colors.cardBorder,
    ...designTokens.shadows.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: designTokens.borderRadius.medium,
    backgroundColor: designTokens.colors.gray.light,
  },
  infoContainer: {
    flex: 1,
    marginLeft: designTokens.spacing.md,
  },
  brand: {
    fontSize: designTokens.typography.size.caption,
    fontWeight: designTokens.typography.weight.semibold,
    color: designTokens.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: designTokens.spacing.xs,
  },
  productName: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.xs,
  },
  savingsContainer: {
    marginVertical: designTokens.spacing.xs,
  },
  retailerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.xs,
    gap: 4,
  },
  retailerText: {
    fontSize: designTokens.typography.size.caption,
    color: designTokens.colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: designTokens.spacing.sm,
  },
  priceContainer: {
    flex: 1,
  },
  originalPrice: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.primary,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: designTokens.spacing.xs,
    gap: 4,
  },
  swipeHintText: {
    fontSize: designTokens.typography.size.caption,
    color: designTokens.colors.gray.medium,
  },
});

export default SwipeableProductCard;