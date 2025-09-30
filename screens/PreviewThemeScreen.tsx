// screens/PreviewThemeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const PreviewThemeScreen = () => {
  const { theme, toggleTheme } = useTheme();

  const mockProduct = {
    masterproductid: '1',
    productName: 'Vitamin C 1000mg',
    brand: 'Nature Made',
    price: 29.99,
    originalPrice: 34.99,
    healthScore: 95,
    imageUrl: 'https://via.placeholder.com/200x200?text=Vitamin+C',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            PharmMate – {theme.mode === 'feminine' ? 'Feminine' : 'Masculine'} Theme
          </Text>
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: theme.colors.primary }]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={theme.mode === 'feminine' ? 'moon' : 'sunny'}
              size={20}
              color={theme.colors.textPrimary}
            />
            <Text style={[styles.toggleText, { color: theme.colors.textPrimary }]}>
              Switch to {theme.mode === 'feminine' ? 'Masculine' : 'Feminine'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Color Palette */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Color Palette
          </Text>
          <View style={styles.colorGrid}>
            {Object.entries(theme.colors).slice(0, 8).map(([colorName, colorValue]) => (
              <View key={colorName} style={styles.colorItem}>
                <View
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: colorValue as string },
                    colorName.includes('text') && { borderWidth: 1, borderColor: theme.colors.gray.medium },
                  ]}
                />
                <Text style={[styles.colorName, { color: theme.colors.textSecondary }]}>
                  {colorName}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Product Card Sample */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Product Card
          </Text>
          <View style={[styles.productCard, { backgroundColor: theme.colors.cardBackground }, theme.shadows.sm]}>
            <View style={[styles.productImagePlaceholder, { backgroundColor: theme.colors.gray.light }]}>
              <Ionicons name="image-outline" size={40} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: theme.colors.textPrimary }]}>
                {mockProduct.productName}
              </Text>
              <Text style={[styles.productBrand, { color: theme.colors.textSecondary }]}>
                {mockProduct.brand}
              </Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: theme.colors.priceTag }]}>
                  ₪{mockProduct.price}
                </Text>
                {mockProduct.originalPrice && (
                  <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
                    ₪{mockProduct.originalPrice}
                  </Text>
                )}
              </View>
              <View style={[styles.healthScoreBadge, { backgroundColor: theme.colors.success }]}>
                <Text style={[styles.healthScoreText, { color: theme.colors.white }]}>
                  Health Score: {mockProduct.healthScore}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Buttons & Actions
          </Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.buttonText, { color: theme.colors.textPrimary }]}>
                Primary Button
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.colors.accent }]}>
              <Text style={[styles.buttonText, { color: theme.colors.textPrimary }]}>
                Secondary Button
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.outlineButton, { borderColor: theme.colors.primary }]}>
              <Text style={[styles.outlineButtonText, { color: theme.colors.primary }]}>
                Outline Button
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Typography */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Typography
          </Text>
          <View style={styles.typographyContainer}>
            <Text style={[{ fontSize: theme.typography.size.display, fontWeight: theme.typography.weight.bold, color: theme.colors.textPrimary }]}>
              Display Text
            </Text>
            <Text style={[{ fontSize: theme.typography.size.heading, fontWeight: theme.typography.weight.semibold, color: theme.colors.textPrimary }]}>
              Heading Text
            </Text>
            <Text style={[{ fontSize: theme.typography.size.title, fontWeight: theme.typography.weight.medium, color: theme.colors.textPrimary }]}>
              Title Text
            </Text>
            <Text style={[{ fontSize: theme.typography.size.body, color: theme.colors.textPrimary }]}>
              Body text for regular content and descriptions.
            </Text>
            <Text style={[{ fontSize: theme.typography.size.small, color: theme.colors.textSecondary }]}>
              Small text for captions and secondary information.
            </Text>
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Service Cards
          </Text>
          <View style={styles.serviceGrid}>
            <View style={[styles.serviceCard, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="analytics" size={24} color={theme.colors.white} />
              <Text style={[styles.serviceTitle, { color: theme.colors.white }]}>
                Compare Prices
              </Text>
            </View>
            <View style={[styles.serviceCard, { backgroundColor: theme.colors.accent }]}>
              <Ionicons name="location" size={24} color={theme.colors.white} />
              <Text style={[styles.serviceTitle, { color: theme.colors.white }]}>
                Find Pharmacy
              </Text>
            </View>
            <View style={[styles.serviceCard, { backgroundColor: theme.colors.secondary }]}>
              <Ionicons name="scan" size={24} color={theme.colors.textPrimary} />
              <Text style={[styles.serviceTitle, { color: theme.colors.textPrimary }]}>
                Scan Product
              </Text>
            </View>
            <View style={[styles.serviceCard, { backgroundColor: theme.colors.priceTag }]}>
              <Ionicons name="camera" size={24} color={theme.colors.white} />
              <Text style={[styles.serviceTitle, { color: theme.colors.white }]}>
                Visual Search
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorItem: {
    alignItems: 'center',
    width: '22%',
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  colorName: {
    fontSize: 12,
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  healthScoreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthScoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonGrid: {
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  outlineButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  typographyContainer: {
    gap: 12,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PreviewThemeScreen;