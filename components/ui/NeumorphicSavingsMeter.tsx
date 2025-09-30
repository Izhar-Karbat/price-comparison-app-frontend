import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { Shadow } from 'react-native-shadow-2';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface NeumorphicSavingsMeterProps {
  savedAmount?: number;
  progress?: number;
  size?: number;
}

const NeumorphicSavingsMeter: React.FC<NeumorphicSavingsMeterProps> = ({
  savedAmount = 3345,
  progress = 0.7,
  size = 200,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  // Enhanced neumorphic styles with dual shadows
  const getNeumorphicStyle = () => {
    if (Platform.OS === 'ios') {
      return {
        backgroundColor: '#F7F5F3',
        borderRadius: size / 2,
        // Main dark shadow (bottom-right)
        shadowColor: '#D4D0CC',
        shadowOffset: { width: 12, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      };
    } else {
      return {
        backgroundColor: '#F7F5F3',
        borderRadius: size / 2,
        elevation: 15,
      };
    }
  };

  // Light highlight shadow (top-left) - iOS only
  const getLightHighlight = () => ({
    position: 'absolute' as const,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: 'transparent',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    pointerEvents: 'none' as const,
  });

  // Enhanced heart button with stronger neumorphic effect
  const getHeartButtonStyle = () => {
    const baseStyle = {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#8FBF9F',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginBottom: 10,
    };

    if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: '#6B9B75',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      };
    } else {
      return {
        ...baseStyle,
        elevation: 8,
      };
    }
  };

  // Enhanced container with dual-shadow neumorphic effect
  const NeumorphicContainer = Platform.OS === 'android'
    ? ({ children, style }: any) => (
        <Shadow
          distance={15}
          startColor={'#D4D0CC60'}
          endColor={'#D4D0CC20'}
          offset={[12, 12]}
          paintInside={true}
          sides={['bottom', 'right']}
          corners={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
          style={[{ borderRadius: size / 2 }, style]}
        >
          <View style={[{ backgroundColor: '#F7F5F3', borderRadius: size / 2 }, style]}>
            {children}
          </View>
        </Shadow>
      )
    : ({ children, style }: any) => (
        <View style={[{ position: 'relative' }, style]}>
          {/* Light highlight layer */}
          <View style={getLightHighlight()} />
          {/* Main container with dark shadow */}
          <View style={[getNeumorphicStyle(), { width: size, height: size }]}>
            {children}
          </View>
        </View>
      );

  return (
    <View style={styles.container}>
      <NeumorphicContainer style={styles.meterContainer}>
        {/* Progress Ring SVG */}
        <Svg width={size} height={size} style={styles.progressSvg}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E8E5E2"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#8FBF9F"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            {/* Yellow accent arc */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 8}
              stroke="#F7E6A3"
              strokeWidth={3}
              fill="none"
              strokeDasharray={`${circumference * 0.1} ${circumference * 0.9}`}
              strokeDashoffset={0}
              opacity={0.7}
            />
          </G>
        </Svg>

        {/* Center content */}
        <View style={styles.centerContent}>
          {/* Heart button with enhanced shadow */}
          <View style={getHeartButtonStyle()}>
            {Platform.OS === 'ios' && (
              <View style={{
                position: 'absolute',
                width: 40,
                height: 40,
                borderRadius: 20,
                shadowColor: '#FFFFFF',
                shadowOffset: { width: -2, height: -2 },
                shadowOpacity: 0.6,
                shadowRadius: 4,
              }} />
            )}
            <Ionicons name="heart" size={22} color="white" />
          </View>

          {/* Enhanced savings text with subtle shadow */}
          <Text style={styles.savingsNumber}>{savedAmount}</Text>
          <Text style={styles.savingsLabel}>saved</Text>
        </View>
      </NeumorphicContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 30,
  },
  meterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressSvg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
  },
  savingsNumber: {
    fontSize: 52,
    fontWeight: '800',
    color: '#3A3937',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 3,
  },
  savingsLabel: {
    fontSize: 18,
    color: '#8A8680',
    marginTop: 5,
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: -0.5, height: -0.5 },
    textShadowRadius: 1,
  },
});

export default NeumorphicSavingsMeter;