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
import { router } from 'expo-router';
import React, { useState, createRef, useEffect } from 'react'; 
import { MotiView, MotiText, useAnimationState } from 'moti';
import { Smartphone, LucideIcon } from 'lucide-react-native';

// Impor 'expo-video' baru
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

import MyLogo from '../../assets/logo/full.svg';
const videoSource = require('../../assets/video/welcome.mp4');

const motiTransition = (delay = 0) =>
  ({
    type: 'timing',
    duration: 500,
    delay,
  } as const);

type DeviceIdInputProps = {
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
} & TextInputProps;

const DeviceIdInput = ({
  icon: Icon,
  placeholder,
  value,
  onChangeText,
  className,
  ...props
}: DeviceIdInputProps) => {
  return (
    <View
      className={`w-full flex-row items-center rounded-xl bg-white/30 border border-white/50 focus-within:border-white focus-within:ring-1 focus-within:ring-white ${className || ''}`}
    >
      <Icon size={20} color="#FFFFFF" style={{ marginLeft: 20 }} />
      <TextInput
        className="flex-1 pl-6 pr-4 py-4 text-lg text-white font-poppins-regular"
        placeholder={placeholder}
        placeholderTextColor="#E0E0E0"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
};

const DeviceIdScreen = () => {
  const [deviceId, setDeviceId] = useState('');
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setDeviceIdComplete } = useAuth();
  const cardAnimationState = useAnimationState({
    from: { opacity: 0, translateY: 100 },
    to: { opacity: 1, translateY: 0 },
  });
  
  const videoRef = createRef<VideoView>();
  const player = useVideoPlayer(videoSource);

  useEffect(() => {
    if (player) {
      player.play();
      player.loop = true;
      player.muted = true;
    }
  }, [player]);

  const handleSubmitDeviceId = async () => {
    if (localIsLoading) return;
    setLocalIsLoading(true);
    setError('');

    if (!deviceId) {
      setError('Device ID wajib diisi!');
      setLocalIsLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Device ID submitted:', deviceId);
      await setDeviceIdComplete();

    } catch (apiError) {
      console.error(apiError);
      setError('Gagal memproses Device ID. Coba lagi.');
      setLocalIsLoading(false);
    }
  };

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
              Masukkan Device ID
            </MotiText>
            <MotiText
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={motiTransition(400)}
              className="text-base font-poppins-regular text-gray-200 mb-10 text-center"
            >
              Sebagai Super User, silakan masukkan ID perangkat Anda.
            </MotiText>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={motiTransition(500)}
              className="w-full"
            >
              <DeviceIdInput
                icon={Smartphone}
                placeholder="Device ID Anda"
                value={deviceId}
                onChangeText={setDeviceId}
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
              transition={motiTransition(600)} // Adjusted delay
              className="mt-10"
            >
              <Pressable onPress={handleSubmitDeviceId} disabled={localIsLoading}>
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
                      {localIsLoading ? 'Memproses...' : 'Lanjutkan'}
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

export default DeviceIdScreen;