import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_URL } from '../config'; //

const ITEMS_PER_PAGE = 20;
const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/80x80.png?text=No+Image';

const SearchResultItem = React.memo(({ item, onPress }) => {
  // Use 'image_url' from backend schema, fallback to 'imageurl' if older data structure
  const imageUrl = (item.image_url && item.image_url.startsWith('http') ? item.image_url : item.imageurl && item.imageurl.startsWith('http') ? item.imageurl : FALLBACK_IMAGE_URL);
  
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(item)}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.itemImage} 
        onError={(e) => console.log("[SearchResultItem] Image load error:", item.image_url || item.imageurl, e.nativeEvent.error)} 
      />
      <View style={styles.itemDetails}>
        {/* Use 'productname' and 'brand' from backend schema */}
        <Text style={styles.itemName} numberOfLines={2}>{item.productname || 'N/A'}</Text>
        {item.brand && <Text style={styles.itemBrand} numberOfLines={1}>Brand: {item.brand}</Text>}
        {/* 'storename' and 'retailername' from backend schema */}
        <Text style={styles.itemRetailer} numberOfLines={1}>
          At: {item.storename || 'N/A'} ({item.retailername || 'Unknown Retailer'})
        </Text>
        {/* 'price' from backend schema (previously current_price) */}
        {item.price !== null && item.price !== undefined ? (
          <Text style={styles.itemPrice}>₪{parseFloat(item.price).toFixed(2)}</Text>
        ) : (
          <Text style={styles.itemPrice}>Price N/A</Text>
        )}
        {item.distance_km !== null && item.distance_km !== undefined && (
            <Text style={styles.itemDistance}>~{parseFloat(item.distance_km).toFixed(1)} km away</Text>
        )}
      </View>
      <Ionicons name="chevron-forward-outline" size={22} color="#C7C7CC" />
    </TouchableOpacity>
  );
});

export default function ProductSearchScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  
  const initialParams = route.params || {};
  const initialQuery = initialParams.searchQuery || '';
  // Force category to 'pharma' for this dedicated screen.
  // The backend's /api/search/{category} endpoint expects this.
  const category = 'pharma'; 
  
  // These initial parameters are still relevant for the general search logic,
  // but for this screen, 'searchNearby' might not be a primary focus unless backend supports it for pharma.
  const initialSearchNearby = initialParams.searchNearby || false;
  const initialUserLocation = initialParams.userLocation || null;

  const [currentSearchQuery, setCurrentSearchQuery] = useState(initialQuery);
  const [displayedQuery, setDisplayedQuery] = useState(''); 
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const activeSearchParamsRef = useRef({
    query: '',
    searchType: 'master', // Default to master search for pharmacy products
    latitude: null,
    longitude: null,
  });
  const initialLoadPerformedRef = useRef(false);

  const fetchSearchResults = useCallback(async (queryToFetch, pageToFetch = 1, searchParamsForCall) => {
    if (!queryToFetch || queryToFetch.length < 2) {
      setSearchResults([]);
      setError(queryToFetch ? 'Search query must be at least 2 characters.' : null);
      if (pageToFetch === 1) setLoading(false);
      setIsLoadingMore(false);
      setAllDataLoaded(true);
      return;
    }

    if (pageToFetch === 1) {
      setLoading(true);
      setSearchResults([]); 
      setAllDataLoaded(false);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    
    const currentActiveParams = searchParamsForCall || activeSearchParamsRef.current;

    let endpoint = `${API_URL}/api/search/${category}?q=${encodeURIComponent(queryToFetch)}&page=${pageToFetch}&limit=${ITEMS_PER_PAGE}`; //
    endpoint += `&searchType=${currentActiveParams.searchType}`;
    if (currentActiveParams.searchType === 'nearby' && currentActiveParams.latitude && currentActiveParams.longitude) {
      endpoint += `&latitude=${currentActiveParams.latitude}&longitude=${currentActiveParams.longitude}`;
    }

    console.log(`[ProductSearchScreen] Fetching: Page ${pageToFetch}, URL=${endpoint}`);

    try {
      const response = await fetch(endpoint);
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error("[ProductSearchScreen] Fetch error response text:", responseText);
        let errData;
        try {
            errData = JSON.parse(responseText);
        } catch (e) {
            errData = { error: `HTTP error ${response.status}. Non-JSON response.` };
        }
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      const data = JSON.parse(responseText);
      console.log('[ProductSearchScreen] Full data object received:', data);
      console.log('[ProductSearchScreen] Received data for page', pageToFetch, 'Products count:', data ? data.length : 'N/A');
      
      // The backend /api/search/supermarket returns a list of dictionaries directly.
      // Assuming /api/search/pharma will return a similar structure or a 'products' array.
      const productsData = Array.isArray(data) ? data : data.products; // Adapt to backend structure

      if (productsData && Array.isArray(productsData)) {
        if (productsData.length > 0) {
          setSearchResults(prevResults => (pageToFetch === 1 ? productsData : [...prevResults, ...productsData]));
          setAllDataLoaded(productsData.length < ITEMS_PER_PAGE);
        } else {
          if (pageToFetch === 1) setSearchResults([]);
          setAllDataLoaded(true); 
          if (pageToFetch === 1) {
            setError(`No products found for "${queryToFetch}".`);
          }
        }
      } else {
        console.error('[ProductSearchScreen] Invalid data structure, expected array or object with "products" array:', data);
        if (pageToFetch === 1) setSearchResults([]);
        setError('Received invalid data structure from server.');
        setAllDataLoaded(true);
      }
      setCurrentPage(pageToFetch);
    } catch (e) {
      console.error("[ProductSearchScreen] Fetch/Processing error:", e);
      setError(e.message || 'An error occurred while searching.');
      if (pageToFetch === 1) setSearchResults([]);
      setAllDataLoaded(true);
    } finally {
      if (pageToFetch === 1) setLoading(false);
      setIsLoadingMore(false);
    }
  }, [category]); // Depend on hardcoded category

  // Effect for initial search when parameters from route are available
  useEffect(() => {
    if (initialQuery && !initialLoadPerformedRef.current) {
      console.log("[ProductSearchScreen] Initial useEffect triggered with query:", initialQuery);
      const paramsForFetch = {
        query: initialQuery,
        searchType: 'master', // For pharmacy, default to 'master' search
        latitude: initialUserLocation?.latitude,
        longitude: initialUserLocation?.longitude,
      };
      activeSearchParamsRef.current = paramsForFetch;
      setDisplayedQuery(initialQuery);
      setCurrentSearchQuery(initialQuery);
      
      fetchSearchResults(initialQuery, 1, paramsForFetch);
      initialLoadPerformedRef.current = true;
    }
  }, [initialQuery, initialUserLocation, fetchSearchResults]);


  const handleProductPress = (product) => {
    // Navigate to ProductDetailsScreen, passing masterproductid for detail fetching
    console.log("[ProductSearchScreen] Product pressed:", product.masterproductid, product.productname);
    navigation.navigate('ProductDetails', { productId: product.masterproductid }); //
  };
  
  const handleNewSearchSubmit = () => {
    console.log("[ProductSearchScreen] New search submitted for:", currentSearchQuery);
    if (!currentSearchQuery || currentSearchQuery.length < 2) {
        setError('Search query must be at least 2 characters.');
        setSearchResults([]);
        setDisplayedQuery(currentSearchQuery);
        setAllDataLoaded(true);
        return;
    }
    const paramsForNewSearch = {
        query: currentSearchQuery,
        searchType: 'master', // Always 'master' for this screen's primary function
        latitude: null, // Reset location data for a new generic search
        longitude: null,
    };
    activeSearchParamsRef.current = paramsForNewSearch;
    setDisplayedQuery(currentSearchQuery);
    setCurrentPage(1); 
    setAllDataLoaded(false);
    fetchSearchResults(currentSearchQuery, 1, paramsForNewSearch);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && !allDataLoaded && !loading && searchResults.length > 0) {
      console.log("[ProductSearchScreen] handleLoadMore: Fetching page", currentPage + 1, "for query", activeSearchParamsRef.current.query);
      fetchSearchResults(activeSearchParamsRef.current.query, currentPage + 1, activeSearchParamsRef.current);
    }
  };
  
  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerLoadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.footerText}>Loading more...</Text>
        </View>
      );
    }
    if (allDataLoaded && searchResults.length > 0 && !loading) {
      return (
        <View style={styles.footerLoadingContainer}>
          <Text style={styles.footerText}>No more products to load.</Text>
        </View>
      );
    }
    return null;
  };

  const renderHeader = () => (
    <View style={styles.searchHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
        <TextInput
            style={styles.headerSearchInput}
            placeholder="Search pharmacy products..." // Specific placeholder
            value={currentSearchQuery}
            onChangeText={setCurrentSearchQuery}
            onSubmitEditing={handleNewSearchSubmit}
            returnKeyType="search"
        />
        <TouchableOpacity style={styles.headerSearchButton} onPress={handleNewSearchSubmit}>
            <Ionicons name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
    </View>
  );

  let mainContent = null;
  if (loading) {
    mainContent = (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.messageText}>Searching for "{displayedQuery}"...</Text>
      </View>
    );
  } else if (error) {
    mainContent = (
      <View style={styles.centeredMessageContainer}>
        <Ionicons name="warning-outline" size={40} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  } else if (searchResults.length === 0 && displayedQuery && allDataLoaded) {
     mainContent = (
        <View style={styles.centeredMessageContainer}>
            <Ionicons name="information-circle-outline" size={40} color="#8E8E93" />
            <Text style={styles.messageText}>No pharmacy products found for "{displayedQuery}". Try a different search term.</Text>
        </View>
     );
  } else if (searchResults.length > 0) {
    mainContent = (
      <FlatList
        data={searchResults}
        renderItem={({ item }) => <SearchResultItem item={item} onPress={handleProductPress} />}
        keyExtractor={(item, index) => `${item.listingid || item.masterproductid}_${index}`}
        contentContainerStyle={styles.listContentContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  } else if (!displayedQuery) {
    mainContent = (
        <View style={styles.centeredMessageContainer}>
            <Ionicons name="search-circle-outline" size={40} color="#8E8E93" />
            <Text style={styles.messageText}>Enter a pharmacy product name above to find items.</Text>
        </View>
    );
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {searchResults.length > 0 && !loading && !error && (
         <Text style={styles.resultsInfoText}>
            Showing results for "{displayedQuery}"
          </Text>
      )}
      {mainContent}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 5,
    marginRight: 5,
  },
  headerSearchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  headerSearchButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  resultsInfoText: {
    fontSize: 14,
    color: '#666666',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  listContentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#E0E0E0',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 2,
  },
  itemRetailer: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  itemDistance: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  footerLoadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666666',
  },
});
