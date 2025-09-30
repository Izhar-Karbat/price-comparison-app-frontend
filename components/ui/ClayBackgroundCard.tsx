import React from 'react';
import { View, ImageBackground, StyleSheet, ViewStyle } from 'react-native';

interface ClayBackgroundCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'raised' | 'pressed' | 'flat';
  size?: 'small' | 'medium' | 'large';
}

const ClayBackgroundCard: React.FC<ClayBackgroundCardProps> = ({
  children,
  style,
  variant = 'raised',
  size = 'medium'
}) => {

  // Map to the appropriate shadow image based on variant and size
  const getBackgroundImage = () => {
    // These will be the paths to your pre-rendered shadow images
    const imagePaths = {
      raised: {
        small: require('../../assets/shadows/clay-raised-small.png'),
        medium: require('../../assets/shadows/clay-raised-medium.png'),
        large: require('../../assets/shadows/clay-raised-large.png'),
      },
      pressed: {
        small: require('../../assets/shadows/clay-pressed-small.png'),
        medium: require('../../assets/shadows/clay-pressed-medium.png'),
        large: require('../../assets/shadows/clay-pressed-large.png'),
      },
      flat: {
        small: require('../../assets/shadows/clay-flat-small.png'),
        medium: require('../../assets/shadows/clay-flat-medium.png'),
        large: require('../../assets/shadows/clay-flat-large.png'),
      }
    };

    return imagePaths[variant][size];
  };

  const getSizeStyles = () => {
    switch(size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <View style={[styles.container, getSizeStyles(), style]}>
      <ImageBackground
        source={getBackgroundImage()}
        style={styles.backgroundImage}
        resizeMode="stretch"
      >
        <View style={styles.content}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  small: {
    width: 120,
    height: 60,
  },
  medium: {
    width: 200,
    height: 100,
  },
  large: {
    width: 320,
    height: 160,
  },
  backgroundImage: {
    flex: 1,
    // Add padding to account for shadow area in image
    padding: 20,
  },
  content: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default ClayBackgroundCard;