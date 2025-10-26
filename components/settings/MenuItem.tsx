import React, { memo } from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface MenuItemProps extends PressableProps {
  icon: React.ElementType;
  label: string;
  onPress: () => void;
  isLast?: boolean;
  isDestructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  onPress,
  isLast = false,
  isDestructive = false,
  className,
  ...props
}) => {
  
  const textColor = isDestructive ? 'text-primary' : 'text-gray-800';
  const iconColor = isDestructive ? '#E43636' : '#4B5563';

  const showChevron = !isDestructive;

  const baseClassName = `flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-gray-100' : ''} active:bg-gray-50`;
  const combinedClassName = [baseClassName, className].filter(Boolean).join(' ');

  const accessibilityLabel = `${label}${isDestructive ? ', Aksi destruktif' : ''}`;

  return (
    <Pressable
      onPress={onPress}
      className={combinedClassName}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      <View className="flex-row items-center flex-1 mr-2">
        <View className="mr-4">
          <Icon size={20} color={iconColor} />
        </View>
        <Text className={`text-base font-poppins-regular ${textColor}`}>
          {label}
        </Text>
      </View>

      {showChevron && <ChevronRight size={20} color="#A0AEC0" />}
    </Pressable>
  );
};

export default memo(MenuItem);