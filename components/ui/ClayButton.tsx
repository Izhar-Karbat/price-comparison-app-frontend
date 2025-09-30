import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TouchableOpacityProps,
  Platform,
} from 'react-native';
import { claymorphismTheme } from '../../themes/claymorphism';

interface ClayButtonProps extends TouchableOpacityProps {
  children?: React.ReactNode;
  title?: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'raised' | 'pressed' | 'flat';
  isActive?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  title,
  onPress,
  size = 'medium',
  variant = 'raised',
  isActive = false,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  width,
  height,
  borderRadius,
  iconLeft,
  iconRight,
  ...props
}) => {
  const theme = claymorphismTheme;

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          minHeight: 48,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
          minHeight: 56,
        };
      case 'xlarge':
        return {
          paddingVertical: theme.spacing.xl,
          paddingHorizontal: theme.spacing.xxl,
          minHeight: 72,
        };
      default:
        return {};
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: theme.typography.size.small,
        };
      case 'medium':
        return {
          fontSize: theme.typography.size.body,
        };
      case 'large':
        return {
          fontSize: theme.typography.size.large,
        };
      case 'xlarge':
        return {
          fontSize: theme.typography.size.title,
        };
      default:
        return {};
    }
  };

  const buttonStyle: ViewStyle = {
    ...getSizeStyles(),
    backgroundColor: isActive ? theme.colors.buttonPressed : theme.colors.background,
    borderRadius: borderRadius || theme.borderRadius.button,
    width,
    height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const textStyles: TextStyle = {
    ...getTextSize(),
    color: isActive ? theme.colors.primary : theme.colors.textPrimary,
    fontWeight: theme.typography.weight.semibold,
    textAlign: 'center',
    ...textStyle,
  };

  // Create shadow wrapper styles for the claymorphism effect
  const wrapperStyle: ViewStyle = isActive || variant === 'pressed'
    ? {
        shadowColor: '#D4D0CC',
        shadowOffset: {
          width: Platform.OS === 'ios' ? -1 : 1,
          height: Platform.OS === 'ios' ? -1 : 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 1,
      }
    : variant === 'raised'
    ? {
        // Multiple shadows for 3D effect
        shadowColor: '#D4D0CC',
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 5,
      }
    : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.95}
      style={wrapperStyle}
      {...props}
    >
      <View style={[
        buttonStyle,
        isActive || variant === 'pressed' ? styles.pressedInner : styles.raisedInner
      ]}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
          />
        ) : (
          <>
            {iconLeft && (
              <View style={styles.iconLeft}>
                {iconLeft}
              </View>
            )}
            {children || (title && (
              <Text style={textStyles}>
                {title}
              </Text>
            ))}
            {iconRight && (
              <View style={styles.iconRight}>
                {iconRight}
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  raisedInner: {
    // Inner light effect for raised buttons
    borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomColor: 'rgba(212, 208, 204, 0.3)',
    borderRightColor: 'rgba(212, 208, 204, 0.3)',
  },
  pressedInner: {
    // Inner shadow effect for pressed buttons
    borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
    borderColor: 'rgba(212, 208, 204, 0.2)',
    borderTopColor: 'rgba(212, 208, 204, 0.4)',
    borderLeftColor: 'rgba(212, 208, 204, 0.4)',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default ClayButton;