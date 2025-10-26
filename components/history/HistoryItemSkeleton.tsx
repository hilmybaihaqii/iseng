import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import "../../global.css";

export default function HistoryItemSkeleton() {
  return (
    <MotiView
      from={{ opacity: 0.6 }}
      animate={{ opacity: 0.3 }}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
        repeatReverse: true,
      }}
      className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm"
    >
      <View className="mr-4 p-3 bg-zinc-200 rounded-full">
        <View className="w-6 h-6" />
      </View>
      <View className="flex-1 gap-y-2">
        <View className="w-3/4 h-5 bg-zinc-200 rounded-md" />
        <View className="w-1/2 h-4 bg-zinc-200 rounded-md" />
      </View>
      <View className="w-10 h-4 bg-zinc-200 rounded-md" />
    </MotiView>
  );
}
