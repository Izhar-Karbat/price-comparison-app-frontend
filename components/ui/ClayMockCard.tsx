import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ClayMockCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'raised' | 'pressed';
}

// This uses gradients to simulate the claymorphism effect until we have real images
const ClayMockCard: React.FC<ClayMockCardProps> = ({
  children,
  style,
  variant = 'raised'
}) => {
  if (variant === 'pressed') {
    return (
      <View style={[styles.container, style]}>
        {/* Dark inner shadow simulation */}
        <LinearGradient
          colors={['rgba(212, 208, 204, 0.4)', 'rgba(247, 245, 243, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pressedOuter}
        >
          <LinearGradient
            colors={['#ECEAE8', '#F2EFEC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pressedInner}
          >
            {children}
          </LinearGradient>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.raisedShadow, style]}>
      {/* Light top-left highlight */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(247, 245, 243, 0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={styles.raisedHighlight}
      >
        <View style={styles.raisedMain}>
          <LinearGradient
            colors={['#F9F7F5', '#F5F3F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.raisedInner}
          >
            {children}
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
  },
  // Raised styles
  raisedShadow: {
    backgroundColor: '#F7F5F3',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  raisedHighlight: {
    borderRadius: 20,
    padding: 1,
  },
  raisedMain: {
    borderRadius: 19,
    backgroundColor: '#F7F5F3',
    // Create inner bevel effect
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.6)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(212, 208, 204, 0.2)',
    borderRightColor: 'rgba(212, 208, 204, 0.2)',
  },
  raisedInner: {
    borderRadius: 18,
    padding: 20,
  },
  // Pressed styles
  pressedOuter: {
    borderRadius: 20,
    padding: 2,
  },
  pressedInner: {
    borderRadius: 18,
    padding: 20,
    // Reverse bevel for pressed effect
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(212, 208, 204, 0.3)',
    borderLeftColor: 'rgba(212, 208, 204, 0.3)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    borderRightColor: 'rgba(255, 255, 255, 0.4)',
  },
});

export default ClayMockCard;