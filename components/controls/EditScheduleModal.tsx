import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { Schedule, DayIndex } from '../../types/schedule';
import { X } from 'lucide-react-native';
import DaySelector from './DaySelector';
import TimeInput from './TimeInput';
import "../../global.css";

type EditModalProps = {
 visible: boolean;
 onClose: () => void;
 scheduleToEdit: Schedule | null;
 onUpdate: (updatedSchedule: Schedule) => void;
};

// --- Helper Functions ---
const isValidTimeFormat = (time: string): boolean => /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/.test(time);
const timeToMinutes = (time: string): number => {
  if (!time) return 0; // Tambahkan pengecekan jika waktu kosong
 const [hours, minutes] = time.split(':').map(Number);
 return (hours || 0) * 60 + (minutes || 0); // Tambahkan fallback jika parsing gagal
};
// ------------------------------------

export default function EditScheduleModal({
 visible,
 onClose,
 scheduleToEdit,
 onUpdate
}: EditModalProps) {

 const [startTime, setStartTime] = useState('');
 const [endTime, setEndTime] = useState('');
 const [selectedDays, setSelectedDays] = useState<DayIndex[]>([]);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (scheduleToEdit) {
   setStartTime(scheduleToEdit.startTime);
      // Perbaikan: Gunakan fallback jika endTime undefined
   setEndTime(scheduleToEdit.endTime ?? '');
   setSelectedDays(scheduleToEdit.days);
   setError(null);
  } else {
      // Reset state saat tidak ada scheduleToEdit
      setStartTime('');
      setEndTime('');
      setSelectedDays([]);
      setError(null);
    }
 }, [scheduleToEdit]);

 const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
  setter(text); setError(null);
 };

 const handleDayToggle = (dayIndex: DayIndex) => {
  setSelectedDays((prev) =>
   prev.includes(dayIndex)
    ? prev.filter((d) => d !== dayIndex)
    : [...prev, dayIndex]
  ); setError(null);
 };

 const validateAndUpdate = () => {
  setError(null); if (!scheduleToEdit) return;

    // Validasi format waktu
  if (!isValidTimeFormat(startTime)) {
      setError('Format Waktu Nyala salah (HH:MM).');
      return;
    }
    // Waktu selesai opsional, tapi jika diisi, harus valid
    if (endTime && !isValidTimeFormat(endTime)) {
      setError('Format Waktu Mati salah (HH:MM).');
      return;
    }
    // Validasi urutan waktu hanya jika endTime diisi
    if (endTime && timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      setError('Waktu Nyala harus lebih awal dari Waktu Mati.');
      return;
    }
  if (selectedDays.length === 0) {
      setError('Pilih minimal satu hari pengulangan.');
      return;
    }

  const updatedScheduleData: Schedule = {
   ...scheduleToEdit,
      startTime,
      // Kirim endTime hanya jika tidak kosong, jika kosong kirim undefined
      endTime: endTime || undefined,
   days: selectedDays.sort((a, b) => a - b),
  };

  onUpdate(updatedScheduleData);
 };

 if (!visible || !scheduleToEdit) return null;

 return (
  <Modal
   transparent={true}
   visible={visible}
   animationType="fade"
   onRequestClose={onClose}
  >
   <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 justify-center items-center p-4"
      >
    <Pressable
     onPress={() => {}}
     className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
    >
     {/* Header Modal */}
     <View className="flex-row justify-between items-center mb-6">
      <Text className="text-xl font-poppins-semibold text-zinc-900">
       Edit Jadwal
      </Text>
      <Pressable onPress={onClose} className="-mr-2 p-1">
       <X size={24} color="#6B7280" />
      </Pressable>
     </View>

     {/* Form Edit */}
     <View className="mb-4">
      {/* Input Waktu */}
      <View className="flex-row gap-x-4 mb-4">
       <TimeInput
        label="Waktu Nyala"
        value={startTime}
        onChangeText={handleTimeChange(setStartTime)}
       />
       <TimeInput
        label="Waktu Mati" // Tambahkan (Opsional)
        value={endTime}
        onChangeText={handleTimeChange(setEndTime)}
       />
      </View>

      {/* Pemilih Hari */}
      <Text className="text-sm font-poppins-medium text-gray-500 mb-2">
       Jadwalkan Pada Hari
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
     </View>

     {/* Tombol Aksi */}
     <View className="flex-row gap-x-3 mt-4">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-200 p-3 rounded-lg active:opacity-80 items-center"
            >
              <Text className="text-gray-800 text-base font-poppins-semibold">
                Batal
              </Text>
            </Pressable>
            <Pressable
              onPress={validateAndUpdate}
              className="flex-1 bg-primary p-3 rounded-lg shadow-md shadow-primary/30 active:opacity-80 flex-row justify-center items-center"
            >
              <Text className="text-white text-base font-poppins-semibold">
                Simpan
              </Text>
            </Pressable>
          </View>

    </Pressable>
   </Pressable>
  </Modal>
 );
}