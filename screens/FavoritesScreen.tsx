// screens/FavoritesScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { designTokens } from '../theme/designTokens';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { RootStackParamList } from '../App';

import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, removeFavorite, clearFavorites, isLoading } = useFavorites();
  const { addToCart } = useCart();

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', {
      productId: product.product_id?.toString() || product.masterproductid || '1',
      productData: product,
    });
  };

  const handleRemoveFromFavorites = (product: Product) => {
    Alert.alert(
      'Remove from Favorites',
      `Remove "${product.name || product.productName}" from your favorites?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const productId = product.product_id?.toString() || product.masterproductid || '0';
            removeFavorite(productId);
          },
        },
      ]
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all products from your favorites? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearFavorites,
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => (
    <View style={styles.productCardWrapper}>
      <ProductCard
        product={item}
        onPress={handleProductPress}
      />
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="cart-outline" size={20} color={designTokens.colors.primary} />
          <Text style={styles.actionText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          onPress={() => handleRemoveFromFavorites(item)}
        >
          <Ionicons name="heart-dislike-outline" size={20} color={designTokens.colors.danger} />
          <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="heart-outline"
        size={80}
        color={designTokens.colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Products you save will appear here for easy access and price tracking.
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('ProductSearch', { searchQuery: '' })}
      >
        <Text style={styles.exploreButtonText}>Explore Products</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map((index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
        </View>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length} {favorites.length === 1 ? 'product' : 'products'} saved
        </Text>
        {favorites.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={20} color={designTokens.colors.danger} />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item, index) => item.product_id?.toString() || item.masterproductid || `favorite-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  header: {
    backgroundColor: designTokens.colors.white,
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.cardBorder,
    ...designTokens.shadows.sm,
  },
  title: {
    fontSize: designTokens.typography.size.display,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xs,
  },
  subtitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.dangerLight,
    borderRadius: designTokens.borderRadius.button,
  },
  clearButtonText: {
    color: designTokens.colors.danger,
    fontSize: designTokens.typography.size.small,
    fontWeight: designTokens.typography.weight.semibold,
    marginLeft: designTokens.spacing.xs,
  },
  listContainer: {
    padding: designTokens.spacing.md,
  },
  productCardWrapper: {
    marginBottom: designTokens.spacing.md,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: designTokens.spacing.md,
    paddingTop: designTokens.spacing.sm,
    gap: designTokens.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    backgroundColor: designTokens.colors.primaryAlpha,
    borderRadius: designTokens.borderRadius.button,
  },
  removeButton: {
    backgroundColor: designTokens.colors.dangerLight,
  },
  actionText: {
    color: designTokens.colors.primary,
    fontSize: designTokens.typography.size.small,
    fontWeight: designTokens.typography.weight.semibold,
    marginLeft: designTokens.spacing.xs,
  },
  removeText: {
    color: designTokens.colors.danger,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl,
  },
  emptyTitle: {
    fontSize: designTokens.typography.size.heading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
  },
  emptySubtitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: designTokens.spacing.xl,
  },
  exploreButton: {
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.button,
    ...designTokens.shadows.primary,
  },
  exploreButtonText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.button,
    fontWeight: designTokens.typography.weight.bold,
  },
  loadingContainer: {
    padding: designTokens.spacing.md,
  },
});

export default FavoritesScreen;