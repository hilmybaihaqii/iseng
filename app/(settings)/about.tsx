import { View, Text, Pressable, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import MyLogo from '../../assets/logo/full.svg';

import SettingsSection from '../../components/settings/SettingsSection';
import "../../global.css"; 

export default function AboutScreen() {
  const router = useRouter();
  
  const headerIconColor = '#1F2937';
  const headerTextColor = "text-gray-800";
  const bgColor = "bg-gray-50";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      
      <View className="flex-row items-center justify-between px-4 pt-4 mb-8">
        <View className="flex-row items-center">
          <Pressable 
            onPress={() => router.back()} 
            className="p-2 -ml-2 mr-2"
          >
             <ArrowLeft size={28} color={headerIconColor} />
          </Pressable>
          <Text className={`text-xl font-poppins-semibold ${headerTextColor}`}>
            Tentang
          </Text>
        </View>
      </View>
      
      <ScrollView
         contentContainerStyle={{ 
           paddingBottom: 48, 
           paddingHorizontal: 16 
         }}
      >
        <SettingsSection>
          <View className="p-4 space-y-4">
            <View className="items-center mb-4">
              <MyLogo width={150} height={90} style={{ marginBottom: 5 }} />
              <Text className="text-sm font-poppins-regular text-gray-500">
                Version: 1.0.0
              </Text>
            </View>

            <Text className="text-gray-700 font-poppins-regular text-base leading-relaxed text-center">
              Aplikasi Dmouv ini didesain untuk membantu Anda mengelola
              berbagai kebutuhan dengan antarmuka yang intuitif dan fungsionalitas yang kuat.
              Kami berdedikasi untuk memberikan pengalaman pengguna terbaik.
            </Text>

            <Text className="text-gray-500 font-poppins-regular text-sm mt-10 text-center">
                © {new Date().getFullYear()} Semua Hak Cipta Dilindungi.
            </Text>
            
            <View className="border-t border-gray-100 pt-5 mt-5">
              <Text className="text-gray-600 font-poppins-semibold text-base">
                Developer:
              </Text>
              <Text className="text-gray-700 font-poppins-regular text-base">
                Cyber Physical System Laboratory
              </Text>
              
            </View>
          </View>
        </SettingsSection>
        
      </ScrollView>
    </SafeAreaView>
  );
}