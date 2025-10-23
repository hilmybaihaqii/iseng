import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import "../../global.css";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ 
          paddingTop: 16, 
          paddingBottom: 48, 
          paddingHorizontal: 16 
        }}
      >
        {/* Judul Halaman */}
        <View className="mb-8 px-4">
          <Text className="text-3xl font-poppins-semibold text-gray-800">
            Beranda
          </Text>
        </View>

        <View className="mb-10 px-4">
          <Text className="text-lg font-poppins-regular text-gray-600">
            Halo {user?.name || 'Pengguna'} 👋,
            {"\n"}
            selamat datang di Dmouv!
          </Text>
        </View>


        <View className="px-4">
          <Text className="text-gray-400 font-poppins-regular">
            (Konten utama akan tampil di sini)
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}