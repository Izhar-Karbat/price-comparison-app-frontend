import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';

interface NeumorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'raised' | 'pressed' | 'flat';
  intensity?: 'light' | 'medium' | 'strong';
}

const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  style,
  variant = 'raised',
  intensity = 'medium'
}) => {
  const getIntensityStyles = () => {
    const intensities = {
      light: {
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      },
      medium: {
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
      },
      strong: {
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 9,
      }
    };
    return intensities[intensity];
  };

  const getVariantStyles = (): ViewStyle[] => {
    const intensityStyle = getIntensityStyles();

    if (variant === 'pressed') {
      return [
        {
          backgroundColor: '#ECEAE8',
        },
        styles.pressedInner,
      ];
    }

    if (variant === 'flat') {
      return [
        {
          backgroundColor: '#F7F5F3',
        }
      ];
    }

    // Raised variant - create dual shadows
    return [
      {
        backgroundColor: '#F7F5F3',
      },
      // Dark shadow (bottom-right)
      {
        ...Platform.select({
          ios: {
            shadowColor: '#C8C4C0',
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: intensityStyle.shadowOpacity * 2,
            shadowRadius: intensityStyle.shadowRadius,
          },
          android: {
            elevation: intensityStyle.elevation,
          },
        }),
      },
      styles.raisedBorder,
    ];
  };

  return (
    <View style={[styles.wrapper, style]}>
      {/* Light shadow (top-left) - iOS only as Android doesn't support multiple shadows */}
      {variant === 'raised' && Platform.OS === 'ios' && (
        <View style={[styles.lightShadow, getIntensityStyles()]} />
      )}

      {/* Main card */}
      <View style={[styles.container, ...getVariantStyles()]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    borderRadius: 20,
    padding: 20,
  },
  lightShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    backgroundColor: '#F7F5F3',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  raisedBorder: {
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomColor: 'rgba(200, 196, 192, 0.1)',
    borderRightColor: 'rgba(200, 196, 192, 0.1)',
  },
  pressedInner: {
    borderWidth: 1,
    borderTopColor: 'rgba(200, 196, 192, 0.2)',
    borderLeftColor: 'rgba(200, 196, 192, 0.2)',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default NeumorphicCard;