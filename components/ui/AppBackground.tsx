import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewStyle } from 'react-native';

interface AppBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({ children, style }) => (
  <LinearGradient
    colors={['#FFE5EC', '#E8F5E9']} // Soft pink to soft green
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[styles.gradient, style]}
  >
    {children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});