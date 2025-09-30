// components/ui/AnimatedSavingsIndicator.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';

interface AnimatedSavingsIndicatorProps {
  originalPrice: number;
  currentPrice: number;
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AnimatedSavingsIndicator: React.FC<AnimatedSavingsIndicatorProps> = ({
  originalPrice,
  currentPrice,
  showAnimation = true,
  size = 'medium',
}) => {
  const savings = originalPrice - currentPrice;
  const savingsPercentage = Math.round((savings / originalPrice) * 100);
  
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showAnimation && savings > 0) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous pulse animation for great deals
      if (savingsPercentage >= 20) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Subtle rotation for the icon
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 3000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 3000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }
  }, [savings, savingsPercentage, showAnimation]);

  if (savings <= 0) return null;

  const sizeStyles = {
    small: { fontSize: 12, padding: 4, iconSize: 14 },
    medium: { fontSize: 14, padding: 6, iconSize: 16 },
    large: { fontSize: 16, padding: 8, iconSize: 20 },
  }[size];

  const getBadgeColor = () => {
    if (savingsPercentage >= 30) return designTokens.colors.success;
    if (savingsPercentage >= 20) return designTokens.colors.warning;
    return designTokens.colors.primary;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.badge,
          { backgroundColor: getBadgeColor(), padding: sizeStyles.padding },
        ]}
      >
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons
            name="pricetag"
            size={sizeStyles.iconSize}
            color={designTokens.colors.white}
          />
        </Animated.View>
        <Text style={[styles.savingsText, { fontSize: sizeStyles.fontSize }]}>
          Save ₪{savings.toFixed(2)}
        </Text>
        <View style={styles.percentageBadge}>
          <Text style={[styles.percentageText, { fontSize: sizeStyles.fontSize - 2 }]}>
            -{savingsPercentage}%
          </Text>
        </View>
      </View>
      
      {savingsPercentage >= 30 && (
        <View style={styles.hotDealBadge}>
          <Text style={styles.hotDealText}>🔥 HOT DEAL</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: designTokens.borderRadius.button,
    gap: 8,
    ...designTokens.shadows.accent,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  savingsText: {
    color: designTokens.colors.white,
    fontWeight: designTokens.typography.weight.bold,
    letterSpacing: designTokens.typography.letterSpacing.wide,
  },
  percentageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: designTokens.borderRadius.button,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  percentageText: {
    color: designTokens.colors.white,
    fontWeight: designTokens.typography.weight.bold,
  },
  hotDealBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: designTokens.colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: designTokens.borderRadius.button,
    transform: [{ rotate: '-8deg' }],
    ...designTokens.shadows.sm,
    borderWidth: 2,
    borderColor: designTokens.colors.white,
  },
  hotDealText: {
    color: designTokens.colors.white,
    fontSize: 10,
    fontWeight: designTokens.typography.weight.bold,
  },
});

export default AnimatedSavingsIndicator;