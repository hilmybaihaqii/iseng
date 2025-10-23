// File: app/(tabs)/history.tsx
import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../../global.css";

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black p-6">
      <Text className="text-white text-2xl font-poppins-bold">Riwayat</Text>
    </SafeAreaView>
  );
}