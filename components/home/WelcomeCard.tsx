import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

type WelcomeCardProps = {
 name: string;
};
const logoWatermark = require('../../assets/photos/cps.png'); 

export default function WelcomeCard({ name }: WelcomeCardProps) {

 return (
  <View className="mx-6 mt-6 mb-6 shadow-md rounded-3xl"> 
  
   <View 
    className="bg-white rounded-3xl relative overflow-hidden h-56 p-6"
   >
    <Image
     source={logoWatermark}
     className="absolute w-36 h-36 -right-12 top-1/2 -translate-y-1/2 opacity-20"
     resizeMode="contain"
    />

    <View>
     <Text className="text-3xl font-poppins-semibold text-gray-900">
      Halo, {name}! 👋
     </Text>
     <Text className="text-lg font-poppins-regular text-gray-600 mt-1">
      Selamat datang di D&apos;mouv. 
     </Text>
    </View>
    
    <Link href="/history" asChild>
     <TouchableOpacity 
      className="absolute bottom-6 right-6 bg-primary rounded-full py-2 px-5 flex-row items-center gap-x-2 active:scale-95 transition-transform"
     >
      <Text className="text-white font-poppins-semibold">
       View History
      </Text>
     </TouchableOpacity>
    </Link>

    <Text className="absolute bottom-3 left-6 text-sm font-poppins-medium text-gray-400">
     #ConnectTheWorld
    </Text>
   </View>
  </View>
);
}