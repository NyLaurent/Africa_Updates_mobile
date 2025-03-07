import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '~/context/ThemeContext';

interface CommentInputProps {
  postId: string;
}

async function submitComment({ postId, content }: { postId: string; content: string }) {
  const response = await fetch(`https://a-updates-alpha.vercel.app/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit comment');
  }

  return response.json();
}

export default function CommentInput({ postId }: CommentInputProps) {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  const { isDarkMode } = useTheme();

  const mutation = useMutation({
    mutationFn: (content: string) => submitComment({ postId, content }),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmit = () => {
    if (!comment.trim() || mutation.isPending) return;
    mutation.mutate(comment);
  };

  return (
    <View className={`flex-row items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg`}>
      <TextInput
        className={`flex-1 ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'} p-2 rounded-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} font-sans`}
        placeholder="Write a comment..."
        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
        value={comment}
        onChangeText={setComment}
        multiline
        editable={!mutation.isPending}
      />
      <TouchableOpacity 
        onPress={handleSubmit}
        disabled={mutation.isPending || !comment.trim()}
      >
        {mutation.isPending ? (
          <ActivityIndicator size="small" color="#16A34A" />
        ) : (
          <Send color="#16A34A" size={24} />
        )}
      </TouchableOpacity>
    </View>
  );
} 