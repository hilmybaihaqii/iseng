import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { HistoryFilter } from '../../types/history'; // Pastikan path ini benar
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import "../../global.css";

// Tipe props untuk modal
type ModalProps = {
 visible: boolean;
 onClose: () => void;
 activeFilter: HistoryFilter;
 onApplyFilter: (filter: HistoryFilter) => void;
};

// Tipe helper
type FilterOption = { key: HistoryFilter; label: string };
type FilterSection = { title: string; options: readonly FilterOption[] };

// --- (DIPERBARUI) Opsi filter dipecah per section ---
const filterSections: readonly FilterSection[] = [
 {
  title: 'Umum', // Section 1: Umum
  options: [
   { key: 'semua', label: 'Semua' },
   { key: 'motion', label: 'Gerakan' },
  ] as const,
 },
 {
  title: 'Lampu', // Section 2: Lampu
  options: [
   { key: 'lampu_on', label: 'Nyala' },
   { key: 'lampu_off', label: 'Mati' },
  ] as const,
 },
];

export default function HistoryFilterModal({
 visible,
 onClose,
 activeFilter,
 onApplyFilter
}: ModalProps) {

 const { bottom } = useSafeAreaInsets();
 const [pendingFilter, setPendingFilter] = useState<HistoryFilter>(activeFilter);

 useEffect(() => {
  if (visible) {
   setPendingFilter(activeFilter);
  }
 }, [visible, activeFilter]);

 const handleApply = () => {
  onApplyFilter(pendingFilter);
 };

 return (
  <Modal
   transparent={true}
   visible={visible}
   animationType="fade"
   onRequestClose={onClose}
  >
   <Pressable onPress={onClose} className="flex-1 bg-black/60 justify-end">
    <Pressable
     onPress={() => {}} 
     className="bg-white rounded-t-2xl pt-4"
    >
     <View className="w-16 h-1.5 bg-zinc-300 rounded-full self-center mb-4" />

     {/* Header Modal */}
     <View className="flex-row justify-between items-center mb-6 px-6">
      <Text className="text-xl font-poppins-semibold text-zinc-900">
       Filter Riwayat
      </Text>
      <Pressable onPress={onClose} className="p-1">
       <X size={24} color="#6B7280" />
      </Pressable>
     </View>

     {/* Grid Filter (Sekarang di-loop per section) */}
     <View className="px-6">
      {filterSections.map((section, sectionIndex) => (
       <View key={sectionIndex} className="mb-5">
        {/* Judul Section (Umum, Lampu) */}
        <Text className="text-base font-poppins-medium text-gray-500 mb-3">
         {section.title}
        </Text>
        {/* Layout Grid (2 kolom) */}
        <View className="flex-row flex-wrap -mx-1.5">
         {section.options.map((option) => {
          const isActive = option.key === pendingFilter;
          return (
           <View key={option.key} className="w-1/2 px-1.5 mb-3">
            <Pressable
             onPress={() => setPendingFilter(option.key)}
             className={`p-4 rounded-lg border items-center justify-center h-16
              ${isActive
               ? 'bg-primary border-primary'
               : 'bg-white border-gray-300'}`}
            >
             <Text className={`text-base font-poppins-medium text-center
              ${isActive
               ? 'text-white'
               : 'text-zinc-800'}`}
             >
              {option.label}
             </Text>
            </Pressable>
           </View>
          );
         })}
        </View>
       </View>
      ))}
     </View>

     {/* Tombol Terapkan Filter */}
     <View
      className="px-6 pt-4 mt-2 border-t border-t-zinc-200"
      style={{ paddingBottom: bottom + 16 }}
     >
      <Pressable
       onPress={handleApply}
       className="w-full bg-primary p-4 rounded-xl shadow-lg shadow-primary/30 active:opacity-80 flex-row justify-center items-center"
      >
       <Text className="text-white text-lg font-poppins-semibold text-center">
        Terapkan Filter
       </Text>
      </Pressable>
     </View>

    </Pressable>
   </Pressable>
  </Modal>
 );
}