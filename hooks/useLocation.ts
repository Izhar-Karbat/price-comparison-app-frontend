// hooks/useLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface LocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

export const useLocation = (requestOnMount: boolean = false) => {
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null,
    hasPermission: false,
  });

  const checkPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking location permissions:', error);
      return false;
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setState(prev => ({ ...prev, hasPermission: granted }));
      return granted;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to request location permissions',
        hasPermission: false
      }));
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if we have permission first
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Location permission denied',
            hasPermission: false
          }));
          return null;
        }
      }

      // Get current location
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // 10 seconds timeout
      });

      const locationData: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy || undefined,
      };

      setState(prev => ({
        ...prev,
        location: locationData,
        isLoading: false,
        hasPermission: true,
        error: null
      }));

      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get current location'
      }));
      return null;
    }
  };

  // Auto-request location on mount if requested
  useEffect(() => {
    if (requestOnMount) {
      getCurrentLocation();
    } else {
      // Just check permissions without requesting location
      checkPermissions().then(hasPermission => {
        setState(prev => ({ ...prev, hasPermission }));
      });
    }
  }, [requestOnMount]);

  return {
    ...state,
    getCurrentLocation,
    requestPermissions,
    checkPermissions,
  };
};