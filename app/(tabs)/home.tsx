import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Lightbulb } from 'lucide-react-native';
import "../../global.css";

import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  Easing 
} from 'react-native-reanimated';

// Impor komponen kita
import DeviceCard from '../../components/home/DeviceCard'; 
import WelcomeCard from '../../components/home/WelcomeCard';
// GANTI NAMA IMPOR INI:
import DateTimeInfo from '../../components/home/DateTimeInfo'; 

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.name || 'Pengguna';

  const goToLightControl = () => {
    router.push('/light-control'); 
  };

  // --- Setup Animasi (Tidak berubah, sudah benar) ---
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    opacity.value = withDelay(100, withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(100, withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }));
  }, [opacity, translateY]); 
  // --- Akhir Setup Animasi ---

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        
        <Animated.View style={animationStyle}>

          {/* === PERUBAHAN URUTAN DI SINI === */}

          {/* 1. Welcome Card (Sekarang paling atas) */}
          <WelcomeCard name={userName} /> 

          {/* 2. Info Tanggal & Waktu (Di bawah Welcome Card) */}
          <DateTimeInfo />

          {/* 3. Kontrol Cepat (Beri margin atas agar tidak menempel) */}
          <View className="px-6 mt-6"> 
            <Text className="text-xl font-poppins-semibold text-gray-900 mb-4">
              Kontrol Cepat
            </Text>

            <View className="gap-y-3">
              <DeviceCard
                name="Kontrol Lampu"
                description="Kelola semua jadwal lampu"
                icon={<Lightbulb />}
                onPress={goToLightControl}
              />
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}