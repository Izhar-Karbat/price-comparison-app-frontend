// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainAppNavigator } from './navigation/MainAppNavigator';
import OnboardingNavigator from './navigation/OnboardingNavigator';
import { useTheme } from './context/ThemeContext';
import { Product } from './types';

// Import all screens
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import SavedItemsScreen from './screens/SavedItemsScreen';
import ScannerScreen from './screens/ScannerScreen';
import VisualSearchScreen from './screens/VisualSearchScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import InvitationsScreen from './screens/InvitationsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductSearchScreen from './screens/ProductSearchScreen';
import PriceComparisonScreen from './screens/PriceComparisonScreen';
import PreviewThemeScreen from './screens/PreviewThemeScreen';

// Define the parameter list for type safety
export type RootStackParamList = {
  MainApp: undefined;
  Onboarding: undefined;
  ProductSearch: { searchQuery?: string };
  ProductDetails: { productId: string; productData?: Product };
  PriceComparison: { productId: string; productName: string };
  SavedItems: undefined;
  Scanner: undefined;
  VisualSearch: undefined;
  Login: undefined;
  SignUp: undefined;
  Invitations: undefined;
  Settings: undefined;
  Profile: undefined;
  PreviewTheme: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
  const { hasOnboarded, isLoading } = useApp();
  const { theme } = useTheme();

  if (isLoading) {
    // Show a loading spinner while we check onboarding status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        initialRouteName={hasOnboarded ? "MainApp" : "Onboarding"}
      >
        {hasOnboarded ? (
          <>
            <Stack.Screen name="MainApp" component={MainAppNavigator} />
            <Stack.Screen name="ProductSearch" component={ProductSearchScreen} />
            <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
            <Stack.Screen name="PriceComparison" component={PriceComparisonScreen} />
            <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="VisualSearch" component={VisualSearchScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Invitations" component={InvitationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PreviewTheme" component={PreviewThemeScreen} />
          </>
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <AppContent />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}