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
import { Ionicons } from '@expo/vector-icons';
import { Shadow } from 'react-native-shadow-2';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Product, StorePrice } from '../../types';

interface NeumorphicFeaturedCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  style?: ViewStyle;
}

const NeumorphicFeaturedCard: React.FC<NeumorphicFeaturedCardProps> = ({
  product,
  onPress,
  onAddToCart,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isAddPressed, setIsAddPressed] = useState(false);
  const animatedScale = useSharedValue(1);
  const addButtonScale = useSharedValue(1);

  // Enhanced neumorphic card style - more prominent than product cards
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: '#F7F5F3',
      borderRadius: 20,
      padding: 18,
      marginHorizontal: 20,
      marginBottom: 25,
    };

    if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: isPressed ? '#D4D0CC' : '#D4D0CC',
        shadowOffset: isPressed
          ? { width: 6, height: 6 }
          : { width: 12, height: 12 },
        shadowOpacity: isPressed ? 0.35 : 0.45,
        shadowRadius: isPressed ? 8 : 16,
      };
    } else {
      return {
        ...baseStyle,
        elevation: isPressed ? 8 : 15,
      };
    }
  };

  // Add button neumorphic style
  const getAddButtonStyle = () => {
    const baseStyle = {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#8FBF9F',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };

    if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: '#6B9B75',
        shadowOffset: isAddPressed
          ? { width: 2, height: 2 }
          : { width: 4, height: 4 },
        shadowOpacity: isAddPressed ? 0.4 : 0.5,
        shadowRadius: isAddPressed ? 4 : 8,
      };
    } else {
      return {
        ...baseStyle,
        elevation: isAddPressed ? 4 : 8,
      };
    }
  };

  // Light highlight for main card (iOS only)
  const getLightHighlight = () => ({
    position: 'absolute' as const,
    top: 0,
    left: 20,
    right: 20,
    bottom: 25,
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: '#FFFFFF',
    shadowOffset: isPressed
      ? { width: -4, height: -4 }
      : { width: -8, height: -8 },
    shadowOpacity: isPressed ? 0.4 : 0.7,
    shadowRadius: isPressed ? 6 : 12,
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
    if (onPress) {
      onPress(product);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleAddPressIn = () => {
    setIsAddPressed(true);
    addButtonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handleAddPressOut = () => {
    setIsAddPressed(false);
    addButtonScale.value = withTiming(1, { duration: 150 });
  };

  const handleAddPress = () => {
    if (onAddToCart) {
      onAddToCart(product);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value }],
  }));

  const addButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addButtonScale.value }],
  }));

  // Get lowest price store for main display
  const lowestPriceStore = product.storePrices?.find(store => store.isLowestPrice) || product.storePrices?.[0];

  // Calculate savings if there are multiple prices
  const savingsPercent = lowestPriceStore?.originalPrice
    ? Math.round(((lowestPriceStore.originalPrice - lowestPriceStore.price) / lowestPriceStore.originalPrice) * 100)
    : 0;

  // Android version with Shadow component
  if (Platform.OS === 'android') {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <Shadow
          distance={isPressed ? 8 : 15}
          startColor={'#D4D0CC70'}
          endColor={'#D4D0CC30'}
          offset={isPressed ? [6, 6] : [12, 12]}
          paintInside={false}
          sides={['bottom', 'right']}
          corners={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
          style={{ borderRadius: 20 }}
        >
          <TouchableOpacity
            style={getCardStyle()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            activeOpacity={0.9}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.featuredImage}
                  resizeMode="contain"
                />
                <View style={styles.productInfo}>
                  <Text style={styles.featuredLabel}>
                    {product.category || "This Week's Pick"}
                  </Text>
                  <Text style={styles.featuredName} numberOfLines={2}>
                    {product.productName}
                  </Text>
                  <View style={styles.priceRow}>
                    {lowestPriceStore && (
                      <Text style={styles.featuredPrice}>${lowestPriceStore.price}</Text>
                    )}
                    {savingsPercent > 0 && (
                      <View style={styles.saveBadge}>
                        <Text style={styles.saveText}>{savingsPercent}% off</Text>
                      </View>
                    )}
                  </View>
                  {product.storePrices && product.storePrices.length > 1 && (
                    <Text style={styles.storeCount}>
                      Available at {product.storePrices.length} stores
                    </Text>
                  )}
                </View>
              </View>

              <Animated.View style={addButtonAnimatedStyle}>
                <TouchableOpacity
                  style={getAddButtonStyle()}
                  onPressIn={handleAddPressIn}
                  onPressOut={handleAddPressOut}
                  onPress={handleAddPress}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </Animated.View>
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
          <View style={styles.cardContent}>
            <View style={styles.leftContent}>
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.featuredImage}
                resizeMode="contain"
              />
              <View style={styles.productInfo}>
                <Text style={styles.featuredLabel}>
                  {product.category || "This Week's Pick"}
                </Text>
                <Text style={styles.featuredName} numberOfLines={2}>
                  {product.productName}
                </Text>
                <View style={styles.priceRow}>
                  {lowestPriceStore && (
                    <Text style={styles.featuredPrice}>${lowestPriceStore.price}</Text>
                  )}
                  {savingsPercent > 0 && (
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveText}>{savingsPercent}% off</Text>
                    </View>
                  )}
                </View>
                {product.storePrices && product.storePrices.length > 1 && (
                  <Text style={styles.storeCount}>
                    Available at {product.storePrices.length} stores
                  </Text>
                )}
              </View>
            </View>

            <Animated.View style={addButtonAnimatedStyle}>
              <View style={{ position: 'relative' }}>
                {/* Light highlight for add button */}
                <View
                  style={{
                    position: 'absolute',
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    shadowColor: '#FFFFFF',
                    shadowOffset: isAddPressed
                      ? { width: -1, height: -1 }
                      : { width: -2, height: -2 },
                    shadowOpacity: isAddPressed ? 0.3 : 0.5,
                    shadowRadius: isAddPressed ? 2 : 4,
                    backgroundColor: 'transparent',
                  }}
                />
                <TouchableOpacity
                  style={getAddButtonStyle()}
                  onPressIn={handleAddPressIn}
                  onPressOut={handleAddPressOut}
                  onPress={handleAddPress}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  featuredImage: {
    width: 80,
    height: 100,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: 'transparent',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredLabel: {
    fontSize: 12,
    color: '#8FBF9F',
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: -0.5, height: -0.5 },
    textShadowRadius: 1,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3937',
    marginBottom: 8,
    lineHeight: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: -0.5, height: -0.5 },
    textShadowRadius: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featuredPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3A3937',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 2,
  },
  saveBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  saveText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  storeCount: {
    fontSize: 11,
    color: '#B0ABA6',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default NeumorphicFeaturedCard;