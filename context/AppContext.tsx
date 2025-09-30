// context/AppContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  isLoading: boolean;
  preferredPharmacy: string | null;
  setPreferredPharmacy: (pharmacy: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preferredPharmacy, setPreferredPharmacyState] = useState<string | null>(null);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [onboardingValue, pharmacyValue] = await Promise.all([
          AsyncStorage.getItem('@onboardingCompleted'),
          AsyncStorage.getItem('@preferredPharmacy')
        ]);

        if (onboardingValue !== null) {
          setHasOnboarded(JSON.parse(onboardingValue));
        }

        if (pharmacyValue !== null) {
          setPreferredPharmacyState(pharmacyValue);
        }
      } catch (e) {
        console.error("Failed to load app data.", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboardingCompleted', JSON.stringify(true));
      setHasOnboarded(true);
    } catch (e) {
      console.error("Failed to save onboarding status.", e);
    }
  };

  const setPreferredPharmacy = async (pharmacy: string) => {
    try {
      await AsyncStorage.setItem('@preferredPharmacy', pharmacy);
      setPreferredPharmacyState(pharmacy);
    } catch (e) {
      console.error("Failed to save preferred pharmacy.", e);
    }
  };

  return (
    <AppContext.Provider value={{
      hasOnboarded,
      completeOnboarding,
      isLoading,
      preferredPharmacy,
      setPreferredPharmacy
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// For backwards compatibility with existing code
export const useAppContext = useApp;