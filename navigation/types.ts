// navigation/types.ts
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { Product } from '../types';

// Defines all screens in the main stack navigator
export type RootStackParamList = {
  MainApp: undefined;
  Onboarding: undefined;
  ProductDetails: { productId: string; productData?: Product };
  SavedItems: undefined;
  Scanner: undefined;
  VisualSearch: undefined;
  Login: undefined;
  SignUp: undefined;
  Invitations: undefined;
  Settings: undefined;
  Profile: undefined;
  ProductSearch: { searchQuery?: string };
  PriceComparison: { productId: string; productName: string };
  StoreSelector: { selectedStores?: string[]; onStoresSelected?: (storeIds: string[]) => void };
};

// Defines screens in the onboarding flow
export type OnboardingStackParamList = {
  Welcome: undefined;
  Preferences: undefined;
  Notifications: undefined;
};

// Defines all tabs in the bottom tab navigator
export type MainAppTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Cart: undefined;
  Account: undefined;
};

// This creates a special composite type for screens within the tab navigator.
// It tells them about their own tab navigator props AND the parent stack navigator props.
export type MainAppScreenProps<T extends keyof MainAppTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainAppTabParamList, T>,
    StackScreenProps<RootStackParamList>
  >;