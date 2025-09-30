// navigation/MainAppNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DevSettings, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import the icon library
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreenV2 from '../screens/HomeScreenV2';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AccountScreen from '../screens/AccountScreen';
import ScannerScreen from '../screens/ScannerScreen';
import DealsScreen from '../screens/DealsScreen';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import CustomTabBar from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();

export function MainAppNavigator() {
  const { theme } = useTheme();
  const { getCartItemCount } = useCart();
  const { favorites } = useFavorites();
  const cartItemCount = getCartItemCount();
  const favoritesCount = favorites.length;

  // Reset handler for clearing onboarding state
  const handleReset = async () => {
    try {
      console.log("Resetting onboarding state...");
      // Clear the onboarding completion flag and preferred retailer
      await AsyncStorage.removeItem('@onboardingCompleted');
      await AsyncStorage.removeItem('@preferredRetailer');

      // Show confirmation and reload
      Alert.alert(
        'Reset Complete',
        'The app will now reload to start onboarding.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Use DevSettings to reload in development
              if (__DEV__ && DevSettings) {
                DevSettings.reload();
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      Alert.alert('Error', 'Failed to reset onboarding state.');
    }
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenV2}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Deals"
        component={DealsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: false,
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}