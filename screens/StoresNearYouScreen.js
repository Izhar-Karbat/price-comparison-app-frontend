// screens/StoresNearYouScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Mock store data - replace with actual data fetching later
const mockStoresData = [
  { id: 's1', name: 'Shufersal Holon Center', category: 'supermarket', latitude: 32.0170, longitude: 34.7736, address: '123 Main St, Holon', isOpen: true, closingTime: '22:00' },
  { id: 's2', name: 'Rami Levy Holon', category: 'supermarket', latitude: 32.0205, longitude: 34.7760, address: '456 Second Ave, Holon', isOpen: true, closingTime: '23:00' },
  { id: 'p1', name: 'Super-Pharm Azrieli Holon', category: 'pharma', latitude: 32.0150, longitude: 34.7700, address: '789 Azrieli Mall, Holon', isOpen: true, closingTime: '21:30' },
  { id: 'e1', name: 'KSP Holon', category: 'electronics', latitude: 32.0188, longitude: 34.7785, address: '101 Tech Rd, Holon', isOpen: false, closingTime: '19:00' },
];
// Use Holon, Israel as a default center if location fails
const DEFAULT_LOCATION = {
  latitude: 32.0167, // Holon latitude
  longitude: 34.7707, // Holon longitude
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function StoresNearYouScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [stores, setStores] = useState(mockStoresData); // Use mock data for now
  const [mapRegion, setMapRegion] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable it in settings.');
        setLoading(false);
        // Keep mapRegion as DEFAULT_LOCATION
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        const userLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
        setLocation(userLocation);
        setMapRegion({
          ...userLocation,
          latitudeDelta: 0.03, // Zoom level
          longitudeDelta: 0.02,
        });
        // Later, you would fetch stores based on userLocation
      } catch (e) {
        setErrorMsg('Could not get your location. Using default location.');
        // Keep mapRegion as DEFAULT_LOCATION
        console.error("Error getting location:", e);
      }
      setLoading(false);
    })();
  }, []);

  const openMapsApp = (latitude, longitude, label) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  const renderStoreItem = ({ item }) => (
    <TouchableOpacity 
        style={styles.storeItem} 
        onPress={() => setMapRegion({ ...item, latitudeDelta: 0.01, longitudeDelta: 0.01})} // Zoom to store on map
    >
      <View style={styles.itemIconContainer}>
        <Ionicons 
            name={item.category === 'supermarket' ? 'cart' : item.category === 'pharma' ? 'medkit' : 'hardware-chip'} 
            size={24} 
            color="#007AFF" 
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemAddress}>{item.address}</Text>
        <Text style={item.isOpen ? styles.itemOpen : styles.itemClosed}>
          {item.isOpen ? `Open until ${item.closingTime}` : 'Closed'}
        </Text>
      </View>
      <TouchableOpacity onPress={() => openMapsApp(item.latitude, item.longitude, item.name)} style={styles.directionsButton}>
        <Ionicons name="navigate-circle-outline" size={28} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {errorMsg && !location && ( // Only show prominent error if location truly failed
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
         {/* Show error message more subtly if location is available but there was an issue */}
        {errorMsg && location && <Text style={styles.infoText}>{errorMsg}</Text>}


        <MapView style={styles.map} region={mapRegion} showsUserLocation={true} followsUserLocation={false}>
          {stores.map(store => (
            <Marker
              key={store.id}
              coordinate={{ latitude: store.latitude, longitude: store.longitude }}
              title={store.name}
              description={store.address}
            >
              <Ionicons 
                name={store.category === 'supermarket' ? 'cart' : store.category === 'pharma' ? 'medkit' : 'hardware-chip'} 
                size={28} 
                color={store.category === 'supermarket' ? '#FF3B30' : store.category === 'pharma' ? '#34C759' : '#007AFF'} 
              />
              <Callout onPress={() => openMapsApp(store.latitude, store.longitude, store.name)}>
                <View style={styles.calloutView}>
                  <Text style={styles.calloutTitle}>{store.name}</Text>
                  <Text>{store.address}</Text>
                  <Text style={styles.calloutDirections}>Get Directions</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <FlatList
          data={stores}
          renderItem={renderStoreItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ListHeaderComponent={<Text style={styles.listHeader}>Nearby Stores</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFDDDD',
    alignItems: 'center',
  },
  errorText: {
    color: '#D8000C',
    textAlign: 'center',
    fontSize: 15,
  },
  infoText: {
    textAlign: 'center',
    padding: 5,
    backgroundColor: '#FFF3CD',
    color: '#856404'
  },
  map: {
    height: '45%', // Adjust height as needed
    width: '100%',
  },
  list: {
    flex: 1, // Takes remaining space
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    color: '#333',
  },
  storeItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemAddress: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  itemOpen: {
    fontSize: 13,
    color: '#34C759', // Green for open
    marginTop: 2,
  },
  itemClosed: {
    fontSize: 13,
    color: '#FF3B30', // Red for closed
    marginTop: 2,
  },
  directionsButton: {
    paddingLeft: 10, // Space from details to button
  },
  calloutView: {
    padding: 5,
    width: 150, // Adjust as needed
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  calloutDirections: {
    color: '#007AFF',
    marginTop: 3,
  }
});