import {
  View, Text, Pressable, TextInput, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import React, { useState } from 'react'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Lock, Eye, EyeOff } from 'lucide-react-native';
import { MotiView } from 'moti'; 

// Path: app/(settings)/ -> root
import "../../global.css"; 

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  delay?: number;
}
const PasswordInput: React.FC<PasswordInputProps> = ({ label, placeholder, value, onChangeText, delay = 0 }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay }}
      className="mb-6"
    >
      <Text className="text-sm font-poppins-medium text-gray-600 mb-2 ml-1">{label}</Text>
      <View className="flex-row items-center bg-white border border-gray-300 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <View className="ml-4">
          <Lock size={18} color="#6B7280" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          className="flex-1 px-3 py-4 text-base font-poppins-regular text-gray-800"
          autoCapitalize="none"
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          className="mr-4 p-1"
          hitSlop={10}
        >
          {showPassword ? (
            <EyeOff size={20} color="#6B7280" />
          ) : (
            <Eye size={20} color="#6B7280" />
          )}
        </Pressable>
      </View>
    </MotiView>
  );
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Semua kolom kata sandi wajib diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Kata sandi baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
       Alert.alert("Error", "Kata sandi baru minimal 6 karakter.");
       return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Updating password...");
      Alert.alert("Sukses", "Kata sandi berhasil diperbarui.");
      router.back();
    } catch (error: any) {
      console.error("Failed to update password:", error);
      Alert.alert("Error", "Gagal memperbarui kata sandi. Periksa kembali kata sandi saat ini atau coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        {/* Correct onPress syntax */}
        <Pressable onPress={() => router.back()} className="p-2 mr-4 active:opacity-60">
           <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text className="text-gray-800 text-xl font-poppins-semibold">
          Ubah Kata Sandi
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-base font-poppins-regular text-gray-600 mb-8 text-center px-4">
          Masukkan kata sandi Anda saat ini dan buat kata sandi baru yang aman.
        </Text>

        <PasswordInput
          label="Kata Sandi Saat Ini"
          placeholder="Masukkan kata sandi lama Anda"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          delay={100}
        />
        <PasswordInput
          label="Kata Sandi Baru"
          placeholder="Masukkan kata sandi baru"
          value={newPassword}
          onChangeText={setNewPassword}
          delay={200}
        />
        <PasswordInput
          label="Konfirmasi Kata Sandi Baru"
          placeholder="Ulangi kata sandi baru"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          delay={300}
        />

        {/* Save Button */}
        <MotiView
           from={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type:'timing', duration: 400, delay: 400 }}
        >
          <Pressable
            onPress={handleSavePassword}
            disabled={isLoading}
            className={`py-4 px-6 mt-4 rounded-lg flex-row items-center justify-center space-x-2 ${
              isLoading ? 'bg-gray-400' : 'bg-primary active:opacity-80'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Save size={20} color="#FFFFFF" />
            )}
            <Text className="text-white text-lg font-poppins-semibold">
              {isLoading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            </Text>
          </Pressable>
         </MotiView>
      </ScrollView> 
    </SafeAreaView> 
  );
}