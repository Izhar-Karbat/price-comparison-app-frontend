import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageBackground } from 'react-native';

interface NeumorphicImageCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'raised' | 'pressed';
  width?: number;
  height?: number;
}

const NeumorphicImageCard: React.FC<NeumorphicImageCardProps> = ({
  children,
  style,
  variant = 'raised',
  width = 320,
  height = 160,
}) => {
  // Use the raised image for both variants for now
  // You can add a pressed variant later if needed
  const shadowImage = require('../../assets/shadows/neumorphic-raised.png');

  return (
    <View style={[styles.container, { width, height }, style]}>
      <ImageBackground
        source={shadowImage}
        style={styles.shadowImage}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: '85%',  // Adjust based on your shadow padding
    height: '85%', // Adjust based on your shadow padding
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NeumorphicImageCard;