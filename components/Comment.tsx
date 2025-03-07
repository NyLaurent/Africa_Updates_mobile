import React from 'react';
import { View, Text } from 'react-native';
import { formatDistanceToNow } from 'date-fns';

export default function Comment({ comment }: { comment: any }) { // Replace 'any' with your comment type
  return (
    <View className="py-4">
      <View className="flex-row items-center mb-2">
        <View className="h-8 w-8 rounded-full bg-gray-100 justify-center items-center">
          <Text className="text-sm text-gray-500 font-medium">
            {comment.user.displayName?.[0]?.toUpperCase() || 'A'}
          </Text>
        </View>
        <View className="ml-2">
          <Text className="font-medium text-gray-900">
            {comment.user.displayName || 'Anonymous'}
          </Text>
          <Text className="text-xs text-gray-500 font-sans">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </Text>
        </View>
      </View>
      <Text className="text-gray-600 ml-10 font-sans">
        {comment.content}
      </Text>
    </View>
  );
} 