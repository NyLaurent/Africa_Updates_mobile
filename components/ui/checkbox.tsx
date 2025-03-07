import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({ checked, onCheckedChange }: CheckboxProps) {
  return (
    <TouchableOpacity 
      onPress={() => onCheckedChange(!checked)}
      className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center"
      style={{ backgroundColor: checked ? '#16A34A' : 'white' }}
    >
      {checked && <Check size={16} color="white" />}
    </TouchableOpacity>
  );
} 