import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
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

interface NeumorphicBottomNavProps {
  onListPress?: () => void;
  onScanPress?: () => void;
  onHeartPress?: () => void;
  activeTab?: 'list' | 'scan' | 'heart';
}

const NeumorphicBottomNav: React.FC<NeumorphicBottomNavProps> = ({
  onListPress,
  onScanPress,
  onHeartPress,
  activeTab = 'scan',
}) => {
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const listScale = useSharedValue(1);
  const scanScale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  // Standard nav button style
  const getNavButtonStyle = (isPressed: boolean) => {
    const baseStyle = {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#F7F5F3',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };

    if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: isPressed ? '#D4D0CC' : '#D4D0CC',
        shadowOffset: isPressed
          ? { width: 3, height: 3 }
          : { width: 6, height: 6 },
        shadowOpacity: isPressed ? 0.3 : 0.4,
        shadowRadius: isPressed ? 4 : 8,
      };
    } else {
      return {
        ...baseStyle,
        elevation: isPressed ? 4 : 8,
      };
    }
  };

  // Center scan button style (larger and more prominent)
  const getCenterButtonStyle = (isPressed: boolean) => {
    const baseStyle = {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#F7F5F3',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };

    if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: isPressed ? '#D4D0CC' : '#D4D0CC',
        shadowOffset: isPressed
          ? { width: 4, height: 4 }
          : { width: 8, height: 8 },
        shadowOpacity: isPressed ? 0.35 : 0.45,
        shadowRadius: isPressed ? 6 : 12,
      };
    } else {
      return {
        ...baseStyle,
        elevation: isPressed ? 6 : 12,
      };
    }
  };

  // Light highlight for buttons (iOS only)
  const getButtonHighlight = (size: number, isPressed: boolean) => ({
    position: 'absolute' as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: 'transparent',
    shadowColor: '#FFFFFF',
    shadowOffset: isPressed
      ? { width: -2, height: -2 }
      : { width: -4, height: -4 },
    shadowOpacity: isPressed ? 0.3 : 0.6,
    shadowRadius: isPressed ? 3 : 6,
    pointerEvents: 'none' as const,
  });

  const createButtonHandlers = (buttonType: 'list' | 'scan' | 'heart', onPress?: () => void) => {
    const scaleValue = buttonType === 'list' ? listScale : buttonType === 'scan' ? scanScale : heartScale;

    return {
      onPressIn: () => {
        setPressedButton(buttonType);
        scaleValue.value = withTiming(0.95, { duration: 100 });
        runOnJS(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        })();
      },
      onPressOut: () => {
        setPressedButton(null);
        scaleValue.value = withTiming(1, { duration: 150 });
      },
      onPress: () => {
        if (onPress) {
          onPress();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      },
    };
  };

  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: listScale.value }],
  }));

  const scanAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const getIconColor = (buttonType: string) => {
    if (activeTab === buttonType) {
      return '#8FBF9F';
    }
    return '#8A8680';
  };

  // Render button with platform-specific shadows
  const renderButton = (
    buttonType: 'list' | 'scan' | 'heart',
    iconName: any,
    iconSize: number,
    isCenter: boolean = false,
    animatedStyle: any,
    handlers: any
  ) => {
    const isPressed = pressedButton === buttonType;
    const buttonStyle = isCenter
      ? getCenterButtonStyle(isPressed)
      : getNavButtonStyle(isPressed);
    const highlightSize = isCenter ? 64 : 50;

    if (Platform.OS === 'android') {
      return (
        <Animated.View key={buttonType} style={animatedStyle}>
          <Shadow
            distance={isPressed ? (isCenter ? 6 : 4) : (isCenter ? 12 : 8)}
            startColor={'#D4D0CC60'}
            endColor={'#D4D0CC20'}
            offset={isPressed
              ? (isCenter ? [4, 4] : [3, 3])
              : (isCenter ? [8, 8] : [6, 6])
            }
            paintInside={false}
            sides={['bottom', 'right']}
            corners={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
            style={{ borderRadius: highlightSize / 2 }}
          >
            <TouchableOpacity
              style={buttonStyle}
              {...handlers}
            >
              <Ionicons
                name={iconName}
                size={iconSize}
                color={getIconColor(buttonType)}
              />
            </TouchableOpacity>
          </Shadow>
        </Animated.View>
      );
    }

    // iOS version with dual shadows
    return (
      <Animated.View key={buttonType} style={animatedStyle}>
        <View style={{ position: 'relative' }}>
          {/* Light highlight shadow */}
          <View style={getButtonHighlight(highlightSize, isPressed)} />

          {/* Main button with dark shadow */}
          <TouchableOpacity
            style={buttonStyle}
            {...handlers}
          >
            <Ionicons
              name={iconName}
              size={iconSize}
              color={getIconColor(buttonType)}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderButton(
        'list',
        'list',
        24,
        false,
        listAnimatedStyle,
        createButtonHandlers('list', onListPress)
      )}

      {renderButton(
        'scan',
        'scan',
        28,
        true,
        scanAnimatedStyle,
        createButtonHandlers('scan', onScanPress)
      )}

      {renderButton(
        'heart',
        'heart-outline',
        24,
        false,
        heartAnimatedStyle,
        createButtonHandlers('heart', onHeartPress)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F7F5F3',
    paddingVertical: 20,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: '#E8E5E2',
  },
});

export default NeumorphicBottomNav;