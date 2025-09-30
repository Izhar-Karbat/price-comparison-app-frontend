// screens/PremiumFeaturesDemo.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { designTokens } from '../theme/designTokens';
import SwipeableProductCard from '../components/ui/SwipeableProductCard';
import SmartLocationCard from '../components/ui/SmartLocationCard';
import AnimatedSavingsIndicator from '../components/ui/AnimatedSavingsIndicator';

const PremiumFeaturesDemo: React.FC = () => {
  // Sample product with savings
  const sampleProduct = {
    masterproductid: '1',
    productName: 'ויטמין D3 1000 יח״ב',
    brand: 'Supherb',
    image: 'https://via.placeholder.com/80x80',
    imageUrl: 'https://via.placeholder.com/80x80',
    price: 45.90,
    originalPrice: 59.90,
    healthScore: 92,
    retailer_count: 3,
    store_count: 12,
  };

  // Sample store location
  const sampleStore = {
    storeName: 'סופר-פארם דיזנגוף',
    retailerName: 'Super-Pharm',
    address: 'דיזנגוף סנטר, קומת הכניסה',
    city: 'תל אביב',
    distance: 0.8,
    price: 45.90,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🚀 Premium Features Demo</Text>
        <Text style={styles.subtitle}>Experience the enhanced PharmMate UI</Text>

        {/* Animated Savings Indicator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Animated Savings Indicator</Text>
          <Text style={styles.sectionDescription}>
            Pulsing animations for great deals with visual impact
          </Text>
          <View style={styles.demoContainer}>
            <AnimatedSavingsIndicator
              originalPrice={59.90}
              currentPrice={45.90}
              size="large"
            />
          </View>
        </View>

        {/* Smart Location Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Smart Location Card</Text>
          <Text style={styles.sectionDescription}>
            Live distance tracking with one-tap navigation
          </Text>
          <SmartLocationCard
            store={sampleStore}
            onNavigate={() => console.log('Navigate to store')}
          />
        </View>

        {/* Swipeable Product Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👆 Swipeable Product Cards</Text>
          <Text style={styles.sectionDescription}>
            Swipe right to add to cart, left to save for later
          </Text>
          <SwipeableProductCard
            product={sampleProduct}
            onSwipeRight={() => console.log('Added to cart!')}
            onSwipeLeft={() => console.log('Saved for later!')}
            onPress={() => console.log('Product pressed')}
          />
        </View>

        {/* Feature Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Enhanced Features</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Haptic feedback on interactions</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📸</Text>
              <Text style={styles.featureText}>Visual search with AI ready</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureText}>Best price highlighting</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚶‍♂️</Text>
              <Text style={styles.featureText}>Walking time estimates</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔄</Text>
              <Text style={styles.featureText}>Smooth spring animations</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💊</Text>
              <Text style={styles.featureText}>Health-focused design</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎨 PharmMate Premium Experience
          </Text>
          <Text style={styles.footerSubtext}>
            Delightful interactions for better health decisions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  title: {
    fontSize: designTokens.typography.size.heading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.primary,
    textAlign: 'center',
    marginTop: designTokens.spacing.xl,
    marginBottom: designTokens.spacing.sm,
  },
  subtitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
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
    marginBottom: designTokens.spacing.xs,
    paddingHorizontal: designTokens.spacing.lg,
  },
  sectionDescription: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginBottom: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.lg,
  },
  demoContainer: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.lg,
  },
  featureList: {
    paddingHorizontal: designTokens.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
    backgroundColor: designTokens.colors.white,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.medium,
    ...designTokens.shadows.sm,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: designTokens.spacing.md,
  },
  featureText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.text,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: designTokens.spacing.xl,
    marginTop: designTokens.spacing.xl,
  },
  footerText: {
    fontSize: designTokens.typography.size.large,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.primary,
    marginBottom: designTokens.spacing.xs,
  },
  footerSubtext: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
});

export default PremiumFeaturesDemo;