// screens/PriceComparisonScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { designTokens } from '../theme/designTokens';
import { API_URL } from '../config';
import AnimatedSavingsIndicator from '../components/ui/AnimatedSavingsIndicator';

interface PriceData {
  retailer: string;
  storeName: string;
  price: number;
  distance?: number;
  address?: string;
  isLowestPrice?: boolean;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  image?: string;
}

const PriceComparisonScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, productName } = route.params as { productId: string; productName: string };

  const [prices, setPrices] = useState<PriceData[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Calculate savings
  const lowestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices.map(p => p.price)) : 0;
  const potentialSavings = highestPrice - lowestPrice;
  const savingsPercentage = highestPrice > 0 ? Math.round((potentialSavings / highestPrice) * 100) : 0;

  useEffect(() => {
    loadPrices();
    loadRecentSearches();
    saveToRecentSearches(productName);
  }, [productId]);

  const loadPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/search/pharma?product_id=${productId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to our format
        const priceData: PriceData[] = data.prices?.map((item: any, index: number) => ({
          retailer: item.retailername,
          storeName: item.storename,
          price: item.price,
          distance: Math.random() * 5, // Mock distance
          address: `${item.city || 'City'}, ${item.address || 'Address'}`,
          isLowestPrice: index === 0, // Mark first as lowest for now
        })) || [];

        // Sort and mark lowest price
        const sorted = [...priceData].sort((a, b) => a.price - b.price);
        if (sorted.length > 0) {
          sorted[0].isLowestPrice = true;
        }

        setPrices(sorted);
        setProduct({
          id: productId,
          name: productName,
          brand: data.prices?.[0]?.brand || 'Brand',
        });
      }
    } catch (error) {
      console.error('Error loading prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPrices().finally(() => setRefreshing(false));
  }, [productId]);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveToRecentSearches = async (searchTerm: string) => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      let searchArray = searches ? JSON.parse(searches) : [];
      
      // Remove if exists and add to beginning
      searchArray = searchArray.filter((s: string) => s !== searchTerm);
      searchArray.unshift(searchTerm);
      
      // Keep only last 10
      searchArray = searchArray.slice(0, 10);
      
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searchArray));
      setRecentSearches(searchArray);
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const handleSort = () => {
    setSortBy(prev => prev === 'price' ? 'distance' : 'price');
    const sorted = [...prices].sort((a, b) => {
      if (sortBy === 'price') {
        return (a.distance || 0) - (b.distance || 0);
      } else {
        return a.price - b.price;
      }
    });
    setPrices(sorted);
  };

  const renderPriceItem = ({ item }: { item: PriceData }) => (
    <TouchableOpacity style={styles.priceCard}>
      <View style={styles.priceCardHeader}>
        <View>
          <Text style={styles.retailerName}>{item.retailer}</Text>
          <Text style={styles.storeName}>{item.storeName}</Text>
          <Text style={styles.storeAddress}>{item.address}</Text>
        </View>
        {item.isLowestPrice && (
          <View style={styles.bestPriceBadge}>
            <Ionicons name="trophy" size={16} color={designTokens.colors.white} />
            <Text style={styles.bestPriceText}>Best Price</Text>
          </View>
        )}
      </View>
      
      <View style={styles.priceCardFooter}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>₪{item.price.toFixed(2)}</Text>
        </View>
        
        {item.distance && (
          <View style={styles.distanceInfo}>
            <Ionicons name="location-outline" size={16} color={designTokens.colors.textSecondary} />
            <Text style={styles.distanceText}>{item.distance.toFixed(1)} km</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.navigateButton}>
          <Ionicons name="navigate" size={20} color={designTokens.colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderShimmer = () => (
    <View style={styles.shimmerCard}>
      <View style={styles.shimmerLine} />
      <View style={[styles.shimmerLine, { width: '60%' }]} />
      <View style={[styles.shimmerLine, { width: '40%' }]} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color={designTokens.colors.gray.medium} />
      <Text style={styles.emptyTitle}>No Prices Found</Text>
      <Text style={styles.emptySubtitle}>
        We couldn't find any prices for this product. Try searching for a different product.
      </Text>
      <TouchableOpacity 
        style={styles.searchAgainButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.searchAgainText}>Search Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={designTokens.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Price Comparison</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={styles.loadingContainer}>
          {[1, 2, 3, 4].map(i => (
            <View key={i}>{renderShimmer()}</View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (prices.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={designTokens.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Price Comparison</Text>
          <View style={{ width: 24 }} />
        </View>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Price Comparison</Text>
        <TouchableOpacity onPress={handleSort}>
          <Ionicons 
            name={sortBy === 'price' ? 'cash-outline' : 'location-outline'} 
            size={24} 
            color={designTokens.colors.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Savings Hero Section */}
        <View style={styles.savingsHero}>
          <View style={styles.savingsContent}>
            <Text style={styles.savingsLabel}>You could save up to</Text>
            <Text style={styles.savingsAmount}>₪{potentialSavings.toFixed(2)}</Text>
            <Text style={styles.savingsPercentage}>That's {savingsPercentage}% off!</Text>
          </View>
          <AnimatedSavingsIndicator
            originalPrice={highestPrice}
            currentPrice={lowestPrice}
            size="large"
            showAnimation={true}
          />
        </View>

        {/* Product Info */}
        {product && (
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productBrand}>{product.brand}</Text>
          </View>
        )}

        {/* Sort Toggle */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>
            Sorted by: {sortBy === 'price' ? 'Price (Low to High)' : 'Distance (Nearest First)'}
          </Text>
          <TouchableOpacity onPress={handleSort} style={styles.sortButton}>
            <Ionicons name="swap-vertical" size={20} color={designTokens.colors.primary} />
            <Text style={styles.sortButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Price List */}
        <View style={styles.pricesList}>
          {prices.map((item, index) => (
            <View key={index}>{renderPriceItem({ item })}</View>
          ))}
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentChip}
                  onPress={() => {
                    // Navigate to search with this term
                    navigation.navigate('ProductSearch' as never, { searchQuery: search } as never);
                  }}
                >
                  <Text style={styles.recentChipText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    backgroundColor: designTokens.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.cardBorder,
  },
  headerTitle: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
  },
  savingsHero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: designTokens.colors.primary,
    padding: designTokens.spacing.xl,
    margin: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.large,
    ...designTokens.shadows.lg,
  },
  savingsContent: {
    flex: 1,
  },
  savingsLabel: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.white,
    opacity: 0.9,
  },
  savingsAmount: {
    fontSize: designTokens.typography.size.display,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.white,
    marginVertical: designTokens.spacing.xs,
  },
  savingsPercentage: {
    fontSize: designTokens.typography.size.subheading,
    color: designTokens.colors.white,
    opacity: 0.9,
  },
  productInfo: {
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
  },
  productName: {
    fontSize: designTokens.typography.size.xl,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
  },
  productBrand: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xs,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
  },
  sortLabel: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  sortButtonText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.primary,
    fontWeight: designTokens.typography.weight.medium,
  },
  pricesList: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  priceCard: {
    backgroundColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.medium,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
    borderWidth: 1,
    borderColor: designTokens.colors.cardBorder,
    ...designTokens.shadows.sm,
  },
  priceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: designTokens.spacing.md,
  },
  retailerName: {
    fontSize: designTokens.typography.size.subheading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
  },
  storeName: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.xs,
  },
  storeAddress: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.gray.medium,
    marginTop: designTokens.spacing.xs,
  },
  bestPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.success,
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.button,
    gap: designTokens.spacing.xs,
  },
  bestPriceText: {
    fontSize: designTokens.typography.size.small,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.white,
  },
  priceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: designTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.cardBorder,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
  },
  priceValue: {
    fontSize: designTokens.typography.size.xl,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.primary,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  distanceText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
  navigateButton: {
    backgroundColor: designTokens.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...designTokens.shadows.sm,
  },
  loadingContainer: {
    padding: designTokens.spacing.lg,
  },
  shimmerCard: {
    backgroundColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.medium,
    padding: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.md,
  },
  shimmerLine: {
    height: 16,
    backgroundColor: designTokens.colors.gray.light,
    borderRadius: designTokens.borderRadius.small,
    marginBottom: designTokens.spacing.sm,
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: designTokens.spacing.xl,
  },
  emptyTitle: {
    fontSize: designTokens.typography.size.xl,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginTop: designTokens.spacing.lg,
  },
  emptySubtitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    marginTop: designTokens.spacing.sm,
  },
  searchAgainButton: {
    backgroundColor: designTokens.colors.primary,
    paddingHorizontal: designTokens.spacing.xl,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.button,
    marginTop: designTokens.spacing.xl,
  },
  searchAgainText: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.white,
  },
  recentSection: {
    padding: designTokens.spacing.lg,
    marginTop: designTokens.spacing.xl,
  },
  recentTitle: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.md,
  },
  recentChip: {
    backgroundColor: designTokens.colors.cardBackground,
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
    borderRadius: designTokens.borderRadius.button,
    marginRight: designTokens.spacing.sm,
    borderWidth: 1,
    borderColor: designTokens.colors.cardBorder,
  },
  recentChipText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
});

export default PriceComparisonScreen;