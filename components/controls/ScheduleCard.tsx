import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Schedule, DayIndex } from '../../types/schedule';
import { ChevronRight, Sun, Moon } from 'lucide-react-native';
import "../../global.css"; // Pastikan path ini benar
const DAY_MAP: Record<DayIndex, string> = {
 0: 'Min',
 1: 'Sen',
 2: 'Sel',
 3: 'Rab',
 4: 'Kam',
 5: 'Jum',
 6: 'Sab',
};

// 3. Perbaiki fungsi formatDays
const formatDays = (days: DayIndex[]) => {
 if (days.length === 7) return 'Setiap Hari';

  // Logika 'Hari Kerja' sekarang mengecek angka (0=Minggu, 6=Sabtu)
 const isWeekday = days.length === 5 && !days.includes(0) && !days.includes(6);
 if (isWeekday) return 'Hari Kerja';

 if (days.length === 0) return 'Tidak ada';
 
  // Ubah array angka -> array string, lalu gabung
 return days.map(dayIndex => DAY_MAP[dayIndex] || '?').join(', ');
};

type CardProps = {
 schedule: Schedule;
 onEdit: (id: string) => void;
};

export default function ScheduleCard({ schedule, onEdit }: CardProps) {
 const isTurnOn = schedule.command === 'ON';
 const time = `${schedule.startTime}${schedule.endTime ? ` - ${schedule.endTime}` : ''}`;
 
  // 4. Panggilan ini sekarang valid
  const days = formatDays(schedule.days);

 return (
  <Pressable
   onPress={() => onEdit(schedule.id)}
   className="bg-white p-4 rounded-lg border border-gray-100 flex-row items-center active:bg-gray-50"
  >
   <View className={`p-3 rounded-full ${isTurnOn ? 'bg-yellow-100' : 'bg-gray-100'}`}>
    {isTurnOn ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#4b5563" />}
   </View>
   <View className="flex-1 mx-4">
    <Text className="text-lg font-poppins-semibold text-gray-800">{time}</Text>
    <Text className="text-sm font-poppins-regular text-gray-500">{days}</Text>
   </View>
   <ChevronRight size={20} color="#9ca3af" />
  </Pressable>
 );
}