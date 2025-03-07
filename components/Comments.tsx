import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react-native';
import Comment from './Comment';
import CommentInput from './CommentInput';
import { useTheme } from '~/context/ThemeContext';

interface CommentsProps {
  postId: string;
  user?: any; // Replace with your user type
}

export default function Comments({ postId, user }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(
        `https://a-updates-alpha.vercel.app/api/posts/${postId}/comments${pageParam ? `?cursor=${pageParam}` : ''}`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      if (!response.ok) {
        return { comments: [], previousCursor: null };
      }
      return response.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const comments = data?.pages.flatMap((page) => page.comments) || [];
  const { isDarkMode } = useTheme();

  return (
    <View className="space-y-4">
      {user && <CommentInput postId={postId} />}
      
      {hasNextPage && (
        <TouchableOpacity 
          onPress={() => fetchNextPage()}
          disabled={isFetching}
          className="py-2"
        >
          <Text className="text-green-600 text-center font-medium">
            Load previous comments
          </Text>
        </TouchableOpacity>
      )}

      {status === 'pending' && (
        <ActivityIndicator size="small" color="#16A34A" />
      )}

      {status === 'success' && !comments.length && (
        <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center font-sans`}>
          No comments yet.
        </Text>
      )}

      <View className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </View>
    </View>
  );
} 