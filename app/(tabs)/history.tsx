import { Text, View, Pressable } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HistoryLog, HistoryFilter } from '../../types/history'; // Pastikan path ini benar
import HistoryHeader from '../../components/history/HistoryHeader';
import HistoryList from '../../components/history/HistoryList';
import HistoryFilterModal from '../../components/history/HistoryFilterModal';
import "../../global.css";

// --- (DIPERBARUI) Mock Data disederhanakan ---
// Data untuk Kipas (FAN) dan AC telah dihapus.
const MOCK_DATA_FROM_BE: HistoryLog[] = [
 { id: '1', timestamp: '2025-10-24T18:30:00Z', type: 'LIGHT_ON_MANUAL', deviceName: 'Lampu Teras', actorName: 'Hilmy' }, 
  { id: '7', timestamp: '2025-10-24T18:00:00Z', type: 'LIGHT_ON_AUTO', deviceName: 'Lampu Kamar', actorName: null }, 
  { id: '2', timestamp: '2025-10-24T16:15:00Z', type: 'MOTION_DETECTED', deviceName: 'Kamera Depan', actorName: null }, 
  { id: '3', timestamp: '2025-10-24T09:00:00Z', type: 'LIGHT_OFF_AUTO', deviceName: 'Lampu Kamar', actorName: null }, 
  { id: '4', timestamp: '2025-10-23T22:00:00Z', type: 'LIGHT_OFF_MANUAL', deviceName: 'Lampu Teras', actorName: 'Hilmy' },
];


export default function HistoryScreen() {
 // (State... tidak berubah)
 const [searchText, setSearchText] = useState('');
  // Pastikan tipe HistoryFilter Anda juga sudah disederhanakan
 const [activeFilter, setActiveFilter] = useState<HistoryFilter>('semua');
 const [isModalVisible, setModalVisible] = useState(false);
 const [isLoading, setIsLoading] = useState(true);
 const [allHistory, setAllHistory] = useState<HistoryLog[]>([]);
 const [isRefreshing, setIsRefreshing] = useState(false);
 const [fetchError, setFetchError] = useState<string | null>(null);

 // (Fungsi fetchData... tidak berubah)
 const fetchData = useCallback(async () => { 
    if (!isRefreshing) setIsLoading(true); 
    setFetchError(null); 
    try { 
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setAllHistory(MOCK_DATA_FROM_BE); 
    } catch (error: any) { 
      console.error("Fetch history error:", error); 
      setFetchError(error.message || 'Terjadi kesalahan.'); 
      setAllHistory([]); 
    } finally { 
      setIsLoading(false); 
      setIsRefreshing(false); 
    } 
  }, [isRefreshing]);

 useEffect(() => { fetchData(); }, [fetchData]);
 const handleRefresh = () => { setIsRefreshing(true); };

 // --- (DIPERBARUI) Logika Filter & Grouping disederhanakan ---
 const sections = useMemo(() => {
  const filteredData = allHistory.filter(item => {
   const lowerSearch = searchText.toLowerCase();
   const matchesSearch =
    item.deviceName.toLowerCase().includes(lowerSearch) ||
    (item.actorName && item.actorName.toLowerCase().includes(lowerSearch));

   // Logika filter untuk Kipas & AC Dihapus
   const matchesFilter = () => {
    switch (activeFilter) {
     case 'semua':
      return true;
     case 'motion':
      return item.type === 'MOTION_DETECTED';
     case 'lampu_on':
      return item.type.startsWith('LIGHT_ON_');
     case 'lampu_off':
      return item.type.startsWith('LIGHT_OFF_');
          
          // --- KASUS UNTUK KIPAS & AC DIHAPUS DARI SINI ---
          
     default:
      return true; 
    }
   };

   return matchesSearch && matchesFilter();
  });

  // (Logika grouping tidak berubah)
  const groups = filteredData.reduce((acc, item) => { const dateKey = new Date(item.timestamp).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); if (!acc[dateKey]) acc[dateKey] = []; acc[dateKey].push(item); return acc; }, {} as Record<string, HistoryLog[]>); return Object.keys(groups).map(dateTitle => ({ title: dateTitle, data: groups[dateTitle], }));
 }, [allHistory, searchText, activeFilter]); 

 return (
  <SafeAreaView className="flex-1 bg-gray-50">
   <View style={{ flex: 1 }}>
    {/* Judul Halaman */}
    <View className="mt-4 mb-6 px-6">
     <Text className="text-3xl font-poppins-semibold text-gray-800">
      Riwayat
     </Text>
    </View>

    {/* Header (Search + Filter) */}
    <HistoryHeader
     searchText={searchText}
     onSearchChange={setSearchText}
     onFilterPress={() => setModalVisible(true)}
    />

    {/* Pesan Error */}
    {fetchError && !isLoading && (
     <View className="items-center justify-center my-10 px-6">
      <Text className="text-red-600 font-poppins-medium text-center">{fetchError}</Text>
      <Pressable onPress={fetchData} className="mt-4 bg-primary py-2 px-4 rounded-lg">
       <Text className="text-white font-poppins-semibold">Coba Lagi</Text>
      </Pressable>
     </View>
    )}

    {/* List */}
    {!fetchError && (
     <HistoryList
      sections={sections}
      isLoading={isLoading}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
     />
    )}
   </View>

   {/* Modal Filter */}
   <HistoryFilterModal
    visible={isModalVisible}
    onClose={() => setModalVisible(false)}
    activeFilter={activeFilter}
    onApplyFilter={(filter) => {
     setActiveFilter(filter);
     setModalVisible(false);
    }}
   />
  </SafeAreaView>
 );
}