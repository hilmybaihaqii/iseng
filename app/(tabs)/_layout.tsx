import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Settings, History, Bell } from 'lucide-react-native';
import { Platform, Pressable } from 'react-native';
import MyLogo from '../../assets/logo/o.svg';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#E53E3E',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          backgroundColor: '#1A202C',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          height: Platform.OS === 'android' ? 75 : 95,
          paddingBottom: Platform.OS === 'android' ? 15 : 35,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-Regular',
        },

        // Custom Header Styling
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1A202C',
          shadowOpacity: 0,
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleAlign: 'center',
        headerTitle: '', // Hapus judul teks default

        // Header Kiri: Logo
        headerLeft: () => (
          <Pressable
            onPress={() => router.push('/(tabs)/home')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <MyLogo width={40} height={40} style={{ marginLeft: 15 }} />
          </Pressable>
        ),

        // Header Kanan: Notifikasi
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => ({
              marginRight: 15,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Bell size={30} color="#FFFFFF" style={{ marginRight: 15 }} />
          </Pressable>
        ),
      }}
    >
      {/* Definisi Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}