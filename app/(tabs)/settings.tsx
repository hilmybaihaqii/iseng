import { ScrollView, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {
  User, Lock, Info, HelpCircle, LogOut, UserPlus
} from 'lucide-react-native'; // Impor dirapikan

import ProfileSummary from '../../components/settings/ProfileSummary';
import SettingsSection from '../../components/settings/SettingsSection';
import MenuItem from '../../components/settings/MenuItem';

import "../../global.css";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); };

  // Fungsi navigasi (tidak berubah)
  const goToEditProfile = () => router.push('/edit-profile');
  const goToAddUser = () => router.push('/add-user');
  const goToProfileDetails = () => router.push('/profile-details');
  const goToChangePassword = () => router.push('/change-password');
  const goToAbout = () => router.push('/about');
  const goToHelp = () => router.push('/help');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        
        // --- PERUBAHAN PADDING (Disamakan) ---
        // Disesuaikan agar konsisten dengan Home & History screen
        contentContainerStyle={{ 
          paddingTop: 16,     // Semula: 5
          paddingBottom: 48,  // Semula: 50
          paddingHorizontal: 16, // Semula: 15
        }}
      >
        
        {/* --- PERUBAHAN MARGIN & PADDING (Disamakan) --- */}
        <View className="mb-8 px-4"> 
          {/* mb-12 -> mb-8 (konsisten) */}
          {/* px-4 ditambah agar judul sejajar dengan konten card */}
          <Text className="text-3xl font-poppins-semibold text-gray-800">
            Pengaturan
          </Text>
        </View>

        <ProfileSummary
          user={{ 
            name: user?.name, 
            role: user?.role, 
            profilePicUrl: user?.profilePicUrl 
          }}
          onPress={goToEditProfile}
        />

        {/* Urutan menu sudah benar */}
        <SettingsSection title="Pengaturan Akun">
          <MenuItem
            icon={Lock}
            label="Kata Sandi"
            onPress={goToChangePassword}
          />
          
          <MenuItem 
            icon={User} 
            label="Detail Profil" 
            onPress={goToProfileDetails}
            isLast={user?.role !== 'superuser'} 
          />

          {user?.role === 'superuser' && (
            <MenuItem 
              icon={UserPlus} 
              label="Tambah Pengguna Baru" 
              onPress={goToAddUser} 
              isLast={true} 
            />
          )}
        </SettingsSection>

        <SettingsSection title="Informasi">
          <MenuItem icon={Info} label="Tentang Aplikasi" onPress={goToAbout} />
          <MenuItem icon={HelpCircle} label="Bantuan / FAQ" onPress={goToHelp} isLast={true} />
        </SettingsSection>

        <SettingsSection className="mt-6">
            <MenuItem
              icon={LogOut}
              label="Keluar"
              onPress={handleLogout}
              isDestructive={true}
              isLast={true}
            />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
