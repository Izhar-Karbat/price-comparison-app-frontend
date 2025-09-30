import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ClayCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  isPressed?: boolean;
}

const ClayCard: React.FC<ClayCardProps> = ({ children, style, isPressed = false }) => {
  if (isPressed) {
    return (
      <View style={[styles.container, styles.pressed, style]}>
        <View style={styles.innerPressed}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.raised, style]}>
      <View style={styles.innerRaised}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  raised: {
    backgroundColor: '#F7F5F3',
    // Strong shadow for 3D effect
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  innerRaised: {
    backgroundColor: '#F7F5F3',
    borderRadius: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: 'rgba(212, 208, 204, 0.3)',
    borderRightColor: 'rgba(212, 208, 204, 0.3)',
  },
  pressed: {
    backgroundColor: '#ECEAE8',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  innerPressed: {
    backgroundColor: '#ECEAE8',
    borderRadius: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(212, 208, 204, 0.5)',
    borderLeftColor: 'rgba(212, 208, 204, 0.5)',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.6)',
    borderRightColor: 'rgba(255, 255, 255, 0.6)',
  },
});

export default ClayCard;