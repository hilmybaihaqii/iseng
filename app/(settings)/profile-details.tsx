import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { MotiView } from 'moti';

import "../../global.css";

// --- Komponen DetailRow (Diperbaiki) ---
interface DetailRowProps {
  icon: React.ElementType;
  label: string;
  value: string | undefined;
  delay?: number;
}
const DetailRow: React.FC<DetailRowProps> = ({ icon: Icon, label, value, delay = 0 }) => (
  <MotiView
    from={{ opacity: 0, translateX: -20 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ type: 'timing', duration: 400, delay: delay }}
    className="flex-row items-start mb-6"
  >
    {/* --- PERBAIKAN DI SINI --- */}
    {/* Ikon dibungkus View, className diterapkan di View */}
    <View className="mr-4 mt-1">
      <Icon size={20} color="#4B5563" />
    </View>
    {/* --- AKHIR PERBAIKAN --- */}

    <View className="flex-1">
      <Text className="text-sm font-poppins-medium text-gray-500 mb-1">{label}</Text>
      <Text className="text-lg font-poppins-regular text-gray-800 capitalize">{value || '-'}</Text>
    </View>
  </MotiView>
);

// --- Komponen Utama (Tetap Sama) ---
export default function ProfileDetailsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const profileImageUrl = user?.profilePicUrl || 'https://placehold.co/100x100/E2E8F0/A0AEC0?text=PP';

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <Pressable
          onPress={() => router.back()}
          className="p-2 active:opacity-60"
        >
           <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text className="text-gray-800 text-xl font-poppins-semibold">
          Detail Profil
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Animated Profile Picture */}
        <MotiView
          from={{ opacity: 0, scale: 0.8, translateY: -20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="items-center mb-10"
        >
          <Image
            source={{ uri: profileImageUrl }}
            className="w-40 h-40 rounded-full bg-gray-200 border-2 border-white"
          />
        </MotiView>

        {/* Animated Details Card */}
        <MotiView
           from={{ opacity: 0, translateY: 20 }}
           animate={{ opacity: 1, translateY: 0 }}
           transition={{ type: 'timing', duration: 500, delay: 200 }}
           className="bg-white p-6 rounded-xl shadow-sm"
        >
          <DetailRow icon={User} label="Nama Lengkap" value={user?.name} delay={300} />
          <DetailRow icon={Mail} label="Email" value={user?.email} delay={400} />
          <DetailRow icon={ShieldCheck} label="Peran Pengguna" value={user?.role} delay={500} />
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}