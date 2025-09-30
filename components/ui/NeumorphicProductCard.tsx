import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
  Image,
  ViewStyle,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Product, StorePrice } from '../../types';

interface NeumorphicProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  style?: ViewStyle;
}

const NeumorphicProductCard: React.FC<NeumorphicProductCardProps> = ({
  product,
  onPress,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const animatedScale = useSharedValue(1);

  const cardWidth = 140;
  const cardHeight = 160; // Reduced from 200 to 160 for shorter cards

  // Enhanced neumorphic card style
  const getCardStyle = () => {
    const baseStyle = {
      width: cardWidth,
      backgroundColor: '#F7F5F3',
      borderRadius: 16,
      padding: 12,
      marginRight: 15,
    };

    if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: isPressed ? '#D4D0CC' : '#D4D0CC',
        shadowOffset: isPressed
          ? { width: 4, height: 4 }
          : { width: 8, height: 8 },
        shadowOpacity: isPressed ? 0.3 : 0.4,
        shadowRadius: isPressed ? 6 : 12,
      };
    } else {
      return {
        ...baseStyle,
        elevation: isPressed ? 4 : 8,
      };
    }
  };

  // Light highlight for neumorphic effect (iOS only)
  const getLightHighlight = () => ({
    position: 'absolute' as const,
    width: cardWidth,
    height: cardHeight,
    borderRadius: 16,
    backgroundColor: 'transparent',
    shadowColor: '#FFFFFF',
    shadowOffset: isPressed
      ? { width: -2, height: -2 }
      : { width: -4, height: -4 },
    shadowOpacity: isPressed ? 0.3 : 0.6,
    shadowRadius: isPressed ? 4 : 8,
    pointerEvents: 'none' as const,
  });

  const handlePressIn = () => {
    setIsPressed(true);
    animatedScale.value = withTiming(0.98, { duration: 150 });

    runOnJS(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    })();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    animatedScale.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    onPress(product);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value }],
  }));

  // Get lowest price store for main display
  const lowestPriceStore = product.storePrices?.find(store => store.isLowestPrice) || product.storePrices?.[0];

  // Calculate savings if there are multiple prices
  const savingsPercent = lowestPriceStore?.originalPrice
    ? Math.round(((lowestPriceStore.originalPrice - lowestPriceStore.price) / lowestPriceStore.originalPrice) * 100)
    : 0;

  // Get price range for display
  const priceRange = product.storePrices && product.storePrices.length > 1
    ? `$${Math.min(...product.storePrices.map(s => s.price))} - $${Math.max(...product.storePrices.map(s => s.price))}`
    : null;

  // Android version with Shadow component
  if (Platform.OS === 'android') {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Shadow
          distance={isPressed ? 4 : 8}
          startColor={'#D4D0CC60'}
          endColor={'#D4D0CC20'}
          offset={isPressed ? [4, 4] : [8, 8]}
          paintInside={false}
          sides={['bottom', 'right']}
          corners={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
          style={{ borderRadius: 16 }}
        >
          <TouchableOpacity
            style={getCardStyle()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />

            {/* Category Badge */}
            {product.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            )}

            <Text style={styles.productName} numberOfLines={2}>
              {product.productName}
            </Text>
            <Text style={styles.productBrand} numberOfLines={1}>
              {product.brand}
            </Text>

            {/* Price Display */}
            <View style={styles.priceSection}>
              {priceRange ? (
                <View>
                  <Text style={styles.priceRange}>{priceRange}</Text>
                  <Text style={styles.storeCount}>{product.storePrices.length} stores</Text>
                </View>
              ) : lowestPriceStore ? (
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>${lowestPriceStore.price}</Text>
                  {lowestPriceStore.originalPrice && lowestPriceStore.originalPrice > lowestPriceStore.price && (
                    <Text style={styles.productOldPrice}>${lowestPriceStore.originalPrice}</Text>
                  )}
                </View>
              ) : null}

              {savingsPercent > 0 && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{savingsPercent}% off</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Shadow>
      </Animated.View>
    );
  }

  // iOS version with dual shadows
  return (
    <Animated.View style={[animatedStyle, style]}>
      <View style={{ position: 'relative' }}>
        {/* Light highlight shadow */}
        <View style={getLightHighlight()} />

        {/* Main card with dark shadow */}
        <TouchableOpacity
          style={getCardStyle()}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />

          {/* Category Badge */}
          {product.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
          )}

          <Text style={styles.productName} numberOfLines={2}>
            {product.productName}
          </Text>
          <Text style={styles.productBrand} numberOfLines={1}>
            {product.brand}
          </Text>

          {/* Price Display */}
          <View style={styles.priceSection}>
            {priceRange ? (
              <View>
                <Text style={styles.priceRange}>{priceRange}</Text>
                <Text style={styles.storeCount}>{product.storePrices.length} stores</Text>
              </View>
            ) : lowestPriceStore ? (
              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>${lowestPriceStore.price}</Text>
                {lowestPriceStore.originalPrice && lowestPriceStore.originalPrice > lowestPriceStore.price && (
                  <Text style={styles.productOldPrice}>${lowestPriceStore.originalPrice}</Text>
                )}
              </View>
            ) : null}

            {savingsPercent > 0 && (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>{savingsPercent}% off</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: '100%',
    height: 70, // Reduced from 100 to 70 for shorter cards
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: 'transparent',
  },
  categoryBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#8FBF9F',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 1,
  },
  categoryText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 12, // Reduced from 13
    fontWeight: '600',
    color: '#3A3937',
    marginBottom: 2,
    lineHeight: 14,
  },
  productBrand: {
    fontSize: 10, // Reduced from 11
    color: '#8A8680',
    marginBottom: 4,
    fontWeight: '500',
  },
  priceSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  priceRange: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8FBF9F',
    marginBottom: 1,
  },
  storeCount: {
    fontSize: 9,
    color: '#B0ABA6',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14, // Reduced from 16
    fontWeight: '700',
    color: '#8FBF9F',
  },
  productOldPrice: {
    fontSize: 11, // Reduced from 12
    color: '#C4C0BC',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  savingsBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  savingsText: {
    fontSize: 9, // Reduced from 10
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

export default NeumorphicProductCard;