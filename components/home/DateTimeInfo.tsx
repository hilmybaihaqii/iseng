import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { CalendarDays } from 'lucide-react-native'; // Tambahkan CalendarDays

// Opsi untuk format tanggal dan waktu Indonesia
const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long', // Minggu
  day: 'numeric', // 26
  month: 'long', // Oktober
};
const timeOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

export default function DateTimeInfo() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format terpisah
  const formattedDate = currentDate.toLocaleDateString('id-ID', dateOptions);
  const formattedTime = currentDate.toLocaleTimeString('id-ID', timeOptions);

  return (
    // Layout baru: flex-row, justify-between
    <View className="px-6 flex-row justify-between items-center">
      
      {/* Bagian Tanggal (Kiri) */}
      <View className="flex-row items-center gap-2">
        <CalendarDays size={18} color="#4B5563" />
        <Text className="text-sm font-poppins-medium text-gray-700">
          {formattedDate}
        </Text>
      </View>
      
      {/* Bagian Jam (Kanan) */}
      <View className="flex-row items-center gap-2">
        <Text className="text-sm font-poppins-medium text-gray-700">
          {formattedTime}
        </Text>
      </View>
    </View>
  );
}