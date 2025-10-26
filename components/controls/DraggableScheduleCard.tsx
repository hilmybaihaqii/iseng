import React from 'react';
// 1. 'Dimensions' dihapus dari import
import { View, Text, Pressable } from 'react-native'; 
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
 useSharedValue,
 useAnimatedStyle,
 withSpring,
 interpolate,
 Extrapolate,
} from 'react-native-reanimated';
import { Schedule } from '../../types/schedule';
import ScheduleCard from './ScheduleCard'; 
import { Trash2 } from 'lucide-react-native';
import "../../global.css"; // Pastikan path ini benar

// 2. 'SCREEN_WIDTH' dihapus, karena tidak terpakai
const DELETE_BUTTON_WIDTH = 90; 

type CardProps = {
 schedule: Schedule;
 onDelete: (id: string) => void;
 onEdit: (id: string) => void; 
};

export default function DraggableScheduleCard({ schedule, onDelete, onEdit }: CardProps) {
 const translateX = useSharedValue(0);
 const startX = useSharedValue(0);

 // Logika gestur geser (Tidak berubah, sudah benar menggunakan DELETE_BUTTON_WIDTH)
 const panGesture = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .failOffsetY([-10, 10])
  .onBegin(() => {
   startX.value = translateX.value;
  })
  .onUpdate((event) => {
   const newX = startX.value + event.translationX;
   translateX.value = Math.min(0, Math.max(newX, -DELETE_BUTTON_WIDTH));
  })
  .onEnd(() => {
   if (translateX.value < -DELETE_BUTTON_WIDTH / 2) {
    translateX.value = withSpring(-DELETE_BUTTON_WIDTH);
   } else {
    translateX.value = withSpring(0);
   }
  });

 // Animasi untuk menggeser kartu (Tidak berubah)
 const cardAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
 }));

 // Animasi untuk memunculkan tombol hapus (Tidak berubah)
 const deleteButtonAnimatedStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
   translateX.value,
   [-DELETE_BUTTON_WIDTH, 0],
   [1, 0],
   Extrapolate.CLAMP
  ),
 }));

 return (
  <View className="mb-3 overflow-hidden rounded-lg">
   {/* Tombol Hapus (Di belakang) */}
   <Animated.View 
    style={[{
     position: 'absolute',
     right: 0,
     top: 0,
     bottom: 0,
     width: DELETE_BUTTON_WIDTH,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#DC2626', // red-600
    }, deleteButtonAnimatedStyle]}
   >
    <Pressable 
     onPress={() => onDelete(schedule.id)}
     className="items-center justify-center h-full w-full"
    >
     <Trash2 size={24} color="white" />
     <Text className="text-white text-xs font-poppins-regular mt-1">Hapus</Text>
    </Pressable>
   </Animated.View>

   {/* Kartu Jadwal (Di depan) */}
   <GestureDetector gesture={panGesture}>
    <Animated.View style={cardAnimatedStyle}>
     <ScheduleCard 
      schedule={schedule}
      onEdit={onEdit} 
     />
    </Animated.View>
   </GestureDetector>
  </View>
 );
}