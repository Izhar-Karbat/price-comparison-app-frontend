// components/ui/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { designTokens } from '../../theme/designTokens';
    
interface HeaderProps { title: string; subtitle?: string; }
    
const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);
    
const styles = StyleSheet.create({
  container: { paddingHorizontal: designTokens.spacing.lg, paddingTop: designTokens.spacing.xl, paddingBottom: designTokens.spacing.md, backgroundColor: designTokens.colors.background, },
  title: { fontSize: designTokens.typography.size.heading, fontWeight: designTokens.typography.weight.bold, color: designTokens.colors.primary, },
  subtitle: { fontSize: designTokens.typography.size.body, color: designTokens.colors.textSecondary, marginTop: designTokens.spacing.xs, },
});
    
export default Header;