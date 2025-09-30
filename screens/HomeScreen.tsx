// screens/HomeScreen.tsx - Simplified Claymorphism design
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';

import { Product, ProductGroup, SearchApiResponse } from '../types';
import { MainAppScreenProps } from '../navigation/types';
import { API_URL } from '../config';

import ProductCard from '../components/product/ProductCard';
import ProductCardSkeleton from '../components/product/ProductCardSkeleton';
import QuickViewModal from '../components/product/QuickViewModal';
import NeumorphicImageCard from '../components/ui/NeumorphicImageCard';
import NeumorphicButton from '../components/ui/NeumorphicButton';

import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { testConnectivity, getApiBaseUrl, fetchDeals, Deal } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DealCard from '../components/deals/DealCard';

// Helper function to convert ProductGroup to Product format with pricing data
const convertProductGroupToProduct = (productGroup: ProductGroup): Product & { originalPrice?: number } => {
  const prices = productGroup.prices.map(p => p.price);
  const cheapestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return {
    masterproductid: productGroup.groupId.toString(),
    productName: productGroup.name,
    brand: productGroup.brand,
    image: 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(productGroup.name.substring(0, 10)),
    imageUrl: 'https://via.placeholder.com/200x200?text=' + encodeURIComponent(productGroup.name.substring(0, 10)),
    price: cheapestPrice,
    originalPrice: highestPrice > cheapestPrice ? highestPrice : undefined,
    healthScore: Math.floor(Math.random() * 20) + 80,
  };
};

type Props = MainAppScreenProps<'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const authContext = useContext(AuthContext);
  const username = authContext?.username;
  const { addToCart, cart } = useCart();
  const { preferredPharmacy } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [weekPicks, setWeekPicks] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'picks' | 'trending'>('picks');
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [connectivityStatus, setConnectivityStatus] = useState<string>('Testing...');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealsLoading, setDealsLoading] = useState(false);

  const fetchFeaturedProducts = async () => {
    setIsLoading(true);

    // Use mock data for demo
    const mockProducts: Product[] = [
      {
        masterproductid: '1',
        productName: 'Vitamin C 1000mg',
        brand: 'NaturePlus',
        image: 'https://via.placeholder.com/200x200?text=Vitamin+C',
        imageUrl: 'https://via.placeholder.com/200x200?text=Vitamin+C',
        price: 12.99,
        originalPrice: 19.99,
        healthScore: 95,
      },
      {
        masterproductid: '2',
        productName: 'Omega-3 Fish Oil',
        brand: 'HealthMax',
        image: 'https://via.placeholder.com/200x200?text=Omega-3',
        imageUrl: 'https://via.placeholder.com/200x200?text=Omega-3',
        price: 24.50,
        originalPrice: 34.99,
        healthScore: 92,
      },
      {
        masterproductid: '3',
        productName: 'Multivitamin Daily',
        brand: 'VitaLife',
        image: 'https://via.placeholder.com/200x200?text=Multivitamin',
        imageUrl: 'https://via.placeholder.com/200x200?text=Multivitamin',
        price: 18.75,
        originalPrice: 25.00,
        healthScore: 88,
      },
      {
        masterproductid: '4',
        productName: 'Probiotic Complex',
        brand: 'GutHealth',
        image: 'https://via.placeholder.com/200x200?text=Probiotic',
        imageUrl: 'https://via.placeholder.com/200x200?text=Probiotic',
        price: 29.99,
        originalPrice: 39.99,
        healthScore: 90,
      },
    ];

    setWeekPicks(mockProducts);
    setTrendingProducts(mockProducts.slice(0, 3));
    setFeaturedProduct(mockProducts[0]);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const loadDeals = async () => {
    try {
      setDealsLoading(true);
      const dealsData = await fetchDeals(3); // Get top 3 deals for home screen
      setDeals(dealsData);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setDealsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    loadDeals();

    // IMMEDIATE CONNECTIVITY TEST - This will run when app loads
    console.log('🚀 [CONNECTIVITY TEST] Starting connectivity test...');
    console.log('🚀 [CONNECTIVITY TEST] API Base URL:', getApiBaseUrl());
    console.log('🚀 [CONNECTIVITY TEST] Platform:', require('react-native').Platform.OS);

    testConnectivity().then((result) => {
      console.log('🚀 [CONNECTIVITY TEST] Result:', result ? '✅ SUCCESS' : '❌ FAILED');
      setConnectivityStatus(result ? '✅ Backend Connected' : '❌ Backend Failed');
      if (!result) {
        console.log('🚀 [CONNECTIVITY TEST] Backend may not be reachable from React Native app');
      }
    }).catch((error) => {
      console.log('🚀 [CONNECTIVITY TEST] Error:', error);
      setConnectivityStatus(`❌ Error: ${error.message}`);
    });
  }, []);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const handleAddToCartInModal = (product: Product) => {
    addToCart(product);
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCardWrapper}>
      <ProductCard
        product={item}
        onPress={() => handleQuickView(item)}
      />
    </View>
  );

  const currentProducts = activeTab === 'picks' ? weekPicks : trendingProducts;

  // Calculate actual savings based on cart vs preferred pharmacy
  const calculateCartSavings = () => {
    if (!preferredPharmacy || cart.length === 0) {
      return { amount: 0, percentage: 0 };
    }

    // Mock pharmacy pricing data
    const pharmacyPrices: Record<string, Record<string, number>> = {
      'super_pharm': {},
      'be_pharm': {},
      'good_pharm': {}
    };

    // Set mock prices for different pharmacies (cart items would have real pricing)
    let totalCartPrice = 0;
    let totalPreferredPharmacyPrice = 0;

    cart.forEach(item => {
      totalCartPrice += item.price * item.quantity;

      // Mock calculation: preferred pharmacy is usually 10-30% more expensive
      const preferredPharmacyPrice = item.price * (1 + Math.random() * 0.3 + 0.1);
      totalPreferredPharmacyPrice += preferredPharmacyPrice * item.quantity;
    });

    const savings = totalPreferredPharmacyPrice - totalCartPrice;
    const percentage = totalPreferredPharmacyPrice > 0 ? (savings / totalPreferredPharmacyPrice) : 0;

    return {
      amount: Math.max(0, savings),
      percentage: Math.max(0, Math.min(1, percentage))
    };
  };

  const cartSavings = calculateCartSavings();

  // Development function to reset onboarding (for testing)
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.multiRemove(['@onboardingCompleted', '@preferredPharmacy']);
      console.log('Onboarding data cleared - app will restart to onboarding');
      // Force app reload to show onboarding
      if (__DEV__) {
        const { DevSettings } = require('react-native');
        DevSettings.reload();
      }
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  };

  // Savings meter component
  const SavingsMeter = () => {
    const size = 180;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = cartSavings.percentage; // Use real savings percentage
    const strokeDashoffset = circumference - (progress * circumference);

    return (
      <View style={styles.savingsMeterContainer}>
        <Svg width={size} height={size} style={styles.savingsSvg}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E8E5E2"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
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
          </G>
        </Svg>
        <View style={styles.savingsInnerContent}>
          <View style={styles.heartIconContainer}>
            <Ionicons name="heart" size={20} color="white" />
          </View>
          <Text style={styles.savingsNumber}>
            ₪{cartSavings.amount.toFixed(0)}
          </Text>
          <Text style={styles.savingsLabel}>
            {cart.length > 0 ? 'saved vs usual store' : 'add items to see savings'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="#3A3937" />
            </TouchableOpacity>
            {/* Temporary reset button for testing */}
            {__DEV__ && (
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: '#ff6b6b', marginLeft: 8 }]}
                onPress={resetOnboarding}
              >
                <Ionicons name="refresh" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.logoText}>PharmMate</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="bag-outline" size={22} color="#3A3937" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Account')}
            >
              <Text style={styles.profileInitial}>
                {username ? username[0].toUpperCase() : 'I'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.pageTitle}>This Week's Picks</Text>

        {/* Connectivity Status - VISIBLE ON SCREEN */}
        <View style={styles.connectivityBanner}>
          <Text style={styles.connectivityText}>{connectivityStatus}</Text>
        </View>

        {/* Savings Meter */}
        <SavingsMeter />

        {/* Deals Section */}
        {!dealsLoading && deals.length > 0 && (
          <View style={styles.dealsSection}>
            <View style={styles.dealsSectionHeader}>
              <Text style={styles.sectionTitle}>Top Deals This Week</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Deals')}>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={deals}
              renderItem={({ item }) => (
                <View style={styles.dealCardWrapper}>
                  <DealCard deal={item} style={styles.dealCardHorizontal} />
                </View>
              )}
              keyExtractor={(item) => `deal-${item.deal_id}`}
              contentContainerStyle={styles.dealsListContainer}
            />
          </View>
        )}

        {/* Featured Product Card */}
        {featuredProduct && (
          <View style={styles.featuredCardContainer}>
            <NeumorphicImageCard variant="raised" width={350} height={140}>
              <TouchableOpacity
                onPress={() => handleQuickView(featuredProduct)}
                activeOpacity={0.95}
                style={{ width: '100%', height: '100%' }}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.featuredIcon}>
                    <Ionicons name="medical" size={28} color="#8FBF9F" />
                  </View>
                  <View style={styles.featuredDetails}>
                    <Text style={styles.featuredLabel}>This Week's Pick</Text>
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                      {featuredProduct.productName}
                    </Text>
                    <Text style={styles.featuredBrand}>{featuredProduct.brand}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.featuredPrice}>${featuredProduct.price.toFixed(2)}</Text>
                      {featuredProduct.originalPrice && (
                        <Text style={styles.savingsAmount}>
                          Save ${(featuredProduct.originalPrice - featuredProduct.price).toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </NeumorphicImageCard>
          </View>
        )}

        {/* Tab Buttons with Neumorphic Style */}
        <View style={styles.tabContainer}>
          <NeumorphicButton
            title="This Week's Picks"
            onPress={() => setActiveTab('picks')}
            isActive={activeTab === 'picks'}
            style={{ marginRight: 12 }}
          />
          <NeumorphicButton
            title="Trending"
            onPress={() => setActiveTab('trending')}
            isActive={activeTab === 'trending'}
          />
        </View>

        {/* Products List */}
        <View style={styles.productsSection}>
          {isLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </ScrollView>
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={currentProducts}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.masterproductid}
              contentContainerStyle={styles.productList}
            />
          )}
        </View>

        {/* Test Neumorphic Card */}
        <View style={styles.featuredCardContainer}>
          <NeumorphicImageCard variant="raised" width={350} height={140}>
            <View style={{ padding: 20, width: '100%' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#3A3937' }}>
                Neumorphic Shadow Test
              </Text>
              <Text style={{ fontSize: 14, color: '#8A8680', marginTop: 8 }}>
                This card demonstrates the soft shadow effect from your neumorphism.io image
              </Text>
            </View>
          </NeumorphicImageCard>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('ProductSearch', { searchQuery: '' })}
              activeOpacity={0.8}
            >
              <Ionicons name="search-outline" size={20} color="#8FBF9F" />
              <Text style={styles.actionText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Scanner')}
              activeOpacity={0.8}
            >
              <Ionicons name="scan-outline" size={20} color="#8FBF9F" />
              <Text style={styles.actionText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <QuickViewModal
        product={selectedProduct}
        visible={modalVisible}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCartInModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F3',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3937',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4B2B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A3937',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  savingsMeterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  savingsSvg: {
    position: 'absolute',
  },
  savingsInnerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8FBF9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#3A3937',
  },
  savingsLabel: {
    fontSize: 16,
    color: '#8A8680',
    marginTop: 4,
  },
  featuredCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#F7F5F3',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#D4D0CC',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(143, 191, 159, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredDetails: {
    flex: 1,
  },
  featuredLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8FBF9F',
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3A3937',
    marginBottom: 2,
  },
  featuredBrand: {
    fontSize: 14,
    color: '#8A8680',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8FBF9F',
  },
  savingsAmount: {
    fontSize: 14,
    color: '#8FBF9F',
    backgroundColor: 'rgba(143, 191, 159, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    height: 44,
    backgroundColor: '#F7F5F3',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5E2',
  },
  tabButtonActive: {
    backgroundColor: '#8FBF9F',
    borderColor: '#8FBF9F',
    shadowColor: '#8FBF9F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A8680',
  },
  tabTextActive: {
    color: 'white',
  },
  productsSection: {
    marginBottom: 32,
  },
  productList: {
    paddingHorizontal: 20,
  },
  productCardWrapper: {
    marginRight: 12,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3A3937',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#F7F5F3',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E8E5E2',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3937',
  },
  connectivityBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  connectivityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
  },
  dealsSection: {
    marginBottom: 24,
  },
  dealsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F4B2B2',
  },
  dealsListContainer: {
    paddingHorizontal: 20,
  },
  dealCardWrapper: {
    marginRight: 12,
  },
  dealCardHorizontal: {
    width: 280,
  },
});

export default HomeScreen;