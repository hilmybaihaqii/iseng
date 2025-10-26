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
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// PERBAIKAN 1: Impor 'useEffect'
import React, { useState, createRef, useEffect } from 'react';
import { MotiView, MotiText, useAnimationState } from 'moti';
import {
  Mail,
  CheckCircle,
  LucideIcon,
} from 'lucide-react-native';
// PERBAIKAN 2: Ganti impor 'expo-av'
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur';

import MyLogo from '../../assets/logo/full.svg';

const loginVideoSource = require('../../assets/video/welcome.mp4');

const motiTransition = (delay = 0) =>
  ({
    type: 'timing',
    duration: 500,
    delay,
  } as const);

// ... (Komponen AuthInput tidak perlu diubah) ...
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
 return (
  <View
   className={`w-full flex-row items-center rounded-xl bg-white/30 border border-white/50
        focus-within:border-white focus-within:ring-1 focus-within:ring-white
        ${className || ''}`}
  >
   <Icon size={20} color="#FFFFFF" style={{ marginLeft: 20 }} />
   <TextInput
    className="flex-1 pr-4 py-4 text-lg text-white font-poppins-regular"
    style={{ paddingLeft: 20 }}
    placeholder={placeholder}
    placeholderTextColor="#E0E0E0"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={false}
    autoCapitalize="none"
    {...props}
   />
  </View>
 );
};


const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const cardAnimationState = useAnimationState({
    from: { opacity: 0, translateY: 100 },
    to: { opacity: 1, translateY: 0 },
  });
  
  const videoRef = createRef<VideoView>();
  const player = useVideoPlayer(loginVideoSource);

  useEffect(() => {
    if (player) {
      player.play();
      player.loop = true;
      player.muted = true;
    }
  }, [player]);

  const handleResetPassword = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');

    if (!email) {
      setError('Email wajib diisi!');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Password reset link sent to:', email);
      setIsSent(true);
    } catch (apiError) {
      console.error(apiError);
      setError('Email tidak ditemukan atau terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };


  // Tampilan Form Input
  const renderForm = () => (
    <>
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
        Lupa Kata Sandi?
      </MotiText>
      <MotiText
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={motiTransition(400)}
        className="text-base font-poppins-regular text-gray-200 mb-10 text-center"
      >
        Jangan khawatir! Masukkan email Anda di bawah ini.
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
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={motiTransition(600)}
        className="mt-10"
      >
        <Pressable onPress={handleResetPassword} disabled={isLoading}>
          {({ pressed }) => (
            <MotiView
              animate={{ scale: pressed ? 0.98 : 1 }}
              transition={{ type: 'timing', duration: 100 }}
              className={`w-full p-4 rounded-xl items-center shadow-lg bg-red-600 flex-row justify-center space-x-2 
                            ${isLoading ? 'opacity-70' : 'opacity-100'}`}
            >
              {isLoading && (
                <ActivityIndicator size="small" color="#FFFFFF" />
              )}
              
              <Text className="text-white text-xl font-poppins-semibold tracking-wider">
                {isLoading ? 'Mengirim...' : 'Reset Password'}
              </Text>
            </MotiView>
          )}
        </Pressable>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={motiTransition(700)}
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
    </>
  );

  // Tampilan Sukses
  const renderSuccess = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' }}
      className="items-center justify-center py-10"
    >
      <CheckCircle size={64} color="#4ADE80" />
      
      <Text className="text-3xl font-poppins-bold text-white mt-6 mb-2">
        Link Terkirim!
      </Text>
      <Text className="text-base font-poppins-regular text-gray-200 text-center mb-10 px-4">
        Silakan periksa kotak masuk email Anda untuk instruksi reset kata sandi.
      </Text>
      <Pressable onPress={() => router.push('/(auth)/login')}>
        {({ pressed }) => (
          <View
            className={`py-3 px-6 rounded-xl border-2 border-red-400 ${pressed ? 'bg-red-400/20' : 'bg-transparent'}`}
          >
            <Text className="text-red-400 text-lg font-poins-semibold">
              Kembali ke Login
            </Text>
          </View>
        )}
      </Pressable>
    </MotiView>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <VideoView
        ref={videoRef}
        style={StyleSheet.absoluteFillObject}
        player={player}
        contentFit="cover"
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
            {isSent ? renderSuccess() : renderForm()}
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

export default ForgotPasswordScreen;