import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { UserIcon } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '~/context/ThemeContext';
import UserMenu from './UserMenu';

type HeaderProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function Header({ navigation }: HeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b border-gray-200 dark:border-gray-700`}>
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-2xl font-['Poppins-Bold'] text-green-600">
          Africa Updates
        </Text>
        <TouchableOpacity 
          className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} items-center justify-center shadow-md`}
          onPress={() => setMenuVisible(true)}
        >
          <UserIcon size={28} color="#16A34A" />
        </TouchableOpacity>
      </View>

      <UserMenu 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
} 