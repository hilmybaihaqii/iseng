import React from 'react';
// (1) Impor RefreshControl
import { View, Text, SectionList, RefreshControl } from 'react-native';
import { HistoryLog } from '../../types/history';
import HistoryItemCard from './HistoryItemCard';
import HistoryItemSkeleton from './HistoryItemSkeleton';
import { Search } from 'lucide-react-native';
import "../../global.css";

export type HistorySection = {
  title: string;
  data: HistoryLog[];
};

type ListProps = {
  sections: HistorySection[];
  isLoading: boolean;
  onRefresh: () => void;
  refreshing: boolean;
};

export default function HistoryList({ 
  sections, 
  isLoading, 
  onRefresh, 
  refreshing 
}: ListProps) {

  if (isLoading) {
    return (
      <View className="px-6 pt-4">
        <HistoryItemSkeleton />
        <HistoryItemSkeleton />
        <HistoryItemSkeleton />
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <HistoryItemCard item={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <Text className="text-lg font-poppins-bold text-zinc-900 pt-6 pb-2">
          {title}
        </Text>
      )}
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
      ListEmptyComponent={
        <View className="items-center justify-center mt-20">
          <Search size={40} color="#9CA3AF" />
          <Text className="text-zinc-500 font-poppins-regular text-base mt-4">
            Tidak ada riwayat ditemukan
          </Text>
        </View>
      }
      // (2) Gunakan 'refreshControl' untuk styling profesional
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#E43636']} // (3) Warna primary (Android)
          tintColor="#E43636"   // (4) Warna primary (iOS)
        />
      }
    />
  );
}
