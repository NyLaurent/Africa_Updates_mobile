import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Button({ onPress, disabled, loading, className, children }: ButtonProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled || loading}
      className={`p-4 rounded-lg items-center justify-center ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold">{children}</Text>
      )}
    </TouchableOpacity>
  );
} 