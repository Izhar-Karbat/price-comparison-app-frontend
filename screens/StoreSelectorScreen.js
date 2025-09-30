// screens/StoreSelectorScreen.js
import React, { useState, useEffect } from 'react';
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

const allStoresData = [
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

export default function StoreSelectorScreen({ navigation, route }) {
  // NOTE: Receiving 'onStoresSelected' as a function in route.params
  // can lead to the "Non-serializable values" warning.
  // For complex state updates, consider a shared context or state manager.
  const { selectedStores: initialSelectedStores = [], onStoresSelected } = route.params || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStoreIds, setSelectedStoreIds] = useState(initialSelectedStores);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredStores = allStoresData.filter(store => {
    const matchesSearch = searchTerm === '' || store.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || store.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleStoreSelection = (storeId) => {
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

  const renderStoreItem = ({ item }) => {
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
          {isSelected && <Ionicons name="checkmark" size={18} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  const filterButtons = [
    { key: 'all', label: 'All Stores' },
    { key: 'supermarket', label: 'Supermarket' },
    { key: 'pharma', label: 'Pharmacy' },
    { key: 'electronics', label: 'Electronics' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores..."
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
          ListEmptyComponent={<Text style={styles.emptyListText}>No stores found matching your criteria.</Text>}
        />

        {/* Only show apply button if there's a callback and items are selected */}
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
}

// Styles (ensure these are complete and correct as per your project)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 5,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  storesFoundText: {
    fontSize: 14,
    color: '#666',
  },
  selectAllButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal:15,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  storeItemSelected: {
    borderColor: '#007AFF',
    borderWidth: 1.5,
  },
  storeLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeLogoChar: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  storeDistance: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  checkboxNormal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#B0B0B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
      textAlign: 'center',
      marginTop: 30,
      fontSize: 16,
      color: '#666'
  },
  applyButtonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
