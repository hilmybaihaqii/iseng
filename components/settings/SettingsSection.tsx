import React, { memo } from 'react';
import { View, Text, ViewProps } from 'react-native'; 

interface SettingsSectionProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  title, 
  children, 
  className, 
  ...props 
}) => {
  
  // Kotak Luar (Hanya untuk bayangan, style sesuai ProfileSummary)
  const shadowWrapperClassName = [
    "rounded-xl mb-6 shadow-sm", 
    className
  ].filter(Boolean).join(' ');

  // Kotak Dalam (Untuk konten, style sesuai ProfileSummary)
  const contentWrapperClassName = "bg-white rounded-xl overflow-hidden";

  return (
    <View className={shadowWrapperClassName} {...props}> 
      <View className={contentWrapperClassName}> 
        
        {title && (
          <Text className="text-xs font-poppins-semibold text-gray-500 uppercase px-4 pt-4 pb-2 tracking-wide">
            {title}
          </Text>
        )}
        
        {children}
      
      </View>
    </View>
  );
};

export default memo(SettingsSection);
