// screens/DealsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../theme/designTokens';
import { fetchDeals, Deal } from '../services/api';
import DealCard from '../components/deals/DealCard';

const DealsScreen = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeals = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const dealsData = await fetchDeals();
      setDeals(dealsData);
    } catch (err) {
      console.error('Error loading deals:', err);
      setError(err instanceof Error ? err.message : 'Failed to load deals');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleRefresh = () => {
    loadDeals(true);
  };

  const handleDealPress = (deal: Deal) => {
    // TODO: Navigate to deal details or filtered products
    console.log('Deal pressed:', deal.title);
  };

  const renderDealItem = ({ item }: { item: Deal }) => (
    <DealCard deal={item} onPress={handleDealPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="pricetag-outline"
        size={80}
        color={designTokens.colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>No Deals Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for exclusive promotions and special offers!
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={80}
        color={designTokens.colors.danger}
      />
      <Text style={styles.emptyTitle}>Unable to Load Deals</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={designTokens.colors.primary} />
      <Text style={styles.loadingText}>Loading deals...</Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Deals & Promotions</Text>
        </View>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Deals & Promotions</Text>
        <Text style={styles.subtitle}>
          {deals.length} active {deals.length === 1 ? 'deal' : 'deals'}
        </Text>
      </View>

      {error ? (
        renderErrorState()
      ) : deals.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={deals}
          renderItem={renderDealItem}
          keyExtractor={(item) => `deal-${item.deal_id}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={designTokens.colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  header: {
    backgroundColor: designTokens.colors.white,
    padding: designTokens.spacing.lg,
    paddingTop: designTokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.cardBorder,
    ...designTokens.shadows.sm,
  },
  title: {
    fontSize: designTokens.typography.size.display,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginBottom: designTokens.spacing.xs,
  },
  subtitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
  listContainer: {
    padding: designTokens.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl,
  },
  emptyTitle: {
    fontSize: designTokens.typography.size.heading,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textPrimary,
    marginTop: designTokens.spacing.lg,
    marginBottom: designTokens.spacing.sm,
  },
  emptySubtitle: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: designTokens.spacing.xl,
  },
  retryButton: {
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    paddingHorizontal: designTokens.spacing.xl,
    borderRadius: designTokens.borderRadius.button,
    ...designTokens.shadows.primary,
  },
  retryButtonText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.button,
    fontWeight: designTokens.typography.weight.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.xl,
  },
  loadingText: {
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
    marginTop: designTokens.spacing.md,
  },
});

export default DealsScreen;