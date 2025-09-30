// components/MultiRetailerDemo.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { designTokens } from '../theme/designTokens';
import ProductCard from './product/ProductCard';
import PriceComparisonTable from './product/PriceComparisonTable';

// Demo component showing multi-retailer functionality
const MultiRetailerDemo: React.FC = () => {
  // Sample multi-retailer product data
  const demoProduct = {
    masterproductid: '12345',
    productName: 'סבון ידיים ליים ומנדרינה',
    brand: 'Palmolive',
    image: 'https://via.placeholder.com/80x80',
    imageUrl: 'https://via.placeholder.com/80x80',
    price: 11.50, // Lowest price across all retailers
    healthScore: 85,
    retailer_count: 3,
    retailers: ['Super-Pharm', 'Be Pharm', 'Good Pharm'],
    store_count: 47,
  };

  // Sample price comparison data with proximity
  const demoPrices = [
    // Super-Pharm locations
    {
      retailerName: 'Super-Pharm',
      price: 12.90,
      store: 'דיזנגוף סנטר',
      distance: 0.8,
      city: 'תל אביב',
    },
    {
      retailerName: 'Super-Pharm',
      price: 13.20,
      store: 'מול רמת אביב',
      distance: 2.1,
      city: 'תל אביב',
    },
    // Be Pharm locations
    {
      retailerName: 'Be Pharm',
      price: 11.50, // Best price
      store: 'רמת אביב מול',
      distance: 1.2,
      city: 'תל אביב',
    },
    {
      retailerName: 'Be Pharm',
      price: 12.10,
      store: 'אבן גבירול',
      distance: 1.8,
      city: 'תל אביב',
    },
    // Good Pharm locations
    {
      retailerName: 'Good Pharm',
      price: 13.80,
      store: 'יפו סנטר',
      distance: 2.5,
      city: 'תל אביב',
    },
    // Online option
    {
      retailerName: 'Super-Pharm',
      price: 10.90,
      store: 'Super-Pharm Online',
      isOnline: true,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi-Retailer Display Demo</Text>
      
      {/* Enhanced Product Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Card with Multi-Retailer Info</Text>
        <ProductCard
          product={demoProduct}
          onPress={() => console.log('Product pressed')}
        />
      </View>

      {/* Enhanced Price Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Comparison with Proximity</Text>
        <PriceComparisonTable prices={demoPrices} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: designTokens.spacing.lg,
    backgroundColor: designTokens.colors.background,
  },
  title: {
    fontSize: designTokens.typography.size.title,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    textAlign: 'center',
    marginBottom: designTokens.spacing.xl,
  },
  section: {
    marginBottom: designTokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.md,
  },
});

export default MultiRetailerDemo;