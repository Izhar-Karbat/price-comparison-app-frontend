import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import QuickViewModal from '../components/product/QuickViewModal';
import { Product } from '../types';

// --- Inlined dependencies ---
const designTokens = {
  colors: {
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    primary: '#007BFF',
    danger: '#DC3545',
    text: '#212529',
    textSecondary: '#6C757D',
    gray: {
      light: '#E9ECEF',
      medium: '#CED4DA',
      dark: '#6C757D',
    },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, },
  borderRadius: { medium: 8, },
  typography: {
    size: { caption: 12, small: 14, body: 16, },
    weight: { semibold: '600' as '600', bold: '700' as '700', },
  },
};

// Import the type from App.tsx
import type { RootStackParamList } from '../App';

const API_URL = 'http://localhost:8000';

interface AggregatedProduct {
  product_id: number;
  productname: string;
  brand: string;
  imageurl: string | null;
  price: number | null;
  store_count: number;
  attributes: {
    size_value: string;
    size_unit: string;
  } | null;
}

type ProductSearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductSearch'>;
type ProductSearchScreenRouteProp = RouteProp<RootStackParamList, 'ProductSearch'>;

interface SearchResultItemProps {
  item: AggregatedProduct;
  onPress: (item: AggregatedProduct) => void;
}

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/80x80.png?text=No+Image';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// Calculate relevance score for search results
const calculateRelevanceScore = (productName: string, query: string): number => {
  const nameLower = productName.toLowerCase();
  let score = 0;

  // Exact match bonus
  if (nameLower === query) {
    score += 100;
  }

  // Starts with query bonus
  if (nameLower.startsWith(query)) {
    score += 50;
  }

  // Contains query bonus
  if (nameLower.includes(query)) {
    score += 25;
  }

  // Word match bonus - check if any word in the product name matches the query
  const words = nameLower.split(/\s+/);
  const queryWords = query.split(/\s+/);

  for (const queryWord of queryWords) {
    for (const word of words) {
      if (word === queryWord) {
        score += 20;
      } else if (word.startsWith(queryWord)) {
        score += 10;
      } else if (word.includes(queryWord)) {
        score += 5;
      }
    }
  }

  // Penalty for very long names (less relevant)
  if (productName.length > 100) {
    score -= 5;
  }

  return score;
};

const SearchResultItem = React.memo<SearchResultItemProps>(({ item, onPress }) => {
  const priceDisplay = item.price ? `From ₪${item.price.toFixed(2)}` : 'Price N/A';
  const sizeDisplay = item.attributes?.size_value ? `Size: ${item.attributes.size_value} ${item.attributes.size_unit || ''}` : null;
  const storeCountDisplay = item.store_count > 0 ? `in ${item.store_count} stores` : null;
  
  // Check for multi-retailer data (if you've enhanced the backend response)
  const retailerCount = (item as any).retailer_count || 1;
  const retailers = (item as any).retailers || [];

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(item)}>
      <Image
        source={{ uri: item.imageurl || FALLBACK_IMAGE_URL }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.productname || 'Unnamed Product'}</Text>
        <Text style={styles.itemBrand} numberOfLines={1}>Brand: {item.brand || 'N/A'}</Text>
        {sizeDisplay && <Text style={styles.itemSize} numberOfLines={1}>{sizeDisplay}</Text>}
        
        {/* Multi-retailer badge */}
        {retailerCount > 1 && (
          <View style={styles.multiRetailerBadge}>
            <Text style={styles.multiRetailerText}>
              Available at {retailerCount} retailers
            </Text>
          </View>
        )}
        
        {/* Retailers list */}
        {retailers.length > 0 && (
          <Text style={styles.retailersList} numberOfLines={1}>
            {retailers.join(' • ')}
          </Text>
        )}
        
        <View style={styles.priceSection}>
          <Text style={styles.itemPrice}>{priceDisplay}</Text>
          {storeCountDisplay && <Text style={styles.itemRetailer} numberOfLines={1}>{storeCountDisplay}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward-outline" size={22} color={designTokens.colors.gray.medium} />
    </TouchableOpacity>
  );
});

export default function ProductSearchScreen() {
  const route = useRoute<ProductSearchScreenRouteProp>();
  const navigation = useNavigation<ProductSearchScreenNavigationProp>();

  const initialParams = route.params || {};
  const initialQuery = initialParams.searchQuery || '';

  const [currentSearchQuery, setCurrentSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<AggregatedProduct[]>([]);
  const [allResults, setAllResults] = useState<AggregatedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const initialLoadPerformedRef = useRef(false);

  const debouncedSearchQuery = useDebounce(currentSearchQuery, 300);

  const fetchSearchResults = useCallback(async (queryToFetch: string) => {
    if (!queryToFetch || queryToFetch.length < 2) {
      setSearchResults([]);
      setError(queryToFetch ? 'Search query must be at least 2 characters.' : null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSearchResults([]);
    setError(null);
    const endpoint = `${API_URL}/api/search?q=${encodeURIComponent(queryToFetch)}&limit=50`;
    try {
      console.log('🚀 [SEARCH] Fetching:', endpoint);
      const response = await fetch(endpoint);
      console.log('🚀 [SEARCH] Response status:', response.status, response.ok);

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const data = await response.json();
      console.log('🚀 [SEARCH] Response data:', data);
      console.log('🚀 [SEARCH] Data type:', typeof data, 'Is Array:', Array.isArray(data));

      // Your backend returns an array directly, not wrapped in {products: []}
      if (Array.isArray(data)) {
        // Transform and sort by relevance
        const transformedData = data
          .map((item, index) => {
            // Calculate lowest price from prices array
            let lowestPrice = null;
            let storeCount = 0;

            if (item.prices && Array.isArray(item.prices) && item.prices.length > 0) {
              // Get unique stores and find lowest price
              const uniqueStores = new Set(item.prices.map((p: any) => p.store_id));
              storeCount = uniqueStores.size;
              lowestPrice = Math.min(...item.prices.map((p: any) => p.price));
            }

            return {
              product_id: index + 1, // Use index as product_id since backend uses barcode
              productname: item.name || 'Unknown Product',
              brand: item.brand || 'Unknown Brand',
              imageurl: item.image_url || null,
              price: lowestPrice,
              store_count: storeCount,
              attributes: null, // Backend doesn't provide this
              barcode: item.barcode, // Keep original barcode
              prices: item.prices || [], // Keep the full prices array
              originalData: item // Keep original data for reference
            };
          })
          .sort((a, b) => {
            // Calculate relevance score based on how well the name matches the query
            const queryLower = queryToFetch.toLowerCase();

            const scoreA = calculateRelevanceScore(a.productname, queryLower);
            const scoreB = calculateRelevanceScore(b.productname, queryLower);

            // Higher score = more relevant = should appear first
            return scoreB - scoreA;
          });

        // Store all results and show only first 10
        setAllResults(transformedData);
        const limitedResults = transformedData.slice(0, 10);
        setSearchResults(limitedResults);
        setCanLoadMore(transformedData.length > 10);

        if (transformedData.length === 0) {
          setError(`No products found for "${queryToFetch}".`);
        }
      } else if (data.products && Array.isArray(data.products)) {
        setSearchResults(data.products);
        if (data.products.length === 0) {
          setError(`No products found for "${queryToFetch}".`);
        }
      } else {
        console.log('🚀 [SEARCH] Invalid data structure:', data);
        setSearchResults([]);
        setError('Received invalid data structure from server.');
      }
    } catch (e) {
      console.log('🚀 [SEARCH] Error:', e);
      setError(e instanceof Error ? e.message : 'An error occurred while searching.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (canLoadMore && allResults.length > searchResults.length) {
      const currentLength = searchResults.length;
      const nextBatch = allResults.slice(currentLength, currentLength + 10);
      setSearchResults(prev => [...prev, ...nextBatch]);
      setCanLoadMore(allResults.length > currentLength + 10);
    }
  }, [allResults, searchResults, canLoadMore]);

  useEffect(() => {
    if (initialQuery && !initialLoadPerformedRef.current) {
      setCurrentSearchQuery(initialQuery);
      initialLoadPerformedRef.current = true;
    }
  }, [initialQuery]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchSearchResults(debouncedSearchQuery);
    } else {
      setSearchResults([]);
      setError(null);
    }
  }, [debouncedSearchQuery, fetchSearchResults]);

  // Open modal instead of navigating to ProductDetails
  const handleProductPress = (product: AggregatedProduct) => {
    // Transform to match Product type for modal
    // Use the actual prices data from the backend
    const pricesData = (product as any).prices || (product as any).originalData?.prices || [];

    const productForModal: Product = {
      product_id: (product as any).barcode || product.product_id,
      masterproductid: (product as any).barcode || product.product_id.toString(),
      name: product.productname,
      brand: product.brand || 'Unknown Brand',
      image_url: product.imageurl || '',
      description: product.productname,
      prices: pricesData.length > 0 ? pricesData.map((p: any) => ({
        retailer_name: p.retailer_name || 'Unknown Retailer',
        store_name: p.store_name || 'Store',
        price: p.price,
        store_address: p.store_address,
        updated_at: p.last_updated || new Date().toISOString()
      })) : [],
      price_range: {
        min: product.price || 0,
        max: product.price || 0,
      },
      images: product.imageurl ? [product.imageurl] : [],
      category: 'Pharmacy',
    } as Product;

    setSelectedProduct(productForModal);
    setModalVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.searchHeaderContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={28} color={designTokens.colors.primary} />
      </TouchableOpacity>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search-outline" size={20} color={designTokens.colors.gray.dark} style={styles.searchIcon} />
        <TextInput
          style={styles.headerSearchInput}
          placeholder="Search pharmacy products..."
          placeholderTextColor={designTokens.colors.gray.dark}
          value={currentSearchQuery}
          onChangeText={setCurrentSearchQuery}
          autoFocus={!initialQuery}
          returnKeyType="search"
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color={designTokens.colors.primary}
            style={styles.loadingIndicator}
          />
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Ionicons name="warning-outline" size={40} color={designTokens.colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    if (searchResults.length > 0) {
      return (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => <SearchResultItem item={item} onPress={handleProductPress} />}
          keyExtractor={(item) => item.product_id.toString()}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            canLoadMore ? (
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
                <Text style={styles.loadMoreText}>Load More ({allResults.length - searchResults.length} remaining)</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      );
    }
    if (loading) {
        return (
            <View style={styles.centeredMessageContainer}>
                <ActivityIndicator size="large" color={designTokens.colors.primary} />
                <Text style={styles.messageText}>Searching...</Text>
            </View>
        );
    }
    if (debouncedSearchQuery) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Ionicons name="information-circle-outline" size={40} color={designTokens.colors.gray.dark} />
          <Text style={styles.messageText}>
            No pharmacy products found for "{debouncedSearchQuery}".
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.centeredMessageContainer}>
        <Ionicons name="search-circle-outline" size={40} color={designTokens.colors.gray.dark} />
        <Text style={styles.messageText}>Start typing to search for pharmacy products</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {searchResults.length > 0 && !error && (
        <Text style={styles.resultsInfoText}>
          {searchResults.length} results for "{debouncedSearchQuery}"
        </Text>
      )}
      {renderContent()}

      {/* Product Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedProduct(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: designTokens.colors.background, },
  searchHeaderContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: designTokens.spacing.sm, paddingVertical: designTokens.spacing.sm, backgroundColor: designTokens.colors.cardBackground, borderBottomWidth: 1, borderBottomColor: designTokens.colors.gray.light, },
  backButton: { padding: designTokens.spacing.xs, marginRight: designTokens.spacing.xs, },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: designTokens.colors.gray.light, borderRadius: 20, paddingHorizontal: designTokens.spacing.md, },
  searchIcon: { marginRight: designTokens.spacing.sm, },
  headerSearchInput: { flex: 1, height: 40, fontSize: designTokens.typography.size.body, color: designTokens.colors.text, },
  loadingIndicator: { marginLeft: designTokens.spacing.sm, },
  centeredMessageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: designTokens.spacing.lg, },
  messageText: { marginTop: designTokens.spacing.sm, fontSize: designTokens.typography.size.body, color: designTokens.colors.textSecondary, textAlign: 'center', },
  errorText: { marginTop: designTokens.spacing.sm, fontSize: designTokens.typography.size.body, color: designTokens.colors.danger, textAlign: 'center', },
  resultsInfoText: { fontSize: designTokens.typography.size.small, color: designTokens.colors.textSecondary, paddingHorizontal: designTokens.spacing.md, paddingVertical: designTokens.spacing.sm, textAlign: 'center', backgroundColor: designTokens.colors.cardBackground, borderBottomWidth: 1, borderBottomColor: designTokens.colors.gray.light, },
  listContentContainer: { paddingBottom: Platform.OS === 'ios' ? 20 : 30, },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: designTokens.colors.cardBackground, paddingVertical: designTokens.spacing.sm, paddingHorizontal: designTokens.spacing.md, borderBottomWidth: 1, borderBottomColor: designTokens.colors.gray.light, },
  itemImage: { width: 70, height: 70, borderRadius: designTokens.borderRadius.medium, marginRight: designTokens.spacing.md, backgroundColor: designTokens.colors.gray.light, },
  itemDetails: { flex: 1, justifyContent: 'center', },
  itemName: { fontSize: designTokens.typography.size.body, fontWeight: designTokens.typography.weight.semibold, color: designTokens.colors.text, marginBottom: 2, },
  itemBrand: { fontSize: designTokens.typography.size.caption, color: designTokens.colors.textSecondary, marginBottom: 2, },
  itemSize: { fontSize: designTokens.typography.size.caption, color: designTokens.colors.textSecondary, marginBottom: 4, },
  priceSection: { marginTop: 4, },
  itemRetailer: { fontSize: designTokens.typography.size.caption, color: designTokens.colors.textSecondary, marginBottom: 4, },
  itemPrice: { fontSize: designTokens.typography.size.body, fontWeight: designTokens.typography.weight.bold, color: designTokens.colors.primary, },
  multiRetailerBadge: { backgroundColor: designTokens.colors.primary, paddingHorizontal: designTokens.spacing.xs, paddingVertical: 2, borderRadius: 4, marginVertical: 2, alignSelf: 'flex-start', },
  multiRetailerText: { fontSize: 10, fontWeight: designTokens.typography.weight.semibold, color: designTokens.colors.cardBackground, },
  retailersList: { fontSize: designTokens.typography.size.caption, color: designTokens.colors.textSecondary, fontWeight: designTokens.typography.weight.semibold, marginBottom: 2, },
  loadMoreButton: { backgroundColor: designTokens.colors.primary, margin: 16, padding: 12, borderRadius: 8, alignItems: 'center', },
  loadMoreText: { color: designTokens.colors.cardBackground, fontSize: designTokens.typography.size.body, fontWeight: designTokens.typography.weight.semibold, },
});