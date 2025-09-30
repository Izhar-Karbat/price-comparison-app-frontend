// components/product/HealthScoreBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const getScoreColor = (score: string | number, theme: any) => {
  const numericScore = typeof score === 'string' ? score.charCodeAt(0) - 64 : score;
  if (numericScore > 85 || score === 'A') return theme.colors.success;
  if (numericScore > 65 || score === 'B') return theme.colors.warning;
  return theme.colors.error;
};

const HealthScoreBadge: React.FC<{ score: any, size?: 'large' }> = ({ score, size }) => {
  const { theme } = useTheme();
  const isLarge = size === 'large';
  return (
    <View style={[ styles.badge, isLarge && styles.largeBadge, { backgroundColor: getScoreColor(score, theme) }]}>
      <Text style={[styles.text, isLarge && styles.largeText, { color: theme.colors.white }]}>{score}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  badge: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  largeBadge: { width: 60, height: 60, borderRadius: 30 },
  text: { fontSize: 18, fontWeight: 'bold' },
  largeText: { fontSize: 24 },
});
export default HealthScoreBadge;