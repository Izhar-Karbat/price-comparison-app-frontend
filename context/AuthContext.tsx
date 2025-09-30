// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  userToken: string | null;
  username: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// Helper function to safely use SecureStore (handles web fallback)
const secureStoreAvailable = async (): Promise<boolean> => {
  try {
    // Check if we're on a platform that supports SecureStore
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
};

// Wrapper functions for secure storage with fallback to memory storage for web
const secureSetItem = async (key: string, value: string): Promise<void> => {
  if (await secureStoreAvailable()) {
    await SecureStore.setItemAsync(key, value);
  } else {
    // Fallback for web/unsupported platforms - store in memory only
    console.warn('SecureStore not available, using memory storage');
  }
};

const secureGetItem = async (key: string): Promise<string | null> => {
  if (await secureStoreAvailable()) {
    return await SecureStore.getItemAsync(key);
  } else {
    // Fallback for web/unsupported platforms
    console.warn('SecureStore not available, returning null');
    return null;
  }
};

const secureDeleteItem = async (key: string): Promise<void> => {
  if (await secureStoreAvailable()) {
    await SecureStore.deleteItemAsync(key);
  } else {
    // Fallback for web/unsupported platforms
    console.warn('SecureStore not available');
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const signIn = async (token: string, name: string): Promise<void> => {
    try {
      setIsLoading(true);
      setUserToken(token);
      setUsername(name);

      // Use secure storage for sensitive data
      await secureSetItem('userToken', token);
      await secureSetItem('username', name);
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setUserToken(null);
      setUsername('');

      // Remove from secure storage
      await secureDeleteItem('userToken');
      await secureDeleteItem('username');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = await secureGetItem('userToken');
      const name = await secureGetItem('username');

      if (token) {
        setUserToken(token);
        setUsername(name);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthState = {
    userToken,
    username,
    isLoading,
    isAuthenticated: !!userToken,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context for direct use if needed
export { AuthContext };

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};