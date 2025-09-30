import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
  View,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface NeumorphicButtonProps {
  title: string;
  onPress: () => void;
  isActive?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  title,
  onPress,
  isActive = false,
  variant = 'secondary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const animatedScale = useSharedValue(1);

  // Color variants
  const colorVariants = {
    primary: {
      active: { background: '#8FBF9F', text: '#FFFFFF', shadow: '#7AA089' },
      inactive: { background: '#F7F5F3', text: '#8A8680', shadow: '#D4D0CC' },
    },
    secondary: {
      active: { background: '#8FBF9F', text: '#FFFFFF', shadow: '#7AA089' },
      inactive: { background: '#F7F5F3', text: '#8A8680', shadow: '#D4D0CC' },
    },
    accent: {
      active: { background: '#F4B2B2', text: '#FFFFFF', shadow: '#E09999' },
      inactive: { background: '#F7F5F3', text: '#8A8680', shadow: '#D4D0CC' },
    },
  };

  // Size variants
  const sizeVariants = {
    small: { height: 36, paddingHorizontal: 16, fontSize: 12, borderRadius: 18 },
    medium: { height: 46, paddingHorizontal: 20, fontSize: 14, borderRadius: 23 },
    large: { height: 56, paddingHorizontal: 24, fontSize: 16, borderRadius: 28 },
  };

  const currentColors = isActive
    ? colorVariants[variant].active
    : colorVariants[variant].inactive;
  const currentSize = sizeVariants[size];

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
    if (!disabled) {
      onPress();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animatedScale.value }],
  }));

  // Cross-platform neumorphic styles
  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: currentColors.background,
      borderRadius: currentSize.borderRadius,
      height: currentSize.height,
      paddingHorizontal: currentSize.paddingHorizontal,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };

    if (Platform.OS === 'ios') {
      if (isActive) {
        return {
          ...baseStyle,
          // Active buttons appear raised
          shadowColor: currentColors.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        };
      } else {
        return {
          ...baseStyle,
          // Inactive buttons appear flat/slightly recessed
          shadowColor: isPressed ? '#D4D0CC' : '#D4D0CC',
          shadowOffset: isPressed
            ? { width: 4, height: 4 }  // Pressed inward
            : { width: 8, height: 8 }, // Normal raised
          shadowOpacity: isPressed ? 0.4 : 0.3,
          shadowRadius: isPressed ? 6 : 12,
        };
      }
    } else {
      return {
        ...baseStyle,
        elevation: isActive ? 8 : (isPressed ? 2 : 6),
      };
    }
  };

  // Android version with Shadow component
  if (Platform.OS === 'android') {
    return (
      <Animated.View style={[animatedStyle, { flex: 1 }, style]}>
        <Shadow
          distance={isPressed ? 4 : (isActive ? 10 : 8)}
          startColor={`${currentColors.shadow}60`}
          endColor={`${currentColors.shadow}20`}
          offset={isPressed ? [4, 4] : (isActive ? [0, 6] : [8, 8])}
          paintInside={false}
          sides={['bottom', 'right']}
          corners={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
          style={{ borderRadius: currentSize.borderRadius }}
        >
          <TouchableOpacity
            style={[getButtonStyle(), disabled && { opacity: 0.5 }]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.text,
                { color: currentColors.text, fontSize: currentSize.fontSize },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        </Shadow>
      </Animated.View>
    );
  }

  // iOS version with dual shadows for true neumorphic effect
  return (
    <Animated.View style={[animatedStyle, { flex: 1 }, style]}>
      <View style={{ position: 'relative' }}>
        {/* Light highlight shadow (top-left) for inactive buttons */}
        {!isActive && Platform.OS === 'ios' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: currentSize.height,
              borderRadius: currentSize.borderRadius,
              shadowColor: '#FFFFFF',
              shadowOffset: isPressed
                ? { width: -2, height: -2 }
                : { width: -6, height: -6 },
              shadowOpacity: isPressed ? 0.4 : 0.7,
              shadowRadius: isPressed ? 4 : 8,
              backgroundColor: 'transparent',
            }}
          />
        )}

        {/* Main button with dark shadow */}
        <TouchableOpacity
          style={[getButtonStyle(), disabled && { opacity: 0.5 }]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={disabled}
          activeOpacity={0.9}
        >
          <Text
            style={[
              styles.text,
              { color: currentColors.text, fontSize: currentSize.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default NeumorphicButton;