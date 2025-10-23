import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { Link, useRouter } from 'expo-router'; // Use useRouter hook
import React, { useState, createRef } from 'react';
import { MotiView, MotiText, useAnimationState } from 'moti';
import { Check, Mail, Lock, Eye, EyeOff, LucideIcon } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av'; // Keep expo-av
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

import MyLogo from '../../assets/logo/full.svg'; // Import SVG logo
const loginVideoSource = require('../../assets/video/welcome.mp4');

const motiTransition = (delay = 0) =>
  ({
    type: 'timing',
    duration: 500,
    delay,
  } as const);

type AuthInputProps = {
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
} & TextInputProps;

const AuthInput = ({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  isPassword = false,
  className,
  ...props
}: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      className={`w-full flex-row items-center rounded-xl bg-white/30 border border-white/50
                 focus-within:border-white focus-within:ring-1 focus-within:ring-white
                 ${className || ''}`}
    >
      {/* Using inline style for icon margin */}
      <Icon size={20} color="#FFFFFF" style={{ marginLeft: 20 }} />
      <TextInput
        // Keep padding consistent with inline icon style
        className="flex-1 pl-5 pr-4 py-4 text-lg text-white font-poppins-regular"
        placeholder={placeholder}
        placeholderTextColor="#E0E0E0"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        autoCapitalize="none"
        {...props}
      />
      {isPassword && (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          className="mr-4 p-1"
          hitSlop={10}
        >
          {showPassword ? (
            <EyeOff size={20} color="#FFFFFF" />
          ) : (
            <Eye size={20} color="#FFFFFF" />
          )}
        </Pressable>
      )}
    </View>
  );
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const cardAnimationState = useAnimationState({
    from: { opacity: 0, translateY: 100 },
    to: { opacity: 1, translateY: 0 },
  });
  const videoRef = createRef<Video>();
  const router = useRouter(); // Initialize useRouter hook

  const handleLogin = async () => {
    if (localIsLoading) return;
    setLocalIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email dan Kata Sandi wajib diisi!');
      setLocalIsLoading(false);
      return;
    }

    try {
      // --- SIMULASI BACKEND LOGIN ---
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const backendResponse = {
        success: true,
        user: {
          id: '123',
          name: 'Hilmy',
          role: 'superuser' as 'superuser' | 'user', // Change role for testing if needed
        },
        token: 'xyz...'
      };
      // --- AKHIR SIMULASI ---

      await login(backendResponse.user, backendResponse.token);
      // Navigation handled by AuthContext useEffect

    } catch (apiError) {
      console.error(apiError);
      setError('Email atau Kata Sandi salah. Coba lagi.');
      setLocalIsLoading(false); // Stop local loading on error
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-black">
      <Video
        ref={videoRef}
        style={StyleSheet.absoluteFillObject}
        source={loginVideoSource}
        shouldPlay={true}
        isLooping={true}
        isMuted={true}
        resizeMode={ResizeMode.COVER} // Keep expo-av
      />
      <View className="bg-black/50" style={StyleSheet.absoluteFillObject} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 80,
          paddingBottom: 48,
          justifyContent: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          state={cardAnimationState}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="w-full items-center"
        >
          <BlurView
            intensity={40}
            tint="dark"
            className="w-full p-6 rounded-3xl overflow-hidden"
          >

            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={motiTransition(200)}
              className="w-full items-center mb-4"
            >
              <MyLogo width={200} height={100} />
            </MotiView>

            <MotiText
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={motiTransition(300)}
              className="text-4xl font-poppins-bold text-white mb-3 leading-tight text-center"
            >
              Selamat Datang Kembali
            </MotiText>
            <MotiText
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={motiTransition(400)}
              className="text-base font-poppins-regular text-gray-200 mb-10 text-center"
            >
              Masuk untuk melanjutkan petualangan Anda!
            </MotiText>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={motiTransition(500)}
              className="w-full"
            >
              <AuthInput
                icon={Mail}
                placeholder="Email Anda"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="mb-5"
              />
              <AuthInput
                icon={Lock}
                placeholder="Kata Sandi"
                value={password}
                onChangeText={setPassword}
                isPassword={true}
              />
            </MotiView>

            {error && (
              <MotiText
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300 }}
                className="text-red-400 font-poppins-regular text-sm mt-4 text-center"
              >
                {error}
              </MotiText>
            )}

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={motiTransition(600)}
              className="w-full mt-6 flex-row justify-between items-center"
            >
              <Pressable
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
                hitSlop={10}
              >
                <View
                  className={`w-5 h-5 rounded-md border-2 items-center justify-center
                            ${rememberMe ? 'bg-red-600 border-red-600' : 'border-white/50 bg-white/20'}`}
                >
                  {rememberMe && <Check size={14} color="#FFFFFF" />}
                </View>
                <Text className="ml-2 text-white font-poppins-regular text-base">
                  Ingat Saya
                </Text>
              </Pressable>

              <Link href="/(auth)/forgot-password" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <Text
                      className={`font-poppins-semibold text-base text-red-400 ${pressed ? 'opacity-80' : 'opacity-100'}`}
                    >
                      Lupa Kata Sandi?
                    </Text>
                  )}
                </Pressable>
              </Link>
            </MotiView>

            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={motiTransition(700)}
              className="mt-10"
            >
              <Pressable onPress={handleLogin} disabled={localIsLoading}>
                {({ pressed }) => (
                  <MotiView
                    animate={{ scale: pressed ? 0.98 : 1 }}
                    transition={{ type: 'timing', duration: 100 }}
                    className={`w-full p-4 rounded-xl items-center shadow-lg bg-red-600 flex-row justify-center space-x-2
                                  ${localIsLoading ? 'opacity-70' : 'opacity-100'}`}
                  >
                    {localIsLoading && (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    )}

                    <Text className="text-white text-xl font-poppins-semibold tracking-wider">
                      {localIsLoading ? 'Memproses...' : 'Masuk'}
                    </Text>
                  </MotiView>
                )}
              </Pressable>
            </MotiView>

            {/* Conditional Back Button */}
            {router.canGoBack() && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={motiTransition(800)}
                className="items-center mt-6"
              >
                <Pressable onPress={() => router.back()}>
                  {({ pressed }) => (
                    <Text
                      className={`font-poppins-regular text-base text-white ${pressed ? 'opacity-70' : 'opacity-100'}`}
                    >
                      Kembali
                    </Text>
                  )}
                </Pressable>
              </MotiView>
            )}

          </BlurView>
        </MotiView>
      </ScrollView>

      <View className="w-full items-center px-4 py-6 bg-transparent absolute bottom-0">
        <Text className="text-white text-sm font-poppins-regular">
          © D&apos;mouv {new Date().getFullYear()}
        </Text>
      </View>

    </SafeAreaView>
  );
};

export default LoginScreen;