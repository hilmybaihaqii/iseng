import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Lightbulb, LightbulbOff, CalendarClock, ArrowLeft, Zap } from 'lucide-react-native';
import AddScheduleForm from '../components/controls/AddScheduleForm';
import { Schedule } from '../types/schedule'; // Pastikan path ini benar
import 'react-native-get-random-values'; // Untuk uuid
import { v4 as uuidv4 } from 'uuid';
import "../global.css"; // Pastikan path ini benar
import DraggableScheduleCard from '../components/controls/DraggableScheduleCard'; // Impor kartu draggable
import EditScheduleModal from '../components/controls/EditScheduleModal'; // Impor modal edit

// --- Helper Functions ---
const timeToMinutes = (time: string): number => {
 if (!time) return 0;
 const [hours, minutes] = time.split(':').map(Number);
 return (hours || 0) * 60 + (minutes || 0);
};

const schedulesOverlap = (sched1: Omit<Schedule, 'id'>, sched2: Omit<Schedule, 'id'>): boolean => {
 const commonDays = sched1.days.filter(day => sched2.days.includes(day));
 if (commonDays.length === 0) return false;
 const start1 = timeToMinutes(sched1.startTime);
 // Waktu selesai bisa opsional, jika tidak ada anggap 1 menit durasi
 const end1 = sched1.endTime ? timeToMinutes(sched1.endTime) : start1 + 1;
 const start2 = timeToMinutes(sched2.startTime);
 const end2 = sched2.endTime ? timeToMinutes(sched2.endTime) : start2 + 1;
 // Cek tumpang tindih waktu
 return start1 < end2 && start2 < end1;
};
// ------------------------

export default function LightControlScreen() {
 const router = useRouter();
 const [isAuto, setIsAuto] = useState(true);
 const [isLightOn, setIsLightOn] = useState(false);
 const [schedules, setSchedules] = useState<Schedule[]>([]); // State untuk menyimpan jadwal
 const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State visibility modal
 const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null); // State jadwal yg diedit

 // --- Logika State ---
 const toggleAutoMode = (value: boolean) => {
  setIsAuto(value);
  // Jika mode auto aktif, matikan lampu (jika sedang nyala manual)
  if (value) setIsLightOn(false);
 };

 const handleManualToggle = (targetState: boolean) => {
  // Hanya bisa toggle manual jika mode auto mati
  if (isAuto) return;
  setIsLightOn(targetState);
 };

 const handleSaveSchedule = useCallback((newScheduleData: Omit<Schedule, 'id'>) => {
  // Cek jika jadwal baru bentrok dengan yang sudah ada
  const hasOverlap = schedules.some(existingSchedule => schedulesOverlap(newScheduleData, existingSchedule));
  if (hasOverlap) {
   Alert.alert("Jadwal Bentrok", "Waktu dan hari yang dipilih tumpang tindih dengan jadwal yang sudah ada.");
   return; // Hentikan penyimpanan jika bentrok
  }

  // Buat jadwal baru dengan ID unik dan properti default
  const newScheduleWithId: Schedule = {
   ...newScheduleData,
   id: uuidv4(), // Generate ID unik
   command: newScheduleData.endTime ? 'RANGE' : 'ON', // Tentukan command berdasarkan ada/tidaknya endTime
   isEnabled: true // Jadwal baru defaultnya aktif
  };

  // Tambahkan jadwal baru ke state dan urutkan berdasarkan waktu mulai
  setSchedules(prevSchedules =>
   [...prevSchedules, newScheduleWithId].sort((a,b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
  );
  Alert.alert("Sukses ✅", "Jadwal baru berhasil ditambahkan!");
 }, [schedules]); // Dependensi: schedules

 // Fungsi untuk menampilkan konfirmasi sebelum menghapus
 const handleDeleteSchedule = (idToDelete: string) => {
  Alert.alert(
   "Hapus Jadwal",
   "Apakah Anda yakin ingin menghapus jadwal ini?",
   [
    { text: "Batal", style: "cancel", onPress: () => {} }, // Tombol batal
    { text: "Hapus", style: "destructive", onPress: () => {
     // Hapus jadwal dari state jika user konfirmasi
     setSchedules(prev => prev.filter(schedule => schedule.id !== idToDelete));
    }},
   ]
  );
 };

 // Fungsi untuk membuka modal edit dengan data jadwal yang dipilih
 const handleEditSchedule = (idToEdit: string) => {
  const schedule = schedules.find(s => s.id === idToEdit);
  if (schedule) {
   setEditingSchedule(schedule); // Set data jadwal yang akan diedit
   setIsEditModalVisible(true); // Tampilkan modal
  }
 };

 // Fungsi untuk menyimpan perubahan dari modal edit
 const handleUpdateSchedule = useCallback((updatedSchedule: Schedule) => {
  // Cek bentrok dengan jadwal lain (kecuali dirinya sendiri)
  const hasOverlap = schedules.some(existingSchedule =>
   existingSchedule.id !== updatedSchedule.id && // Jangan cek dengan dirinya sendiri
   schedulesOverlap(updatedSchedule, existingSchedule)
  );

  if (hasOverlap) {
   Alert.alert("Jadwal Bentrok", "Perubahan waktu dan hari bentrok dengan jadwal lain.");
   return; // Hentikan update jika bentrok
  }

  // Update jadwal di state dan urutkan kembali
  setSchedules(prevSchedules =>
   prevSchedules
    .map(s => (s.id === updatedSchedule.id ? updatedSchedule : s)) // Ganti jadwal lama dengan yg baru
    .sort((a,b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)) // Urutkan lagi
  );

  Alert.alert("Sukses ✅", "Jadwal berhasil diperbarui!");
  setIsEditModalVisible(false); // Tutup modal
  setEditingSchedule(null); // Reset state edit
 }, [schedules]); // Dependensi: schedules
 // --- (Akhir Logika State) ---

 return (
  <SafeAreaView className="flex-1 bg-gray-50">
   {/* Header Kustom */}
   <View className="flex-row items-center px-4 pt-4 mb-4">
    <Pressable onPress={() => router.back()} className="p-2 -ml-2 mr-2">
     <ArrowLeft size={28} color="#1F2937" />
    </Pressable>
    <Text className="text-xl font-poppins-semibold text-gray-800">
     Kontrol Lampu
    </Text>
   </View>

   <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8, paddingBottom: 48 }}>

    {/* Kartu Kontrol Manual */}
    <View className="bg-white p-6 rounded-2xl shadow-md">
     <Text className="text-xl font-poppins-semibold text-gray-900 mb-5"> Kontrol Manual </Text>
     <View className={`flex-row gap-4 ${isAuto ? 'opacity-50' : ''}`}>
      <Pressable
       disabled={isAuto}
       onPress={() => handleManualToggle(true)}
       className={`flex-1 items-center justify-center py-6 rounded-lg ${isLightOn && !isAuto ? 'bg-primary' : 'bg-gray-100'}`}
      >
       <Lightbulb size={32} color={isLightOn && !isAuto ? 'white' : '#1F2937'} />
       <Text className={`mt-2 text-lg font-poppins-semibold ${isLightOn && !isAuto ? 'text-white' : 'text-gray-900'}`}> ON </Text>
      </Pressable>
      <Pressable
       disabled={isAuto}
       onPress={() => handleManualToggle(false)}
       className={`flex-1 items-center justify-center py-6 rounded-lg ${!isLightOn && !isAuto ? 'bg-gray-800' : 'bg-gray-100'}`}
      >
       <LightbulbOff size={32} color={!isLightOn && !isAuto ? 'white' : '#1F2937'} />
       <Text className={`mt-2 text-lg font-poppins-semibold ${!isLightOn && !isAuto ? 'text-white' : 'text-gray-900'}`}> OFF </Text>
      </Pressable>
     </View>
     {isAuto && (
      <Text className="text-sm font-poppins-regular text-gray-500 mt-3 text-center">
       Kontrol manual nonaktif saat mode otomatis menyala.
      </Text>
     )}
    </View>

    {/* Kartu Mode Otomatis */}
    <View className="bg-white p-6 rounded-2xl shadow-md mt-6">
     <View className="flex-row justify-between items-center">
      <View className="flex-row flex-1">
       <Zap size={24} color="#6B7280" className="mr-4 mt-1" />
       <View className="flex-1">
        <Text className="text-xl font-poppins-semibold text-gray-900 mb-1"> Mode Otomatis </Text>
        <Text className="text-sm font-poppins-regular text-gray-500 leading-snug">
         Lampu akan menyala/mati secara otomatis.
        </Text>
       </View>
      </View>
      <Switch
       trackColor={{ false: '#E5E7EB', true: '#E43636' }}
       thumbColor={isAuto ? 'white' : '#f4f3f4'}
       onValueChange={toggleAutoMode}
       value={isAuto}
       style={{ transform: [{ scale: 1.2 }] }}
      />
     </View>
    </View>

    {/* Kartu Tambah Jadwal Baru */}
    <View className="bg-white p-6 rounded-2xl shadow-md mt-6">
     <View className="flex-row justify-between items-center mb-4">
      <Text className="text-xl font-poppins-semibold text-gray-900"> Tambah Jadwal Baru </Text>
      <CalendarClock size={24} color="#6B7280" />
     </View>
     <AddScheduleForm onSave={handleSaveSchedule} />
    </View>

    {/* Kartu Jadwal Tersimpan (Hanya muncul jika ada jadwal) */}
    {schedules.length > 0 && (
     <View className="bg-white p-6 rounded-2xl shadow-md mt-6">
      <Text className="text-xl font-poppins-semibold text-gray-900 mb-4">
       Jadwal Tersimpan ({schedules.length})
      </Text>
      <View>
       {schedules.map((schedule) => (
        <DraggableScheduleCard
         key={schedule.id}
         schedule={schedule}
         onDelete={handleDeleteSchedule} // Fungsi konfirmasi hapus
         onEdit={handleEditSchedule} // Fungsi buka modal edit
        />
       ))}
      </View>
     </View>
    )}
    {/* Tampilan jika tidak ada jadwal */}
    {schedules.length === 0 && (
     <View className="mt-6 items-center py-6">
      <Text className="text-base font-poppins-regular text-gray-400 text-center">
       Belum ada jadwal disimpan.
      </Text>
     </View>
    )}

   </ScrollView>

   {/* Modal Edit (Dirender di luar ScrollView) */}
   <EditScheduleModal
    visible={isEditModalVisible}
    onClose={() => {
     setIsEditModalVisible(false);
     setEditingSchedule(null); // Reset data edit saat modal ditutup
    }}
    scheduleToEdit={editingSchedule}
    onUpdate={handleUpdateSchedule} // Fungsi simpan perubahan
   />
  </SafeAreaView>
 );
}