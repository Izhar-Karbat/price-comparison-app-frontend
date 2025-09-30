// screens/SavedItemsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { designTokens } from '../theme/designTokens';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';
import { mockTrendingProducts } from '../data/mock-data';

const SavedItemsScreen = () => {
  const savedItems = mockTrendingProducts.slice(0, 3); // Mock saved items
  
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💾</Text>
      <Text style={styles.emptyTitle}>No Saved Items</Text>
      <Text style={styles.emptySubtitle}>Items you save will appear here</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {savedItems.length > 0 ? (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.masterproductid}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => console.log('Product pressed:', item.productName)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  listContent: {
    padding: designTokens.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: designTokens.spacing.lg,
  },
  emptyTitle: {
    fontSize: designTokens.typography.size.title,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.sm,
  },
  emptySubtitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
  },
});

export default SavedItemsScreen;