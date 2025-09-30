// screens/HomeScreenV2.tsx - Exact match to claymorphism mockup
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { MainAppScreenProps } from '../navigation/types';
import { Product } from '../types';
import QuickViewModal from '../components/product/QuickViewModal';
import { useCart } from '../context/CartContext';
import { searchProducts, Product as ApiProduct } from '../services/api';
import NeumorphicSavingsMeter from '../components/ui/NeumorphicSavingsMeter';
import NeumorphicButton from '../components/ui/NeumorphicButton';
import ClayProductCard from '../components/ui/ClayProductCard';

const { width } = Dimensions.get('window');

type Props = MainAppScreenProps<'Home'>;

const HomeScreenV2 = ({ navigation }: Props) => {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'picks' | 'trending'>('picks');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);

  // Fetch real products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // Search for common pharmacy products - try different searches
      let results = await searchProducts('');

      // If empty search doesn't work, try specific terms
      if (!results || results.length === 0) {
        results = await searchProducts('vitamin');
      }

      if (results && results.length > 0) {
        setApiProducts(results.slice(0, 20)); // Get first 20 products
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Don't use fallback data - show actual error state
    } finally {
      setIsLoading(false);
    }
  };

  // Convert API products to app Product format and filter for products with images
  const products: Product[] = apiProducts
    .filter(apiProduct => apiProduct.image_url && apiProduct.image_url.trim() !== '')
    .map((apiProduct, index) => {
      // Ensure unique masterproductid
      const uniqueId = apiProduct.product_id ? String(apiProduct.product_id) : `product-${Date.now()}-${index}`;
      console.log(`Product ${index}: ID=${uniqueId}, Name=${apiProduct.name}`);
      return {
        product_id: apiProduct.product_id || index,
        masterproductid: uniqueId,
        name: apiProduct.name,
        brand: apiProduct.brand || 'Unknown',
        description: apiProduct.description || '',
        price_range: { min: apiProduct.lowest_price || 0, max: apiProduct.lowest_price || 0 },
        images: [apiProduct.image_url],
        image_url: apiProduct.image_url,
        prices: [],
        category: apiProduct.category || 'Health',
        healthScore: 85,
        type_product: 'supplement',
        alternatives: [],
      };
    });


  // Calculate total savings
  const totalSavings = 432;

  // Enhanced Savings Meter Component
  const EnhancedSavingsMeter = () => {
    const size = 200;
    const strokeWidth = 14;
    const radius = (size - strokeWidth - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = 0.7;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
      <View style={styles.savingsMeterWrapper}>
        {/* Outer raised ring effect */}
        <View style={styles.meterOuterRing}>
          <Svg width={size} height={size} style={styles.savingsSvg}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Background circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E8E5E2"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#8FBF9F"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
              {/* Yellow accent arc */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius + 8}
                stroke="#F7E6A3"
                strokeWidth={3}
                fill="none"
                strokeDasharray={`${circumference * 0.1} ${circumference * 0.9}`}
                strokeDashoffset={0}
                opacity={0.6}
              />
            </G>
          </Svg>
          <View style={styles.meterContent}>
            <View style={styles.heartBubble}>
              <Ionicons name="heart" size={22} color="white" />
            </View>
            <Text style={styles.savingsNumber}>
              <Text style={styles.currencySymbol}>₪</Text>
              {totalSavings}
            </Text>
            <Text style={styles.savingsLabel}>SAVED</Text>
            <Text style={styles.savingsSubLabel}>TOTAL SAVINGS</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#FFE5EC', '#E8F5E9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Clean header - removed outdated icons */}


        {/* Enhanced Savings Meter */}
        <NeumorphicSavingsMeter
          savedAmount={totalSavings}
          progress={Math.min(totalSavings / 5000, 1)} // Progress based on savings goal of $5000
        />

        {/* Removed featured product card - was causing crashes */}

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <NeumorphicButton
            title="This Week's Picks"
            onPress={() => setActiveTab('picks')}
            isActive={activeTab === 'picks'}
            variant="secondary"
          />
          <NeumorphicButton
            title="Trending"
            onPress={() => setActiveTab('trending')}
            isActive={activeTab === 'trending'}
            variant="secondary"
          />
        </View>

        {/* Product List */}
        {products.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productList}>
            {products.map((product, index) => (
              <ClayProductCard
                key={product.masterproductid || `product-${index}`}
                product={product}
                onPress={handleQuickView}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyProducts}>
            <Text style={styles.emptyText}>No products available</Text>
            <Text style={styles.emptySubtext}>Loading products from server...</Text>
          </View>
        )}

        {/* Trending Nearby Section */}
        <View style={styles.secondarySection}>
          <Text style={styles.sectionTitle}>Trending Nearby</Text>
          {products.length >= 2 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productList}>
              {products.slice(0, 3).map((product, index) => (
                <ClayProductCard
                  key={`trending-${product.masterproductid || index}`}
                  product={product}
                  onPress={handleQuickView}
                  style={styles.trendingCard}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptySecondary}>
              <Text style={styles.emptySubtext}>Loading trending products...</Text>
            </View>
          )}
        </View>
      </ScrollView>


        <QuickViewModal
          product={selectedProduct}
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            // Small delay before clearing product to allow modal animation
            setTimeout(() => {
              setSelectedProduct(null);
            }, 200);
          }}
          onAddToCart={addToCart}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  savingsMeterWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  meterOuterRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F7F5F3',
    justifyContent: 'center',
    alignItems: 'center',
    // Clay effect
    shadowColor: '#D4D0CC',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  savingsSvg: {
    position: 'absolute',
  },
  meterContent: {
    alignItems: 'center',
  },
  heartBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8FBF9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  savingsNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#3A3937',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: '#8FBF9F',
  },
  savingsLabel: {
    fontSize: 14,
    color: '#8FBF9F',
    fontWeight: '600',
    marginTop: 5,
  },
  savingsSubLabel: {
    fontSize: 10,
    color: '#8A8680',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  // Empty state styles
  emptyProducts: {
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  emptySecondary: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8A8680',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B0ABA6',
    textAlign: 'center',
  },
  productList: {
    paddingLeft: 20,
    marginBottom: 30,
  },
  secondaryCardStyle: {
    marginRight: 0,
    flex: 1,
  },
  secondarySection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3937',
    marginBottom: 15,
  },
  secondaryProducts: {
    flexDirection: 'row',
    gap: 15,
  },
  trendingCard: {
    width: 150,
    marginRight: 12,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#8A8680',
  },
});

export default HomeScreenV2;