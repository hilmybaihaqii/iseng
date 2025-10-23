import {
  View, Text, Pressable, ScrollView, LayoutAnimation, Platform, UIManager, Linking, Alert
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { MotiView, MotiText } from 'moti';
import "../../global.css";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} 

const faqs = [
   {
    question: "Bagaimana cara menghubungkan perangkat baru ke Wi-Fi?",
    answer: "Pastikan perangkat dalam mode pairing (biasanya lampu indikator berkedip cepat). Buka aplikasi, tekan ikon '+' di halaman Beranda, pilih jenis perangkat, dan ikuti instruksi untuk memilih jaringan Wi-Fi 2.4GHz Anda dan masukkan kata sandinya."
  },
  {
    question: "Perangkat saya offline atau tidak responsif, apa yang harus dilakukan?",
    answer: "1. Periksa koneksi internet dan router Wi-Fi Anda.\n2. Coba matikan dan nyalakan kembali perangkat (cabut daya selama 10 detik).\n3. Pastikan perangkat berada dalam jangkauan Wi-Fi yang baik.\n4. Hapus perangkat dari aplikasi dan coba tambahkan kembali.\n5. Jika masih bermasalah, hubungi dukungan."
  },
   {
    question: "Bisakah saya berbagi akses perangkat dengan anggota keluarga?",
    answer: "Ya, Anda bisa berbagi akses. Buka detail perangkat yang ingin dibagikan, cari opsi 'Bagikan Perangkat' atau 'Manajemen Anggota', lalu masukkan email akun anggota keluarga Anda."
  },
  {
    question: "Bagaimana cara membuat jadwal otomatis?",
    answer: "Buka detail perangkat yang diinginkan, cari menu 'Jadwal' atau 'Otomatisasi'. Tekan tombol tambah (+) untuk membuat jadwal baru, atur waktu, hari, dan aksi yang diinginkan (misal: Nyala/Mati)."
  },
  {
    question: "Bagaimana cara reset perangkat ke pengaturan pabrik?",
    answer: "Cara reset berbeda tiap perangkat. Umumnya, tekan dan tahan tombol fisik pada perangkat selama 5-10 detik hingga lampu indikator berkedip cepat atau berubah warna. Periksa buku manual perangkat Anda untuk instruksi spesifik."
  },
  {
    question: "Apakah data saya aman?",
    answer: "Kami menggunakan enkripsi standar industri untuk melindungi komunikasi antara perangkat, aplikasi, dan server kami. Silakan baca Kebijakan Privasi kami untuk detail lebih lanjut."
  },
];

// --- Collapsible FAQ Item Component (NativeWind) ---
interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
}
const FaqItem: React.FC<FaqItemProps> = ({ question, answer, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 100 + 100 }}
      // Styling container pakai className
      className="bg-white rounded-lg shadow-sm mb-4 border border-gray-200 overflow-hidden" 
    >
      <Pressable
        onPress={toggleExpand}
        // Styling tombol pertanyaan pakai className
        className="flex-row items-center justify-between p-4 active:bg-gray-50" 
      >
        {/* Styling teks pertanyaan pakai className */}
        <Text className="flex-1 text-base font-poppins-medium text-gray-800 mr-3">{question}</Text>
        {/* Icon tetap dibungkus View */}
        <View> 
          <MotiView
            animate={{ rotate: isExpanded ? '180deg' : '0deg' }}
            transition={{ type: 'timing', duration: 250 }}
          >
            <ChevronDown size={20} color="#6B7280" />
          </MotiView>
        </View>
      </Pressable>

      {isExpanded && (
         // Styling container jawaban pakai className
         <View className="px-4 pb-4 pt-2 border-t border-gray-100"> 
           {/* Styling teks jawaban pakai className */}
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

  const handleContactPress = () => {
    Linking.openURL('mailto:support@dmouv.com?subject=Bantuan Aplikasi Dmouv')
      .catch(err => Alert.alert("Error", "Tidak dapat membuka aplikasi email."));
  };

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
        // Styling container scroll pakai className
        contentContainerStyle={{ padding: 24 }} 
        keyboardShouldPersistTaps="handled"
      >
        <MotiText
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          // Styling judul pakai className
          className="text-lg font-poppins-semibold text-gray-700 mb-6" 
        >
          Pertanyaan Umum
        </MotiText>

        {faqs.map((faq, index) => (
          <FaqItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            index={index}
          />
        ))}

        {/* Contact Info */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: faqs.length * 100 + 200 }}
          // Styling container kontak pakai className
          className="mt-8 items-center" 
        >
          {/* Styling teks kontak pakai className */}
          <Text className="text-gray-500 font-poppins-regular text-center text-sm"> 
              Tidak menemukan jawaban?{' '}
              <Text onPress={handleContactPress} className="text-primary font-poppins-regular"> 
                Hubungi Call Center Kami
              </Text>
          </Text>
        </MotiView> 
      </ScrollView>
    </SafeAreaView>
  );
}