import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  NativeScrollEvent, 
} from 'react-native';
import { router } from 'expo-router'; 
import { ArrowRight } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { createRef, useState } from 'react';
import "../global.css";

// INI SUDAH BENAR
import MyLogo from '../assets/logo/full.svg'; 

const videoSource = require('../assets/video/welcome.mp4'); 

const slides = [
  {
    key: '1',
    text: 'Your next adventure awaits you',
  },
  {
    key: '2',
    text: 'Discover hidden gems nearby',
  },
  {
    key: '3',
    text: 'Share your journey with friends',
  },
];

const WelcomeScreen = () => {
  const videoRef = createRef<Video>(); 
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0);

  const handleScroll = (event: NativeScrollEvent) => {
    if (scrollContainerWidth === 0) return;
    const index = Math.round(event.contentOffset.x / scrollContainerWidth);
    setActiveIndex(index);
  };
  
  return (
    <View style={StyleSheet.absoluteFillObject}>
      
      {/* Video Latar Belakang */}
      <Video
        ref={videoRef}
        style={StyleSheet.absoluteFillObject} 
        source={videoSource}
        shouldPlay={true}
        isLooping={true}
        isMuted={true}
        resizeMode={ResizeMode.COVER} 
      />

      {/* Overlay Gelap untuk Kontras */}
      <View className="bg-black/50" style={StyleSheet.absoluteFillObject} /> 
      
      {/* Konten Onboarding */}
      <View className="flex-1 justify-between items-center px-8 pb-16 pt-20"> 
        
        {/* INI JUGA SUDAH BENAR */}
        <View className="w-full items-start">
          <MyLogo width={130} height={50} />
        </View>

        {/* Tagline (ScrollView) */}
        <View className="w-full">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onLayout={(event) => {
              setScrollContainerWidth(event.nativeEvent.layout.width);
            }}
            onScroll={(event) => handleScroll(event.nativeEvent)}
            scrollEventThrottle={16}
            style={{ width: '100%' }}
          >
            {slides.map((slide) => (
              <View
                key={slide.key}
                style={{ width: scrollContainerWidth, height: 160 }} 
                className="justify-center"
              >
                <Text className="text-white text-5xl font-poppins-bold mb-4">
                  {slide.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Indikator Dot (Dinamis) */}
          <View className="flex-row mt-4">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${
                  activeIndex === index ? 'bg-white' : 'bg-gray-400'
                }`}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity 
          className="w-20 h-20 rounded-full mb-10 bg-white justify-center items-center shadow-xl"
          activeOpacity={0.7}
          onPress={() => router.push('/(auth)/login')}
        > 
          <ArrowRight size={30} color="#000000" /> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;