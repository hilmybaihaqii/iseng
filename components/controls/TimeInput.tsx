// File: components/controls/TimeInput.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TextInputProps,
} from 'react-native';
import { Clock } from 'lucide-react-native';
import '../../global.css';

type TimeInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'editable'>;
export default function TimeInput({
  label,
  value,
  onChangeText,
  error,
  disabled = false,
  ...rest
}: TimeInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleTextChange = (text: string) => {
    let cleanText = text.replace(/[^0-9]/g, '');

    if (cleanText.length > 4) {
      cleanText = cleanText.slice(0, 4);
    }

    let hours = cleanText.slice(0, 2);
    let minutes = cleanText.slice(2, 4);

    if (hours.length === 2 && parseInt(hours, 10) > 23) {
      hours = '23';
    }

    if (minutes.length === 2 && parseInt(minutes, 10) > 59) {
      minutes = '59';
    }

    let formattedText = hours;
    if (cleanText.length > 2) {
      formattedText += `:${minutes}`;
    }

    onChangeText(formattedText);
  };

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    rest.onFocus?.(e);
  };

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    rest.onBlur?.(e);
  };

  const handlePressContainer = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const containerClasses = [
    'flex-row',
    'items-center',
    'rounded-lg',
    'p-3',
    'border',
    'transition-all',
    disabled
      ? 'bg-gray-200 border-gray-200'
      : error
        ? 'bg-red-50 border-red-500'
        : isFocused
          ? 'bg-white border-blue-500'
          : 'bg-gray-100 border-gray-200',
  ].join(' ');

  const iconColor = disabled ? '#9CA3AF' : error ? '#EF4444' : '#6B7280';
  const labelColor = disabled
    ? 'text-gray-400'
    : error
      ? 'text-red-600'
      : 'text-gray-500';

  return (
    <View className="flex-1">
      <Text
        className={`text-sm font-poppins-medium mb-1 ${labelColor}`}
        accessibilityLabel={`${label} input label`}
      >
        {label}
      </Text>

      <Pressable onPress={handlePressContainer} className={containerClasses}>
        <Clock size={20} color={iconColor}  style={{ marginRight: 10 }}/>
        <TextInput
          ref={inputRef}
          className="flex-1 text-lg font-poppins-semibold text-gray-900"
          placeholder="HH:MM"
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          maxLength={5} // (HH:MM)
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          accessibilityLabel={label}
          {...rest}
        />
      </Pressable>

      {error && !disabled && (
        <Text className="text-xs font-poppins-regular text-red-600 mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}