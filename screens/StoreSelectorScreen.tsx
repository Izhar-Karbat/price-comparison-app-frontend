import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { designTokens } from '../theme/designTokens';
import { RootStackParamList } from '../navigation/types';

type StoreSelectorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StoreSelector'>;
type StoreSelectorScreenRouteProp = RouteProp<RootStackParamList, 'StoreSelector'>;

interface Store {
  id: string;
  name: string;
  category: 'supermarket' | 'pharma' | 'electronics';
  distance?: number;
  isOnline?: boolean;
  logoChar: string;
}

interface FilterButton {
  key: string;
  label: string;
}

const allStoresData: Store[] = [
  { id: '1', name: 'Shufersal Deal', category: 'supermarket', distance: 1.2, logoChar: '🛒' },
  { id: '2', name: 'Rami Levy', category: 'supermarket', distance: 2.5, logoChar: '🛒' },
  { id: '3', name: 'Victory', category: 'supermarket', distance: 0.8, logoChar: '🛒' },
  { id: '4', name: 'Super-Pharm', category: 'pharma', distance: 0.7, logoChar: '💊' },
  { id: '5', name: 'Be Pharm', category: 'pharma', distance: 1.5, logoChar: '💊' },
  { id: '6', name: 'KSP', category: 'electronics', distance: 1.9, logoChar: '📱' },
  { id: '7', name: 'Bug', category: 'electronics', distance: 3.5, logoChar: '💻' },
  { id: '8', name: 'Shufersal Online', category: 'supermarket', isOnline: true, logoChar: '🛒' },
  { id: '9', name: 'GoodPharm', category: 'pharma', distance: 2.8, logoChar: '💊'},
];

const filterButtons: FilterButton[] = [
  { key: 'all', label: 'All Stores' },
  { key: 'supermarket', label: 'Supermarket' },
  { key: 'pharma', label: 'Pharmacy' },
  { key: 'electronics', label: 'Electronics' },
];

const StoreSelectorScreen: React.FC = () => {
  const navigation = useNavigation<StoreSelectorScreenNavigationProp>();
  const route = useRoute<StoreSelectorScreenRouteProp>();
  
  const { selectedStores: initialSelectedStores = [], onStoresSelected } = route.params || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>(initialSelectedStores);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredStores = allStoresData.filter(store => {
    const matchesSearch = searchTerm === '' || store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || store.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleStoreSelection = (storeId: string) => {
    setSelectedStoreIds(prevSelected =>
      prevSelected.includes(storeId)
        ? prevSelected.filter(id => id !== storeId)
        : [...prevSelected, storeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStoreIds.length === filteredStores.length && filteredStores.length > 0) {
      setSelectedStoreIds([]);
    } else {
      setSelectedStoreIds(filteredStores.map(store => store.id));
    }
  };

  const handleApplySelection = () => {
    if (onStoresSelected) {
      onStoresSelected(selectedStoreIds);
      console.log('Selected stores applied:', selectedStoreIds);
    } else {
      console.warn('onStoresSelected callback is undefined.');
    }
    navigation.goBack();
  };

  const renderStoreItem = ({ item }: { item: Store }) => {
    const isSelected = selectedStoreIds.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.storeItem, isSelected && styles.storeItemSelected]}
        onPress={() => toggleStoreSelection(item.id)}
      >
        <View style={styles.storeLogoContainer}>
          <Text style={styles.storeLogoChar}>{item.logoChar || item.name.charAt(0)}</Text>
        </View>
        <View style={styles.storeDetails}>
          <Text style={styles.storeName}>{item.name}</Text>
          {item.distance && <Text style={styles.storeDistance}>{item.distance} km</Text>}
          {item.isOnline && <Text style={styles.storeDistance}>Online</Text>}
        </View>
        <View style={isSelected ? styles.checkboxSelected : styles.checkboxNormal}>
          {isSelected && <Ionicons name="checkmark" size={18} color={designTokens.colors.white} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <Text style={styles.emptyListText}>No stores found matching your criteria.</Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={designTokens.colors.gray.dark} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores..."
            placeholderTextColor={designTokens.colors.gray.dark}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterButtons.map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  activeFilter === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter.key && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.selectAllContainer}>
          <Text style={styles.storesFoundText}>{filteredStores.length} stores found</Text>
          <TouchableOpacity onPress={handleSelectAll}>
            <Text style={styles.selectAllButtonText}>
              {selectedStoreIds.length === filteredStores.length && filteredStores.length > 0 ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredStores}
          renderItem={renderStoreItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={renderEmptyList}
        />

        {onStoresSelected && selectedStoreIds.length > 0 && (
          <View style={styles.applyButtonContainer}>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplySelection}>
              <Text style={styles.applyButtonText}>Apply Selection ({selectedStoreIds.length})</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.cardBackground,
    borderRadius: designTokens.borderRadius.round,
    marginHorizontal: designTokens.spacing.md,
    marginTop: designTokens.spacing.md,
    marginBottom: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    ...designTokens.shadows.sm,
  },
  searchIcon: {
    marginRight: designTokens.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.text,
  },
  filterContainer: {
    paddingHorizontal: designTokens.spacing.md,
    paddingBottom: designTokens.spacing.sm,
    paddingTop: designTokens.spacing.xs,
  },
  filterButton: {
    paddingVertical: designTokens.spacing.sm,
    paddingHorizontal: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.round,
    backgroundColor: designTokens.colors.cardBackground,
    marginRight: designTokens.spacing.sm,
    borderWidth: 1,
    borderColor: designTokens.colors.gray.light,
  },
  filterButtonActive: {
    backgroundColor: designTokens.colors.primary,
    borderColor: designTokens.colors.primary,
  },
  filterButtonText: {
    color: designTokens.colors.text,
    fontWeight: designTokens.typography.weight.medium,
    fontSize: designTokens.typography.size.small,
  },
  filterButtonTextActive: {
    color: designTokens.colors.white,
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.sm,
  },
  storesFoundText: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.textSecondary,
  },
  selectAllButtonText: {
    fontSize: designTokens.typography.size.small,
    color: designTokens.colors.primary,
    fontWeight: designTokens.typography.weight.semibold,
  },
  list: {
    flex: 1,
    paddingHorizontal: designTokens.spacing.md,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.cardBackground,
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.medium,
    marginBottom: designTokens.spacing.sm,
    ...designTokens.shadows.sm,
  },
  storeItemSelected: {
    borderColor: designTokens.colors.primary,
    borderWidth: 1.5,
  },
  storeLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designTokens.colors.gray.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens.spacing.sm,
  },
  storeLogoChar: {
    fontSize: 18,
    fontWeight: designTokens.typography.weight.bold,
    color: designTokens.colors.textSecondary,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: designTokens.typography.size.body,
    fontWeight: designTokens.typography.weight.semibold,
    color: designTokens.colors.text,
  },
  storeDistance: {
    fontSize: designTokens.typography.size.caption,
    color: designTokens.colors.textSecondary,
    marginTop: 2,
  },
  checkboxNormal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: designTokens.colors.gray.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: designTokens.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: designTokens.spacing.xl,
    fontSize: designTokens.typography.size.body,
    color: designTokens.colors.textSecondary,
  },
  applyButtonContainer: {
    paddingHorizontal: designTokens.spacing.md,
    paddingVertical: designTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.gray.light,
    backgroundColor: designTokens.colors.background,
  },
  applyButton: {
    backgroundColor: designTokens.colors.primary,
    paddingVertical: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.medium,
    alignItems: 'center',
    ...designTokens.shadows.md,
  },
  applyButtonText: {
    color: designTokens.colors.white,
    fontSize: designTokens.typography.size.button,
    fontWeight: designTokens.typography.weight.bold,
  },
});

export default StoreSelectorScreen;