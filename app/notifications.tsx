import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import "../global.css"; // Sesuaikan path jika perlu

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black p-6">
      {/* Header Sederhana dengan Tombol Kembali */}
      <View className="flex-row items-center mb-6">
        <Pressable onPress={() => router.back()} className="p-2 mr-4">
           <ArrowLeft size={24} color="#FFFFFF" />
        </Pressable>
        <Text className="text-white text-2xl font-poppins-bold">
          Notifikasi
        </Text>
      </View>
      
      {/* Konten Notifikasi (Sementara) */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400 font-poppins-regular">
          Belum ada notifikasi.
        </Text>
      </View>
    </SafeAreaView>
  );
}