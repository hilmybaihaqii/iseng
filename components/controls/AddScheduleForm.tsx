import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import DaySelector from './DaySelector';
import TimeInput from './TimeInput'; // Komponen TimeInput (sudah diperbarui)
import { Schedule, DayIndex } from '../../types/schedule';
import "../../global.css";

type AddScheduleFormProps = {
 onSave: (newSchedule: Omit<Schedule, 'id'>) => void;
};

const isValidTimeFormat = (time: string): boolean => /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(time);
const timeToMinutes = (time: string): number => {
 const [hours, minutes] = time.split(':').map(Number);
 return hours * 60 + minutes;
};

export default function AddScheduleForm({ onSave }: AddScheduleFormProps) {
 const [startTime, setStartTime] = useState('');
 const [endTime, setEndTime] = useState('');
 const [selectedDays, setSelectedDays] = useState<DayIndex[]>([]);
 const [error, setError] = useState<string | null>(null);

 const handleDayToggle = (dayIndex: DayIndex) => {
  setSelectedDays(prev =>
   prev.includes(dayIndex)
    ? prev.filter(d => d !== dayIndex)
    : [...prev, dayIndex]
  );
  setError(null); 
 };

 const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
  setter(text);
  setError(null); 
 };

 const validateAndSaveSchedule = () => {
  setError(null);

  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
   setError('Format waktu harus HH:MM (00:00 - 23:59).');
   return;
  }
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  if (startMinutes >= endMinutes) {
   setError('Waktu Nyala harus lebih awal dari Waktu Mati.');
   return;
  }
  if (selectedDays.length === 0) {
   setError('Pilih minimal satu hari pengulangan.');
   return;
  }

  // --- INI PERBAIKANNYA ---
    // Objek ini sekarang menyertakan 'command' dan 'isEnabled'
    // agar cocok dengan tipe Omit<Schedule, "id">.
  const newScheduleData: Omit<Schedule, 'id'> = {
   startTime,
   endTime,
   days: selectedDays.sort((a, b) => a - b),
      command: 'ON',    // Asumsi nilai default adalah 'ON'
      isEnabled: true,  // Asumsi nilai default adalah 'true'
  };
    // ------------------------

  onSave(newScheduleData); // Panggilan ini sekarang valid

  // Reset form
  setStartTime('');
  setEndTime('');
  setSelectedDays([]);
 };

 return (
  <View>
   {/* Input Waktu */}
   <View className="flex-row gap-x-4 mb-4">
    <TimeInput
     label="Waktu Nyala"
     value={startTime}
     onChangeText={handleTimeChange(setStartTime)} 
    />
    <TimeInput
     label="Waktu Mati"
     value={endTime}
     onChangeText={handleTimeChange(setEndTime)}
    />
   </View>

   {/* Pemilih Hari (Tidak berubah) */}
   <Text className="text-sm font-poppins-medium text-gray-500 mb-1">
    Ulangi Pada Hari
   </Text>
   <DaySelector
    selectedDays={selectedDays}
    onDayToggle={handleDayToggle}
   />

   {/* Pesan Error */}
   {error && (
    <Text className="text-red-500 font-poppins-regular text-sm mt-3 text-center">
     {error}
    </Text>
   )}

   {/* Tombol Simpan */}
   <Pressable
    onPress={validateAndSaveSchedule}
    className="flex-row items-center justify-center bg-primary p-4 rounded-lg mt-6 shadow-md shadow-primary/30 active:opacity-80"
   >
    <Text className="text-white text-lg font-poppins-semibold">
     Tambah Jadwal
    </Text>
   </Pressable>
  </View>
 );
}