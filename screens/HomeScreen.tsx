import React from 'react';
import { View } from 'react-native';
import Header from '../components/Header';
import NewsFeed from '../components/NewsFeed';
import BottomNavBar from '../components/BottomNavBar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '~/context/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function HomeScreen({ navigation }: Props) {
  const { isDarkMode } = useTheme();
  
  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header navigation={navigation} />
      <View className="flex-1">
        <NewsFeed />
      </View>
      <BottomNavBar />
    </View>
  );
} 