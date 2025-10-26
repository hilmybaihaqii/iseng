import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

// Tipe props untuk kartu ini
type DeviceCardProps = {
  name: string;
  description: string;
  // Ini adalah tipe yang benar agar 'icon' bisa menerima 'size' dan 'color'
  icon: React.ReactElement<{ size?: number; color?: string }>;
  onPress: () => void;
};

export default function DeviceCard({ name, description, icon, onPress }: DeviceCardProps) {
  return (
    <Pressable
      onPress={onPress}
      // Kelas 'active:scale-95' memberikan efek "memantul" saat ditekan
      className="flex-row items-center bg-white p-4 rounded-xl shadow-sm 
                 active:bg-gray-100 active:scale-95 transition-all duration-100"
    >
      {/* Ikon */}
      <View className="p-3 rounded-full bg-gray-100">
        {/* Meng-kloning ikon agar bisa kita atur size & color-nya */}
        {React.cloneElement(icon, { size: 24, color: '#6B7280' })}
      </View>
      
      {/* Teks */}
      <View className="flex-1 mx-4">
        <Text className="text-base font-poppins-semibold text-gray-900">{name}</Text>
        <Text className="text-sm font-poppins-medium text-gray-500">
          {description}
        </Text>
      </View>
      
      {/* Panah ke Kanan */}
      <ChevronRight size={24} color="#9CA3AF" />
    </Pressable>
  );
}