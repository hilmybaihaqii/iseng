import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Settings, History, Bell } from 'lucide-react-native';
import { Platform, Pressable } from 'react-native';
import MyLogo from '../../assets/logo/o.svg';

const COLORS = {
  primary: '#E43636',
  headerIcon: '#1F2937',
  tabActive: '#E43636',
  tabInactive: '#A0AEC0',
  white: '#FFFFFF',
  border: '#E5E7EB',
};

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
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

        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.white,
          shadowOpacity: 0.05,
          elevation: 2,
          borderBottomWidth: Platform.OS === 'android' ? 0 : 1,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.headerIcon,
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
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Bell size={30} color={COLORS.headerIcon} style={{ marginRight: 15 }} />
          </Pressable>
        ),
      }}
    >

      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: 'Riwayat',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Pengaturan',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}