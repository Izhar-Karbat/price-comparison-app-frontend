// src/components/product/ProductCardSkeleton.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../ui/Skeleton';
import { useTheme } from '../../context/ThemeContext';

const ProductCardSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
      <Skeleton width={80} height={80} />
      <View style={styles.infoContainer}>
        <Skeleton width={100} height={16} />
        <View style={{ height: 8 }} />
        <Skeleton width="80%" height={20} />
        <View style={styles.bottomRow}>
          <Skeleton width={60} height={24} />
          <Skeleton width={40} height={40} style={{ borderRadius: 20 }}/>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default ProductCardSkeleton;