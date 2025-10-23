import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { useEffect } from 'react'; // Import useEffect for logging
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import "../../global.css";

export default function HomeScreen() {
  // Get user and logout from context
  const { user, logout } = useAuth();

  // Add a log here to check if 'logout' is a function when the component mounts/re-renders
  useEffect(() => {
    console.log('[Home Screen] Is logout a function?', typeof logout);
  }, [logout]); // Dependency array ensures this runs if 'logout' reference changes

  // Simplified handleLogout - Directly call the context function
  const handleLogout = () => {
    console.log("Logout button pressed. Attempting to call context logout...");
    if (typeof logout === 'function') {
        logout(); // Directly call the function from context
    } else {
        console.error("!!! Logout function from context is not available or not a function!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        <View className="p-6">
          <Text className="text-white text-4xl font-poppins-bold mb-2">
            Beranda
          </Text>
          <Text className="text-gray-300 text-lg font-poppins-regular mb-10">
            Selamat datang, {user?.name || 'Pengguna'}! ({user?.role})
          </Text>

          <Pressable onPress={handleLogout}> 
            {({ pressed }) => (
              <View
                className={`w-full p-4 rounded-xl bg-red-600 flex-row justify-center items-center space-x-2
                            ${pressed ? 'opacity-80' : 'opacity-100'}`}
              >
                <LogOut size={20} color="#FFFFFF" />
                <Text className="text-white text-xl font-poppins-semibold">
                  KELUAR
                </Text>
              </View>
            )}
          </Pressable>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}