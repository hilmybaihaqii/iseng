import React from 'react';
import { View, Text } from 'react-native';
import { HistoryLog } from '../../types/history'; 
import {
 Clock,
 Lightbulb,
 LightbulbOff,
 PersonStanding,
 User,
  // --- Impor ikon Kipas & AC dihapus ---
  // Fan,
  // Wind,
  // Snowflake,
  // Thermometer,
} from 'lucide-react-native';
import "../../global.css";

type CardProps = {
 item: HistoryLog; 
};

export default function HistoryItemCard({ item }: CardProps) {
 const getDisplayData = () => {
  let icon: React.ReactNode;
  let title: string = item.deviceName;
  let message: string = 'Aktivitas terdeteksi';

  switch (item.type) {
   // --- Lampu ---
   case 'LIGHT_ON_MANUAL':
    icon = <User size={24} color="#3b82f6" />;
    title = `${item.deviceName} ON`;
    message = `Dinyalakan oleh ${item.actorName || 'Pengguna'}`;
    break;
   case 'LIGHT_ON_AUTO':
    icon = <Lightbulb size={24} color="#facc15" />;
    title = `${item.deviceName} ON`;
    message = 'Lampu menyala otomatis';
    break;
   case 'LIGHT_OFF_MANUAL':
    icon = <User size={24} color="#6B7280" />;
    title = `${item.deviceName} OFF`;
    message = `Dimatikan oleh ${item.actorName || 'Pengguna'}`;
    break;
   case 'LIGHT_OFF_AUTO':
    icon = <LightbulbOff size={24} color="#6B7280" />;
    title = `${item.deviceName} OFF`;
    message = 'Lampu mati otomatis';
    break;
   
      // --- Gerakan ---
   case 'MOTION_DETECTED':
    icon = <PersonStanding size={24} color="#ef4444" />;
    title = 'Gerakan Terdeteksi';
    message = `Lokasi: ${item.deviceName}`;
    break;

   // --- SEMUA CASE KIPAS (FAN) & AC DIHAPUS DARI SINI ---
   
   // Fallback jika tipe tidak dikenal
   default:
    icon = <Clock size={24} color="#6B7280" />;
    title = `Aktivitas ${item.deviceName}`;
        // Jika tipenya adalah 'FAN' atau 'AC', akan masuk ke sini
    message = `Tipe log tidak dikenal: ${item.type}`; 
    break;
  }
  return { icon, title, message };
 };

 const { icon, title, message } = getDisplayData();
 
 // Format waktu (tidak berubah)
 const time = new Date(item.timestamp).toLocaleTimeString('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
 });

 // Tampilan Card (tidak berubah)
 return (
  <View className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm">
   <View className="mr-4 p-3 bg-zinc-100 rounded-full">
    {icon}
   </View>
   <View className="flex-1">
    <Text className="text-base font-poppins-semibold text-zinc-900">
     {title}
    </Text>
    <Text className="text-sm font-poppins-regular text-zinc-600">
     {message}
    </Text>
   </View>
   <View className="flex-row items-center">
    <Clock size={14} color="#6B7280" />
    <Text className="text-sm text-zinc-600 ml-1">{time}</Text>
   </View>
  </View>
 );
}