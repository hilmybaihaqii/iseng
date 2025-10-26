import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, Check, X } from 'lucide-react-native';
import "../../global.css"; // Pastikan path ini benar
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type DayObject = {
 index: DayIndex;
 label: string;
};

const DAYS: DayObject[] = [
 { index: 0, label: 'Minggu' },
 { index: 1, label: 'Senin' },
 { index: 2, label: 'Selasa' },
 { index: 3, label: 'Rabu' },
 { index: 4, label: 'Kamis' },
 { index: 5, label: 'Jumat' },
 { index: 6, label: 'Sabtu' },
];

// Map untuk label pendek
const DAY_MAP_SHORT: Record<DayIndex, string> = {
 0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu',
};

type DaySelectorProps = {
 selectedDays: DayIndex[]; // Array hari yang dipilih
 onDayToggle: (dayIndex: DayIndex) => void; // Fungsi saat hari di-toggle
};

// --- Helper untuk menampilkan teks di tombol ---
const formatDisplayDays = (days: DayIndex[]) => {
  if (days.length === 0) return 'Pilih Hari';
  if (days.length === 7) return 'Setiap Hari';
  // Jika hari kerja (Sen-Jum)
  const isWeekday = days.length === 5 && !days.includes(0) && !days.includes(6);
  if (isWeekday) return 'Setiap Hari Kerja';
  
  // Urutkan hari (Min, Sen, Sel...) lalu tampilkan
  return days
    .sort((a, b) => a - b)
    .map(dayIndex => DAY_MAP_SHORT[dayIndex])
    .join(', ');
};

export default function DaySelector({ selectedDays, onDayToggle }: DaySelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { bottom } = useSafeAreaInsets(); // Untuk padding bawah modal

  // Teks yang ditampilkan di tombol
  const displayLabel = formatDisplayDays(selectedDays);

 return (
    <View>
      {/* 1. Tombol Pemicu Modal (Dibuat mirip TimeInput) */}
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className="flex-row items-center justify-between rounded-lg p-3 border-2 border-gray-200 bg-white"
      >
        <Text className={`text-base font-poppins-regular ${selectedDays.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
          {displayLabel}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </Pressable>

      {/* 2. Modal Bottom Sheet */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        {/* Latar belakang gelap */}
        <Pressable 
          onPress={() => setIsModalVisible(false)} 
          className="flex-1 bg-black/60 justify-end"
        >
          {/* Konten Modal */}
          <Pressable 
            onPress={() => {}} // Mencegah modal tertutup saat diklik
            className="bg-white rounded-t-2xl pt-4"
          >
            {/* Handle */}
            <View className="w-16 h-1.5 bg-zinc-300 rounded-full self-center mb-4" />
            
            {/* Header Modal */}
            <View className="flex-row justify-between items-center mb-4 px-6">
              <Text className="text-xl font-poppins-semibold text-zinc-900">
                Jadwalkan Pada Hari
              </Text>
              <Pressable onPress={() => setIsModalVisible(false)} className="p-1">
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* Daftar Hari (Multi-select) */}
            <View className="px-4">
              {DAYS.map((day) => {
                const isSelected = selectedDays.includes(day.index);
                return (
                  <Pressable
                    key={day.index}
                    onPress={() => onDayToggle(day.index)}
                    className="flex-row items-center justify-between py-4 px-2 border-b border-gray-100"
                  >
                    <Text className={`text-base font-poppins-regular ${isSelected ? 'text-primary' : 'text-gray-800'}`}>
                      {day.label}
                    </Text>
                    
                    {/* Checkbox Kustom */}
                    <View 
                      className={`w-6 h-6 rounded-md border-2 justify-center items-center
                        ${isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
                    >
                      {isSelected && <Check size={16} color="white" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Tombol Selesai */}
            <View 
              className="px-6 pt-4 mt-4" 
              style={{ paddingBottom: bottom + 16 }}
            >
              <Pressable
                onPress={() => setIsModalVisible(false)}
                className="w-full bg-primary p-4 rounded-xl items-center active:opacity-80"
              >
                <Text className="text-white text-lg font-poppins-semibold">
                  Selesai
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
 );
}