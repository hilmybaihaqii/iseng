import { View, Text, Pressable, ScrollView } from 'react-native'; // Tambahkan ScrollView
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import "../global.css"; // Sesuaikan path jika perlu

export default function NotificationsScreen() {
  const router = useRouter();
  
  // 1. Definisikan warna konsisten (sesuai tema light mode)
  const headerIconColor = '#1F2937'; // Abu tua
  const headerTextColor = "text-gray-800";
  const bgColor = "bg-gray-50";

  return (
    // 2. Gunakan bg-gray-50 dan hapus padding 'p-6'
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      
      {/* 3. Header Kustom (disesuaikan dengan tema light) */}
      {/* Menggunakan padding & margin yang mirip dengan screen (tabs) */}
      <View className="flex-row items-center px-4 pt-4 mb-8">
        <Pressable 
          onPress={() => router.back()} 
          // Atur padding agar area klik mudah, tapi ikon tetap rapi
          className="p-2 -ml-2 mr-2"
        >
          {/* 4. Ubah warna ikon & sesuaikan ukuran */}
           <ArrowLeft size={28} color={headerIconColor} />
        </Pressable>
        
        {/* 5. Ubah warna & ukuran font judul agar konsisten */}
        <Text className={`text-3xl font-poppins-semibold ${headerTextColor}`}>
          Notifikasi
        </Text>
      </View>
      
      {/* 6. Konten dibungkus ScrollView dengan padding konsisten */}
      <ScrollView
         contentContainerStyle={{ 
           paddingBottom: 48, 
           paddingHorizontal: 16 
         }}
      >
        <View className="px-4"> 
          <Text className="text-gray-400 font-poppins-regular">
            Belum ada notifikasi.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}