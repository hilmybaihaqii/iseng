import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Settings, History, Bell } from 'lucide-react-native';
import { Platform, Pressable } from 'react-native';
import MyLogo from '../../assets/logo/o.svg'; // Path logo Anda

export default function TabLayout() {
  const router = useRouter();
  const headerIconColor = '#1F2937'; // abu tua
  const activeTabColor = '#E43636';   // Warna primary dari config
  const inactiveTabColor = '#A0AEC0'; // abu muda

  return (
    <Tabs
      screenOptions={{
        // Gunakan variabel untuk warna tab bar
        tabBarActiveTintColor: activeTabColor,
        tabBarInactiveTintColor: inactiveTabColor,
        tabBarStyle: {
          backgroundColor: '#FFFFFF', // Putih
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.03,
          shadowRadius: 2,
          elevation: 2,
          height: Platform.OS === 'android' ? 75 : 95,
          paddingBottom: Platform.OS === 'android' ? 15 : 35,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-Regular',
        },

        // Header Styling
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF', // Putih
          shadowOpacity: 0.05,
          elevation: 2,
          borderBottomWidth: Platform.OS === 'android' ? 0 : 1,
          borderBottomColor: '#E5E7EB',
        },
        // Gunakan variabel untuk warna header
        headerTintColor: headerIconColor,
        headerTitleAlign: 'center',
        headerTitle: '',
        headerLeft: () => (
          <Pressable
            onPress={() => router.push('/(tabs)/home')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <MyLogo width={30} height={30} style={{ marginLeft: 15 }} />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, })}
          >
            <Bell size={30} color={headerIconColor} style={{ marginRight: 15 }} />
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