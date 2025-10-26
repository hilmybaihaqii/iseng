import React, { memo } from 'react';
import { View, Text, Pressable, Image, PressableProps } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const PLACEHOLDER_IMAGE = 'https://placehold.co/60x60/E2E8F0/A0AEC0?text=PP';

interface ProfileSummaryProps extends PressableProps {
  user: { 
    name?: string; 
    role?: string;
    profilePicUrl?: string | null;
  };
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ 
  user, 
  className, 
  ...props
}) => {
  
  const imageUrl = user?.profilePicUrl ? user.profilePicUrl : PLACEHOLDER_IMAGE;

  // Fallback untuk nama dan peran
  const displayName = user?.name || 'Nama Pengguna';
  const displayRole = user?.role || 'Peran Pengguna';
  const baseClassName = "flex-row items-center justify-between bg-white p-4 rounded-xl mb-6 shadow-sm";
  const combinedClassName = [baseClassName, className].filter(Boolean).join(' ');

  return (
    <Pressable
      className={combinedClassName}
      accessibilityRole="button"
      accessibilityLabel={`Edit Profil, ${displayName}, ${displayRole}`}
      {...props}
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: imageUrl }}
          className="w-12 h-12 rounded-full mr-4 bg-gray-200"
        />
        <View>
          <Text className="text-lg font-poppins-semibold text-gray-800">
            {displayName}
          </Text>
          <Text className="text-sm font-poppins-regular text-gray-500 capitalize">
            {displayRole}
          </Text>
        </View>
      </View>
      <ChevronRight size={20} color="#A0AEC0" />
    </Pressable>
  );
};

export default memo(ProfileSummary);