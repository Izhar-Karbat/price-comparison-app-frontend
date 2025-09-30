// components/product/PriceComparisonTable.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../theme/designTokens';

export interface PriceInfo {
  retailerName: string;
  price: number;
  store: string; // Make store required to fix ProductDetailsScreen usage
  distance?: number; // Distance in km
  city?: string;
  isOnline?: boolean;
}

interface PriceComparisonTableProps {
  prices: PriceInfo[];
}

const PriceComparisonTable: React.FC<PriceComparisonTableProps> = ({ prices }) => {
  if (!prices || prices.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No price information available.</Text>
      </View>
    );
  }
  
  // Find the cheapest price to highlight it
  const cheapestPrice = Math.min(...prices.map(p => p.price));
  
  // Group prices by retailer and sort by distance
  const pricesByRetailer = prices.reduce((acc, item) => {
    if (!acc[item.retailerName]) {
      acc[item.retailerName] = [];
    }
    acc[item.retailerName].push(item);
    return acc;
  }, {} as Record<string, PriceInfo[]>);
  
  // Sort stores within each retailer by distance (closest first)
  Object.keys(pricesByRetailer).forEach(retailer => {
    pricesByRetailer[retailer].sort((a, b) => {
      if (a.distance && b.distance) return a.distance - b.distance;
      if (a.distance && !b.distance) return -1;
      if (!a.distance && b.distance) return 1;
      return 0;
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Price Comparison Across Retailers</Text>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {Object.entries(pricesByRetailer).map(([retailer, retailerPrices], index) => {
          const lowestRetailerPrice = Math.min(...retailerPrices.map(p => p.price));
          const isRetailerCheapest = lowestRetailerPrice === cheapestPrice;
          
          return (
            <View key={index} style={styles.retailerSection}>
              <View style={[styles.retailerHeader, isRetailerCheapest && styles.cheapestRetailerHeader]}>
                <Text style={[styles.retailerTitle, isRetailerCheapest && styles.cheapestRetailerTitle]}>
                  {retailer}
                </Text>
                {isRetailerCheapest && (
                  <View style={styles.bestPriceBadge}>
                    <Ionicons name="trophy" size={16} color={designTokens.colors.white} />
                    <Text style={styles.bestPriceText}>Best Price</Text>
                  </View>
                )}
              </View>
              {retailerPrices.map((item, idx) => {
                const isCheapest = item.price === cheapestPrice;
                return (
                  <View key={idx} style={[styles.row, isCheapest && styles.cheapestRow]}>
                    <View style={styles.storeInfo}>
                      <Ionicons 
                        name={item.isOnline ? "globe-outline" : "location-outline"} 
                        size={16} 
                        color={isCheapest ? designTokens.colors.white : designTokens.colors.textSecondary} 
                      />
                      <View style={styles.storeDetails}>
                        <Text style={[styles.storeName, isCheapest && styles.cheapestText]}>
                          {item.store}
                        </Text>
                        {item.distance && (
                          <Text style={[styles.distanceText, isCheapest && styles.cheapestText]}>
                            {item.distance.toFixed(1)}km away
                          </Text>
                        )}
                        {item.isOnline && (
                          <Text style={[styles.onlineText, isCheapest && styles.cheapestText]}>
                            Online Store
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text style={[styles.price, isCheapest && styles.cheapestPrice]}>
                      ₪{item.price.toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Lowest price: ₪{cheapestPrice.toFixed(2)} • {prices.length} stores available
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: designTokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: designTokens.typography.size.xl,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.md,
    letterSpacing: designTokens.typography.letterSpacing.tight,
  },
  scrollContainer: {
    maxHeight: 400,
  },
  emptyContainer: {
    padding: designTokens.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
  retailerSection: {
    marginBottom: designTokens.spacing.md,
    backgroundColor: designTokens.colors.cardBackground,
    borderRadius: designTokens.borderRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: designTokens.colors.cardBorder,
    ...designTokens.shadows.sm,
  },
  retailerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.md,
    backgroundColor: designTokens.colors.backgroundSecondary,
  },
  cheapestRetailerHeader: {
    backgroundColor: designTokens.colors.primary,
  },
  retailerTitle: {
    fontSize: designTokens.typography.size.subheading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    letterSpacing: designTokens.typography.letterSpacing.tight,
  },
  cheapestRetailerTitle: {
    color: designTokens.colors.white,
  },
  bestPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.success,
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.borderRadius.small,
  },
  bestPriceText: {
    fontSize: designTokens.typography.size.caption,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.white,
    marginLeft: designTokens.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.gray.light,
  },
  cheapestRow: {
    backgroundColor: designTokens.colors.success,
  },
  storeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeDetails: {
    flex: 1,
    marginLeft: designTokens.spacing.xs,
  },
  storeName: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.typography.weight.semibold,
  },
  distanceText: {
    fontSize: designTokens.typography.size.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  onlineText: {
    fontSize: designTokens.typography.size.caption,
    color: designTokens.colors.primary,
    fontWeight: designTokens.typography.weight.semibold,
    marginTop: 2,
  },
  price: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.text,
    marginLeft: designTokens.spacing.sm,
  },
  cheapestPrice: {
    color: designTokens.colors.white,
  },
  cheapestText: {
    color: designTokens.colors.white,
  },
  summaryContainer: {
    marginTop: designTokens.spacing.md,
    padding: designTokens.spacing.md,
    backgroundColor: designTokens.colors.background,
    borderRadius: designTokens.borderRadius.medium,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
    fontWeight: designTokens.typography.weight.semibold,
  },
});

export default PriceComparisonTable;