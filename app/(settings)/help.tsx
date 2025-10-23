import { View, Text, Pressable, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState, useCallback } from 'react'; // Added useCallback
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native'; // Added ChevronUp
import { MotiView, MotiText } from 'moti'; // Import Moti components
import "../../global.css"

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = [
  {
    question: "Bagaimana cara menambahkan perangkat baru?",
    answer: "Untuk menambahkan perangkat baru, pastikan perangkat Anda dalam mode pairing, lalu buka tab 'Perangkat' di aplikasi dan tekan tombol '+' di pojok kanan atas. Ikuti instruksi pada layar."
  },
  {
    question: "Apakah saya bisa mengontrol perangkat dari luar rumah?",
    answer: "Ya, selama perangkat Anda terhubung ke jaringan Wi-Fi rumah Anda dan akun Anda terhubung ke cloud kami, Anda dapat mengontrol perangkat dari mana saja menggunakan aplikasi ini."
  },
  {
    question: "Bagaimana cara mengubah kata sandi saya?",
    answer: "Anda dapat mengubah kata sandi melalui menu 'Pengaturan > Kata Sandi'. Anda akan diminta memasukkan kata sandi saat ini sebelum membuat kata sandi baru."
  },
  {
    question: "Apa yang harus dilakukan jika perangkat tidak responsif?",
    answer: "Coba mulai ulang perangkat dengan mencabut dayanya selama beberapa detik. Pastikan juga koneksi Wi-Fi Anda stabil. Jika masalah berlanjut, periksa status server atau hubungi dukungan."
  },
  {
    question: "Bagaimana cara menghubungi dukungan pelanggan?",
    answer: "Anda dapat menghubungi kami melalui email di support@dmouv.com atau melalui fitur 'Hubungi Kami' di dalam aplikasi."
  },
];

// --- Collapsible FAQ Item Component ---
interface FaqItemProps {
  question: string;
  answer: string;
  index: number; // For animation delay
}
const FaqItem: React.FC<FaqItemProps> = ({ question, answer, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    // Configure layout animation for smooth expand/collapse
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    // Animate the entire item appearing
    <MotiView
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 100 }} // Staggered delay
      className="bg-white rounded-lg shadow-sm mb-4 border border-gray-200 overflow-hidden" // Added overflow-hidden
    >
      <Pressable
        onPress={toggleExpand}
        className="flex-row items-center justify-between p-4 active:bg-gray-50" // Feedback on press
      >
        <Text className="flex-1 text-base font-poppins-medium text-gray-800 mr-3">{question}</Text>
        {/* Animated Chevron */}
        <MotiView
          animate={{ rotate: isExpanded ? '180deg' : '0deg' }}
          transition={{ type: 'timing', duration: 200 }}
        >
          <ChevronDown size={20} color="#6B7280" />
        </MotiView>
      </Pressable>

      {/* Conditionally Render Answer with Animation */}
      {isExpanded && (
         <View className="px-4 pb-4 pt-2 border-t border-gray-100">
           <Text className="text-sm font-poppins-regular text-gray-600 leading-relaxed">
             {answer}
           </Text>
         </View>
      )}
    </MotiView>
  );
};

// --- Main Screen Component ---
export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
        <Pressable onPress={() => router.back()} className="p-2 mr-4 active:opacity-60">
           <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Text className="text-gray-800 text-xl font-poppins-semibold">
          Bantuan / FAQ
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiText // Animate Title
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          className="text-lg font-poppins-semibold text-gray-700 mb-6"
        >
          Pertanyaan Umum
        </MotiText>

        {/* Render FAQ Items from data */}
        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            index={index} // Pass index for animation delay
          />
        ))}

        {/* Contact Info (Animated) */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: faqs.length * 100 + 100 }} // Delay after last FAQ item
          className="mt-8 items-center"
        >
          <Text className="text-gray-500 font-poppins-regular text-center text-sm">
              Tidak menemukan jawaban? Hubungi kami di <Text className="text-primary font-poppins-medium">support@dmouv.com</Text>
          </Text>
        </MotiView>

      </ScrollView>
    </SafeAreaView>
  );
}