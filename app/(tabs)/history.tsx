// File: app/(tabs)/history.tsx
import { Text, View, ScrollView } from 'react-native'; // Tambahkan View & ScrollView
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../../global.css";

export default function HistoryScreen() {
  return (
    // 1. Latar belakang diubah menjadi bg-gray-50 (light mode)
    <SafeAreaView className="flex-1 bg-gray-50">
      
      {/* 2. Tambahkan ScrollView agar layout konsisten */}
      <ScrollView
        contentContainerStyle={{ 
          paddingTop: 16, 
          paddingBottom: 48, 
          paddingHorizontal: 16 
        }}
      >
        {/* 3. Tambahkan blok Judul Halaman yang konsisten */}
        <View className="mb-8 px-4">
          <Text className="text-3xl font-poppins-semibold text-gray-800">
            Riwayat
          </Text>
        </View>

        {/* 4. Placeholder untuk konten di masa depan */}
        <View className="px-4">
          <Text className="text-gray-400 font-poppins-regular">
            (Daftar riwayat akan tampil di sini)
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}