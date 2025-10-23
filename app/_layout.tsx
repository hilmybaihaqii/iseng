import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../context/AuthContext'; // Pastikan path ini benar

// Mencegah splash screen hilang otomatis
SplashScreen.preventAutoHideAsync();

// Komponen terpisah untuk menggunakan hook useAuth
function RootLayoutNav() {
  const { isLoading: isAuthLoading } = useAuth(); // Ambil status loading auth

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Sembunyikan splash screen setelah font & auth siap
  useEffect(() => {
    if (fontsLoaded && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isAuthLoading]);

  // Tampilkan null jika font belum siap ATAU auth masih loading
  if (!fontsLoaded || isAuthLoading) {
    return null;
  }

  return (
      <Stack screenOptions={{ headerShown: false }}>
        {/* Halaman index (welcome/onboarding) */}
        <Stack.Screen name="index" />
        {/* Grup halaman autentikasi (login, forgot, device-id) */}
        <Stack.Screen name="(auth)" />
        {/* Grup halaman utama setelah login (home, settings, etc.) */}
        <Stack.Screen name="(tabs)" />
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}