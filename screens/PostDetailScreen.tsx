import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart, ChevronLeft, Calendar } from 'lucide-react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Comments from '../components/Comments';
import { useTheme } from '~/context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75; // 4:3 aspect ratio

type RootStackParamList = {
  Home: undefined;
  PostDetail: { postId: string };
};

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PostDetailScreen() {
  const route = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { postId } = route.params;
  const { isDarkMode } = useTheme();

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(`https://a-updates-alpha.vercel.app/api/posts/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
  });

  if (isLoading || !post) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header with back button */}
      <View className={`flex-row items-center px-4 py-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <ChevronLeft color="#16A34A" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-['Poppins-SemiBold']">Article</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Featured Image */}
        {post.attachments?.[0]?.url && (
          <View>
            <Image
              source={{ uri: post.attachments[0].url }}
              style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
              resizeMode="cover"
            />
            {/* Optional overlay gradient */}
            <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          </View>
        )}

        <View className="p-4">
          {/* Category Badge */}
          <View className="bg-green-500 self-start rounded-full px-3 py-1 mb-4">
            <Text className="text-white text-xs font-['Poppins-Medium'] uppercase">
              {post.category || 'SPORTS'}
            </Text>
          </View>

          {/* Author Info */}
          <View className="flex-row items-center mb-4">
            <View className="h-10 w-10 rounded-full bg-gray-100 justify-center items-center">
              <Text className="text-xl text-gray-500">
                {post.user.displayName?.[0]?.toUpperCase() || 'A'}
              </Text>
            </View>
            <View className="ml-3">
              <Text className="font-['Poppins-Medium'] text-green-600">{post.user.displayName}</Text>
              <View className="flex-row items-center">
                <Calendar size={12} color="#666666" />
                <Text className="text-xs text-gray-500 ml-1 font-sans">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </Text>
              </View>
            </View>
          </View>

          {/* Title */}
          <Text className={`text-2xl font-['Poppins-Bold'] ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>
            {post.title}
          </Text>

          {/* Full Description */}
          <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-6 font-['Poppins-Regular']`}>
            {post.description}
          </Text>

          {/* Post Body - if HTML content exists */}
          {post.body && (
            <View className="mb-6">
              <Text className="text-base text-gray-800 leading-relaxed">
                {post.body.replace(/<[^>]*>/g, '')} {/* Simple HTML stripping */}
              </Text>
            </View>
          )}

          {/* Interactions */}
          <View className="flex-row items-center justify-between py-4 border-t border-gray-200">
            <View className="flex-row items-center space-x-6">
              <TouchableOpacity className="flex-row items-center space-x-2">
                <MessageCircle color="#16A34A" size={20} />
                <Text className="text-gray-600">{post._count?.comments || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center space-x-2">
                <Heart color="#16A34A" size={20} />
                <Text className="text-gray-600">{post._count?.likes || 0}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View className="pt-4 border-t border-gray-200">
            <Text className="text-xl font-bold mb-4">Comments</Text>
            {post.user ? (
              <Comments postId={postId} user={post.user} />
            ) : (
              <View className="py-4 px-3 bg-gray-50 rounded-lg">
                <Text className="text-gray-500 text-center">
                  Please sign in to leave a comment
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 