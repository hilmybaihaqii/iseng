// File: components/history/HistoryHeader.tsx
import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import "../../global.css";

type HistoryHeaderProps = {
  searchText: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
};

export default function HistoryHeader({ 
  searchText, 
  onSearchChange, 
  onFilterPress 
}: HistoryHeaderProps) {
  return (
    <View className="flex-row items-center px-6 mb-4">
      <View className="flex-1 flex-row items-center bg-white rounded-xl p-3 shadow-sm">
        <Search size={20} color="#6B7280" />
        <TextInput 
          placeholder="Search History"
          placeholderTextColor="#6B7280"
          className="flex-1 ml-2 text-base font-poppins-regular text-zinc-900"
          value={searchText}
          onChangeText={onSearchChange}
        />
      </View>
      
      <Pressable 
        onPress={onFilterPress} 
        className="ml-3 p-3 bg-white rounded-xl shadow-sm"
      >
        <Filter size={20} color="#6B7280" />
      </Pressable>
    </View>
  );
}