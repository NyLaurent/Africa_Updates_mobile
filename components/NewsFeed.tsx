import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl,Dimensions } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
 // If you have this, otherwise we'll use fetch
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageCircle, Heart } from 'lucide-react-native';
import { useTheme } from '~/context/ThemeContext';

const windowWidth = Dimensions.get('window').width;

type Post = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  user: {
    displayName: string;
    avatarUrl: string;
  };
  attachments: Array<{ url: string }>;
  _count: {
    comments: number;
    likes: number;
  };
};

type RootStackParamList = {
  Home: undefined;
  PostDetail: { postId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NewsFeed() {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode } = useTheme();

  const { data, fetchNextPage, hasNextPage, isFetching, status, refetch } = useInfiniteQuery({
    queryKey: ['mobile-news-feed'],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`https://a-updates-alpha.vercel.app/api/posts/latest`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const renderPost = (post: Post) => (
    <View 
      key={post.id} 
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl mb-4 overflow-hidden`}
    >
      {post.attachments?.[0]?.url && (
        <Image
          source={{ uri: post.attachments[0].url }}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}
      
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <View className="h-10 w-10 rounded-full overflow-hidden mr-3">
            {post.user.avatarUrl ? (
              <Image
                source={{ uri: post.user.avatarUrl }}
                className="h-10 w-10"
                resizeMode="cover"
              />
            ) : (
              <View className="h-10 w-10 rounded-full bg-gray-200 justify-center items-center">
                <Text className={`text-gray-600 text-lg font-semibold`}>
                  {post.user.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-green-600 font-medium">{post.user.displayName}</Text>
            <Text className="text-gray-500 text-sm">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </Text>
          </View>
          <View className="bg-green-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-['Poppins-Medium'] uppercase">
              {post.category || 'SPORTS'}
            </Text>
          </View>
        </View>

        <Text className="text-navy-900 text-xl font-['Poppins-Bold'] mb-2">
          {post.title}
        </Text>
        
        <Text className={`${isDarkMode ? 'text-gray-200' : 'text-gray-600'} mb-3 font-['Poppins-Regular']`} numberOfLines={2}>
          {post.description}
        </Text>

        <View className="flex-row items-center">
          <TouchableOpacity 
            className="flex-row items-center mr-4" 
            onPress={() => {}}
          >
            <MessageCircle size={18} color="#4B5563" className="mr-1" />
            <Text className="text-gray-600">{post._count.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center" 
            onPress={() => {}}
          >
            <Heart size={18} color="#4B5563" className="mr-1" />
            <Text className="text-gray-600">{post._count.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="ml-auto bg-green-500 px-3 py-1 rounded-md" 
            onPress={() => handlePostPress(post.id)}
          >
            <Text className="text-white text-sm">Read more</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (status === 'pending') {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className="p-4 items-center">
        <Text className="text-red-500">Failed to load news articles.</Text>
      </View>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        
        if (isCloseToBottom && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      }}
      scrollEventThrottle={400}
    >
      <Text className="text-3xl  text-green-600 mb-6 font-['Poppins-Bold']">
        Latest Posts
      </Text>
      
      {allPosts.map((post) => renderPost(post))}

      {isFetching && (
        <ActivityIndicator className="py-4" size="small" color="#16A34A" />
      )}
    </ScrollView>
  );
} 