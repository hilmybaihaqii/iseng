import {
  View, Text, Pressable, ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, UserPlus, User as UserIcon, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { MotiView, MotiText } from 'moti'; // Import Moti components

import "../../global.css"; 

// --- Custom Input Component (with Moti) ---
interface CustomInputProps {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInput['props']['keyboardType'];
  autoCapitalize?: TextInput['props']['autoCapitalize'];
  isPassword?: boolean;
  delay?: number; // Added delay for animation
}
const CustomInput: React.FC<CustomInputProps> = ({
  icon: Icon,
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  isPassword = false,
  delay = 0, // Default delay
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Wrap with MotiView
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay }}
      className="mb-6"
    >
      <Text className="text-sm font-poppins-medium text-gray-600 mb-2 ml-1">{label}</Text>
      <View className="flex-row items-center bg-white border border-gray-300 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <View className="ml-4">
          <Icon size={18} color="#6B7280" />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          className="flex-1 px-3 py-4 text-base font-poppins-regular text-gray-800"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {isPassword && (
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
        )}
      </View>
    </MotiView>
  );
};

// --- Role Selection Component (with Moti) ---
interface RoleSelectorProps {
  selectedRole: 'user' | 'superuser';
  onSelectRole: (role: 'user' | 'superuser') => void;
  delay?: number; // Added delay
}
const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole, delay = 0 }) => {
  return (
    // Wrap with MotiView
    <MotiView
       from={{ opacity: 0, translateY: 20 }}
       animate={{ opacity: 1, translateY: 0 }}
       transition={{ type: 'timing', duration: 400, delay }}
       className="mb-6"
    >
      <Text className="text-sm font-poppins-medium text-gray-600 mb-2 ml-1">Peran Pengguna</Text>
      <View className="flex-row space-x-3">
        <Pressable
          onPress={() => onSelectRole('user')}
          className={`flex-1 py-3 px-4 rounded-lg border items-center justify-center transition-colors duration-150 ${
            selectedRole === 'user'
              ? 'bg-red-100 border-primary'
              : 'bg-white border-gray-300 active:bg-gray-100'
          }`}
        >
          <Text className={`font-poppins-medium ${
            selectedRole === 'user' ? 'text-primary' : 'text-gray-700'
          }`}>
            User Biasa
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onSelectRole('superuser')}
           className={`flex-1 py-3 px-4 rounded-lg border items-center justify-center transition-colors duration-150 ${
            selectedRole === 'superuser'
              ? 'bg-red-100 border-primary'
              : 'bg-white border-gray-300 active:bg-gray-100'
          }`}
        >
          <Text className={`font-poppins-medium ${
            selectedRole === 'superuser' ? 'text-primary' : 'text-gray-700'
          }`}>
            Super User
          </Text>
        </Pressable>
      </View>
    </MotiView>
  );
};

// --- Main Screen Component ---
export default function AddUserScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'superuser'>('user');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async () => {
     if (!name.trim() || !email.trim() || !password.trim()) {
       Alert.alert("Error", "Nama, Email, dan Password wajib diisi.");
       return;
     }
     if (isLoading) return;
     setIsLoading(true);

     try {
       await new Promise(resolve => setTimeout(resolve, 1500));
       const newUser = { name: name.trim(), email: email.trim(), password, role: selectedRole };
       console.log("Adding new user:", newUser);
       Alert.alert("Sukses", `Pengguna "${newUser.name}" (${newUser.role}) berhasil ditambahkan/diundang.`);
       setName('');
       setEmail('');
       setPassword('');
       setSelectedRole('user');
     } catch (error) {
       console.error("Failed to add user:", error);
       Alert.alert("Error", "Gagal menambahkan pengguna. Coba lagi.");
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
          Tambah Pengguna Baru
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Animated Description Text */}
        <MotiText
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
          className="text-base font-poppins-regular text-gray-600 mb-8 text-center px-4"
        >
          Masukkan detail untuk pengguna baru yang ingin Anda tambahkan.
        </MotiText>

        {/* Input Fields with Staggered Animation */}
        <CustomInput
          icon={UserIcon}
          label="Nama Lengkap"
          placeholder="Masukkan nama pengguna"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          delay={200} // Start slightly later
        />
        <CustomInput
          icon={Mail}
          label="Email Pengguna"
          placeholder="contoh@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          delay={300} // Start later
        />
         <CustomInput
          icon={Lock}
          label="Kata Sandi Awal"
          placeholder="Buat kata sandi untuk pengguna"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
          delay={400} // Start later
        />

        {/* Role Selection */}
        <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} delay={500} />

        {/* Add User Button (Animated) */}
        <MotiView
           from={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ type:'timing', duration: 400, delay: 600 }} // Last animation
        >
          <Pressable
            onPress={handleAddUser}
            disabled={isLoading}
            className={`py-4 px-6 mt-4 rounded-lg flex-row items-center justify-center space-x-2 ${
              isLoading ? 'bg-gray-400' : 'bg-primary active:opacity-80'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <UserPlus size={20} color="#FFFFFF" />
            )}
            <Text className="text-white text-lg font-poppins-semibold">
              {isLoading ? 'Menambahkan...' : 'Tambah Pengguna'}
            </Text>
          </Pressable>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}