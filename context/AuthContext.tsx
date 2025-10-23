import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Types ---
interface User {
  id: string;
  name: string;
  role: 'superuser' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setDeviceIdComplete: () => Promise<void>;
}

// --- Context Definition ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeviceIdNeeded, setIsDeviceIdNeeded] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Initial Auth Status Check
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true); // Ensure loading starts
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        const deviceIdStatus = await AsyncStorage.getItem('deviceIdComplete');

        if (storedToken && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          if (parsedUser.role === 'superuser' && deviceIdStatus !== 'true') {
            setIsDeviceIdNeeded(true);
          } else {
            setIsDeviceIdNeeded(false);
          }
        } else {
          setUser(null);
          setToken(null);
          setIsDeviceIdNeeded(false);
        }
      } catch (e) {
        console.error("AuthContext: Failed to load auth status:", e);
        // Ensure states are reset on error
        setUser(null);
        setToken(null);
        setIsDeviceIdNeeded(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []); // Run only once on mount

  // Route Protection Effect
  useEffect(() => {
    // Skip logic until initial loading is complete
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const currentRoute = segments.join('/') || 'index'; // Handle root index case ('/')

    // User NOT logged in:
    if (!user) {
      // If not in auth group AND not already on the index/welcome screen, redirect to login
      if (!inAuthGroup && currentRoute !== 'index') {
        router.replace('/(auth)/login');
      }
    }
    // User IS logged in:
    else {
      // If superuser needs device ID AND is not on the device ID screen
      if (isDeviceIdNeeded && currentRoute !== '(auth)/device-id') {
        router.replace('/(auth)/device-id');
      }
      // If logged in, device ID not needed, BUT still in the auth group (e.g., login, device-id)
      else if (!isDeviceIdNeeded && inAuthGroup) {
        router.replace('/(tabs)/home');
      }
    }
    // No explicit 'else' needed here, as no action is required if conditions aren't met

  }, [user, isDeviceIdNeeded, segments, isLoading, router]); // Dependencies trigger re-evaluation

  // --- Context Functions ---
  const login = async (userData: User, userToken: string) => {
    try {
      // Set user state first, which will trigger useEffect
      setUser(userData);
      setToken(userToken);
      if (userData.role === 'superuser') {
        setIsDeviceIdNeeded(true);
      } else {
        setIsDeviceIdNeeded(false);
      }
      // Persist data after setting state
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.removeItem('deviceIdComplete'); // Reset on new login
    } catch (e) {
      console.error("AuthContext: Failed to save auth data during login:", e);
       // Reset state on error? Consider adding setUser(null), setToken(null) here
    }
  };

  const logout = async () => {
    try {
      // Set user state to null first, which will trigger useEffect
      setUser(null);
      setToken(null);
      setIsDeviceIdNeeded(false);
      // Clear persisted data
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('deviceIdComplete');
      // Explicitly redirect to Welcome screen AFTER clearing data
      router.replace('/');
    } catch (e) {
      console.error("AuthContext: Failed to clear auth data during logout:", e);
    }
  };

  const setDeviceIdComplete = async () => {
    try {
      // Set state first, which will trigger useEffect
      setIsDeviceIdNeeded(false);
      // Persist the completion status
      await AsyncStorage.setItem('deviceIdComplete', 'true');
    } catch (e) {
      console.error("AuthContext: Failed to set device ID status:", e);
    }
  };

  // --- Provider Value ---
  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setDeviceIdComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};