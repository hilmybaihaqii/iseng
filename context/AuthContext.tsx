import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Types ---
export interface User {
  id: string;
  name: string;
  role: 'superuser' | 'user';
  email?: string;
  profilePicUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setDeviceIdComplete: () => Promise<void>;
  updateUserData: (updatedData: Partial<User>) => Promise<void>;
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

  // Initial Auth Status Check (Revised Logic)
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      let needsDeviceId = false; // Default to false
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        const deviceIdStatus = await AsyncStorage.getItem('deviceIdComplete');

        if (storedToken && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          // Set needsDeviceId ONLY if superuser AND status is not 'true'
          if (parsedUser.role === 'superuser' && deviceIdStatus !== 'true') {
            needsDeviceId = true;
          }
          // Otherwise, it remains false (default)
        } else {
          // Ensure states are reset if no user/token found
          setUser(null);
          setToken(null);
          needsDeviceId = false;
        }
      } catch (e) {
        console.error("AuthContext: Failed to load auth status:", e);
        setUser(null);
        setToken(null);
        needsDeviceId = false; // Ensure false on error
      } finally {
        setIsDeviceIdNeeded(needsDeviceId); // Set state ONCE at the end
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []); // Run only once on mount

  // Route Protection Effect
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const currentRoute = segments.join('/') || 'index';

    if (!user) {
      if (!inAuthGroup && currentRoute !== 'index') {
        router.replace('/(auth)/login');
      }
    } else {
      if (isDeviceIdNeeded && currentRoute !== '(auth)/device-id') {
        router.replace('/(auth)/device-id');
      } else if (!isDeviceIdNeeded && inAuthGroup) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, isDeviceIdNeeded, segments, isLoading, router]);

  // --- Context Functions ---
  const login = async (userData: User, userToken: string) => {
    try {
      setUser(userData);
      setToken(userToken);
      // Determine device ID need based ONLY on the freshly logged-in user's role
      if (userData.role === 'superuser') {
        setIsDeviceIdNeeded(true);
      } else {
        setIsDeviceIdNeeded(false);
      }
      // Persist data and reset device ID status for the new session
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.removeItem('deviceIdComplete');
    } catch (e) {
      console.error("AuthContext: Failed to save auth data during login:", e);
      setUser(null);
      setToken(null);
      setIsDeviceIdNeeded(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      setIsDeviceIdNeeded(false);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('deviceIdComplete');
      router.replace('/');
    } catch (e) {
      console.error("AuthContext: Failed to clear auth data during logout:", e);
    }
  };

  const setDeviceIdComplete = async () => {
    try {
      // Update state first
      setIsDeviceIdNeeded(false);
      // Then persist the status
      await AsyncStorage.setItem('deviceIdComplete', 'true');
    } catch (e) {
      console.error("AuthContext: Failed to set device ID status:", e);
    }
  };

  const updateUserData = async (updatedData: Partial<User>) => {
    if (!user) return; // Only update if user is logged in
    try {
      const newUser = { ...user, ...updatedData };
      setUser(newUser); // Update context state
      // Update storage without touching token or deviceIdComplete
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      console.log("AuthContext: User data updated.");
    } catch (e) {
       console.error("AuthContext: Failed to update user data:", e);
    }
  };

  // --- Provider Value ---
  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setDeviceIdComplete, updateUserData }}>
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