// src/components/ui/Skeleton.tsx
import React from 'react';
import { MotiView } from 'moti';
import { StyleSheet, View, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  width: DimensionValue;
  height: DimensionValue;
  style?: ViewStyle;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, style }) => {
  const { theme } = useTheme();
  // Convert width to number for animation, fallback to 100 if null/undefined
  const animationWidth = typeof width === 'number' ? width : 100;

  return (
    <View style={[{ width, height, backgroundColor: theme.colors.gray.light, overflow: 'hidden', borderRadius: 4 }, style]}>
      <MotiView
        from={{ translateX: -animationWidth }}
        animate={{ translateX: animationWidth }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1000,
          delay: 200,
        }}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.gray.medium, opacity: 0.5 }]}
      />
    </View>
  );
};

export default Skeleton;