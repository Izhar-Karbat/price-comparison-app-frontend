// screens/ProductDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, Share, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { designTokens } from '../theme/designTokens';
import type { RootStackParamList } from '../App';
import { Product, ProductGroup, SearchApiResponse } from '../types';
// import { API_URL } from '../config'; // Removed to avoid network requests

import PriceComparisonTable, { PriceInfo } from '../components/product/PriceComparisonTable';
import SmartLocationCard from '../components/ui/SmartLocationCard';
import ProductHeader from '../components/product-details/ProductHeader';
import ProductInfo from '../components/product-details/ProductInfo';
import ProductActions from '../components/product-details/ProductActions';
import SuggestedAlternatives from '../components/product-details/SuggestedAlternatives';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Promotion, getProductById } from '../services/api';
import DealCard from '../components/deals/DealCard';

// Props type for component - replaces useNavigation/useRoute hooks
type Props = StackScreenProps<RootStackParamList, 'ProductDetails'>;

interface ExtendedProductData {
  masterproductid: string;
  productName: string;
  brand: string;
  image: string;
  imageUrl: string;
  price: number;
  healthScore: number;
  description: string;
  ingredients: Array<{ name: string; type: 'safe' | 'warning' | 'danger' }>;
  prices: PriceInfo[];
  promotions?: Promotion[];
}

// Helper function to convert ProductGroup to extended product data
const convertToExtendedProductData = (productGroup: ProductGroup): ExtendedProductData => {
  const validPrices = productGroup.prices
    .filter(p => p.price && !isNaN(p.price) && p.price > 0)
    .map(p => p.price);
  const cheapestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;

  return {
    masterproductid: productGroup.groupId?.toString() || '0',
    productName: productGroup.name || 'Unknown Product',
    brand: productGroup.brand || 'Unknown Brand',
    image: 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(productGroup.name?.substring(0, 10) || 'Product'),
    imageUrl: 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(productGroup.name?.substring(0, 10) || 'Product'),
    price: cheapestPrice,
    healthScore: Math.floor(Math.random() * 20) + 80, // Random health score between 80-100
    description: `${productGroup.name || 'Product'} from ${productGroup.brand || 'Unknown'}. ${productGroup.attributes?.size_value ? `Size: ${productGroup.attributes.size_value} ${productGroup.attributes?.size_unit || ''}` : ''}`,
    ingredients: [
      { name: 'Natural Extract', type: 'safe' as const },
      { name: 'Preservatives', type: 'warning' as const },
      { name: 'Active Ingredients', type: 'safe' as const },
    ],
    prices: productGroup.prices?.map(p => ({
      retailerName: p.retailer,
      price: p.price,
      store: 'Store Location' // Default store value since original PriceInfo doesn't have store field
    })) || [],
    promotions: [], // Will be populated from API response if available
  };
};

const ProductDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { productId, productData: passedProductData } = route.params || {};
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [productData, setProductData] = useState<ExtendedProductData | null>(null);
  const [alternativeProduct, setAlternativeProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("✅✅✅ --- PARAMETER PASSING FIX APPLIED --- ✅✅✅");

    const loadProductData = async () => {
      console.log('[ProductDetailsScreen] Loading product data, productId:', productId, 'passedData:', passedProductData);

      if (!productId) {
        console.error('[ProductDetailsScreen] No productId provided!');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // If we have passed product data, use it directly
        if (passedProductData) {
          console.log('[ProductDetailsScreen] Using passed product data');

          // Use the passed data without making additional network requests
          const targetProduct = {
            groupId: passedProductData.product_id || 0,
            name: passedProductData.name || passedProductData.productName || 'Unknown Product',
            brand: passedProductData.brand || 'Unknown Brand',
            attributes: passedProductData.attributes || {},
            prices: passedProductData.prices ?
              passedProductData.prices
                .filter((p: any) => p.price && !isNaN(p.price) && p.price > 0)
                .map((p: any) => ({
                  retailer: p.retailer_name || 'Available Store',
                  price: p.price,
                  store: p.store_name || 'Pharmacy'
                })) :
              (passedProductData.price && !isNaN(passedProductData.price) && passedProductData.price > 0 ? [{
                retailer: 'Available Store',
                price: passedProductData.price,
                store: 'Pharmacy'
              }] : [])
          };

          const extendedData = convertToExtendedProductData(targetProduct);

          // If passedProductData has promotions from API, use them
          if (passedProductData.promotions?.length > 0) {
            extendedData.promotions = passedProductData.promotions;
          }

          setProductData(extendedData);

          // Skip fetching alternatives to avoid network requests
          // We can add this back later when we have the correct API endpoints
          console.log('[ProductDetailsScreen] Skipping alternatives fetch to avoid network errors');
          setAlternativeProduct(null);
        } else {
          // Fetch product data by ID from API
          console.log('[ProductDetailsScreen] Fetching product by ID:', productId);

          // Validate productId before making API call
          if (!productId || typeof productId !== 'string' || productId.trim().length === 0) {
            console.error('[ProductDetailsScreen] Invalid productId:', productId);
            return;
          }

          try {
            const productResponse = await getProductById(productId);
            console.log('[ProductDetailsScreen] Product fetched:', productResponse);

            // Convert to ExtendedProductData format
            const targetProduct = {
              groupId: productResponse.product_id || 0,
              name: productResponse.name || 'Unknown Product',
              brand: productResponse.brand || 'Unknown Brand',
              attributes: {},
              prices: productResponse.lowest_price ? [{
                retailer: 'Available Store',
                price: productResponse.lowest_price,
                store: 'Pharmacy'
              }] : []
            };

            const extendedData = convertToExtendedProductData(targetProduct);

            // Add promotions if available
            if (productResponse.promotions?.length > 0) {
              extendedData.promotions = productResponse.promotions;
            }

            setProductData(extendedData);
            setAlternativeProduct(null);
          } catch (error) {
            console.error('[ProductDetailsScreen] Error fetching product by ID:', error);
          }
        }
      } catch (error) {
        console.error('[ProductDetailsScreen] Error loading product data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, passedProductData]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${productData?.productName} on PharmMate!`,
        title: productData?.productName,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share');
    }
  };

  const handleAddToCart = () => {
    if (productData) {
      const validPrice = productData.price && !isNaN(productData.price) && productData.price > 0
        ? productData.price
        : null;

      if (!validPrice) {
        Alert.alert('Error', 'Cannot add product with unavailable price to cart');
        return;
      }

      const product: Product = {
        masterproductid: productData.masterproductid,
        productName: productData.productName,
        brand: productData.brand,
        image: productData.image,
        imageUrl: productData.imageUrl,
        price: validPrice,
        healthScore: productData.healthScore,
        product_id: parseInt(productData.masterproductid || '0'),
        name: productData.productName,
        image_url: productData.imageUrl,
        description: productData.description,
        prices: []
      };
      addToCart(product);
      Alert.alert('Success', 'Product added to cart!');
    }
  };

  const handleComparePrices = () => {
    if (productData) {
      navigation.navigate('PriceComparison' as never, {
        productId: productData.masterproductid,
        productName: productData.productName
      } as never);
    }
  };

  const handleAlternativePress = (product: Product) => {
    navigation.push('ProductDetails', {
      productId: product.masterproductid,
      productData: product
    });
  };

  const handleFavoriteToggle = () => {
    if (productData) {
      const product: Product = {
        masterproductid: productData.masterproductid,
        productName: productData.productName,
        brand: productData.brand,
        image: productData.image,
        imageUrl: productData.imageUrl,
        price: productData.price,
        healthScore: productData.healthScore,
        product_id: parseInt(productData.masterproductid || '0'),
        name: productData.productName,
        image_url: productData.imageUrl,
        description: productData.description,
        prices: []
      };

      const productIdForCheck = product.product_id?.toString() || product.masterproductid || '0';

      if (isFavorite(productIdForCheck)) {
        removeFavorite(productIdForCheck);
      } else {
        addFavorite(product);
      }
    }
  };

  if (isLoading || !productData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={designTokens.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Header with Image, Name, Brand */}
        <ProductHeader
          productName={productData.productName}
          brand={productData.brand}
          imageUrl={productData.imageUrl}
          healthScore={productData.healthScore}
          price={productData.price && !isNaN(productData.price) && productData.price > 0 ? productData.price : 0}
          onShare={handleShare}
          onBack={() => navigation.goBack()}
          onFavorite={handleFavoriteToggle}
          isFavorite={isFavorite(productData.masterproductid)}
        />

        {/* Smart Location Card - Find nearest store */}
        {productData.prices?.length > 0 && (
          <SmartLocationCard
            store={{
              storeName: productData.prices?.[0]?.store || 'Store',
              retailerName: productData.prices?.[0]?.retailerName || 'Unknown Retailer',
              address: 'Sample Address 123',
              city: 'Sample City',
              distance: Math.random() * 5, // Random distance for demo
              price: productData.prices?.[0]?.price || 0,
            }}
            onNavigate={() => console.log('Navigate to store')}
          />
        )}

        {/* Promotions Section - Display deals from API */}
        {productData.promotions?.length > 0 && (
          <View style={styles.promotionsSection}>
            <Text style={styles.promotionsSectionTitle}>Active Promotions</Text>
            {productData.promotions?.map((promotion) => (
              <View key={promotion.deal_id} style={styles.promotionCard}>
                <Text style={styles.promotionTitle}>{promotion.title}</Text>
                <Text style={styles.promotionDescription}>{promotion.description}</Text>
                <Text style={styles.promotionRetailer}>Available at {promotion.retailer_name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Product Info - Description and Ingredients */}
        <ProductInfo
          description={productData.description}
          ingredients={productData.ingredients}
          promotions={undefined}
        />

        {/* Price Comparison Table */}
        <View style={styles.priceSection}>
          <PriceComparisonTable prices={productData.prices} />
        </View>

        {/* Action Buttons */}
        <ProductActions
          onComparePrices={handleComparePrices}
          onAddToCart={handleAddToCart}
        />

        {/* Suggested Alternative */}
        {alternativeProduct && (
          <SuggestedAlternatives
            alternativeProduct={alternativeProduct}
            onAlternativePress={handleAlternativePress}
          />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceSection: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  promotionsSection: {
    paddingHorizontal: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.lg,
  },
  promotionsSectionTitle: {
    fontSize: designTokens.typography.size.xl,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
  },
  promotionCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#F4B2B2',
  },
  promotionTitle: {
    fontSize: designTokens.typography.size.lg,
    fontWeight: designTokens.typography.weight.bold,
    color: '#3A3937',
    marginBottom: 4,
  },
  promotionDescription: {
    fontSize: designTokens.typography.size.body,
    color: '#6B6864',
    marginBottom: 4,
  },
  promotionRetailer: {
    fontSize: designTokens.typography.size.small,
    color: '#8A8680',
    fontWeight: designTokens.typography.weight.semibold,
  },
});

export default ProductDetailsScreen;