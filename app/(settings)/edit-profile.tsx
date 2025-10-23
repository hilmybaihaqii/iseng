import {
  View, Text, Pressable, TextInput, Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Camera } from 'lucide-react-native';
import { useAuth, User } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti'; 

import "../../global.css"; 

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [profilePicUri, setProfilePicUri] = useState<string | null>(user?.profilePicUrl || null);
  const [isLoading, setIsLoading] = useState(false);

  const initialProfileImageUrl = user?.profilePicUrl || 'https://placehold.co/80x80/E2E8F0/A0AEC0?text=PP';

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Izin Diperlukan", "Anda perlu memberikan izin akses galeri untuk memilih foto.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setProfilePicUri(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Nama tidak boleh kosong.");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      // --- SIMULASI UPDATE ---
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Updating profile:", { name, newProfilePicUri: profilePicUri });
      const finalProfilePicUrl = profilePicUri;
      // --- AKHIR SIMULASI ---

      const updatedData: Partial<User> = {
         name: name.trim(),
         ...(finalProfilePicUrl !== user?.profilePicUrl && { profilePicUrl: finalProfilePicUrl ?? undefined })
      };
      await updateUserData(updatedData);
      Alert.alert("Sukses", "Profil berhasil diperbarui.");
      router.back();
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Gagal memperbarui profil. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-4 active:opacity-60">
           <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text className="text-gray-800 text-xl font-poppins-semibold">
          Edit Profil
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }} // Adjusted padding
        keyboardShouldPersistTaps="handled"
      >
        {/* Animated Profile Picture Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.8, translateY: -20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="items-center mb-8"
        >
          <View className="relative">
            <Image
              source={{ uri: profilePicUri || initialProfileImageUrl }}
              className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md" // Increased size, added shadow
            />
            <Pressable
              onPress={handleChoosePhoto}
              // Use primary color for camera button
              className="absolute bottom-1 right-1 bg-primary p-2 rounded-full border-2 border-white active:opacity-80 shadow"
            >
              <Camera size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        </MotiView>

        {/* Animated Name Input Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }} // Added delay
          className="mb-6"
        >
          <Text className="text-sm font-poppins-medium text-gray-600 mb-2 ml-1">Nama Lengkap</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama lengkap Anda"
            placeholderTextColor="#9CA3AF"
            // Use primary color for focus
            className="bg-white border border-gray-300 rounded-lg p-4 text-base font-poppins-regular text-gray-800 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </MotiView>

        {/* Animated Save Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type:'timing', duration: 400, delay: 200 }} // Added delay
        >
          <Pressable
            onPress={handleSaveChanges}
            disabled={isLoading}
            // Use primary color
            className={`py-4 px-6 mt-4 rounded-lg flex-row items-center justify-center space-x-2 shadow-md ${
              isLoading ? 'bg-gray-400' : 'bg-primary active:opacity-80'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Save size={20} color="#FFFFFF" />
            )}
            <Text className="text-white text-lg font-poppins-semibold">
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Text>
          </Pressable>
         </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}