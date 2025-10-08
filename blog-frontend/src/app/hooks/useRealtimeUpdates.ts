import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_RANDOM_POSTS } from '../requests/queries/getRandomPosts';

export function useRealtimeUpdates() {
  const client = useApolloClient();

  // Функция для обновления кэша при получении новых данных
  const updateCache = (postId: string, updateFn: (existingData: any) => any) => {
    try {
      client.cache.updateQuery(
        { query: GET_RANDOM_POSTS },
        (existingData) => {
          if (!existingData?.getRandomPosts) return existingData;
          
          return {
            ...existingData,
            getRandomPosts: existingData.getRandomPosts.map((post: any) => {
              if (post.id === postId) {
                return updateFn(post);
              }
              return post;
            })
          };
        }
      );
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  };

  // Функция для добавления лайка в кэш
  const addLikeToCache = (postId: string, like: any) => {
    updateCache(postId, (post) => ({
      ...post,
      likes: [...(post.likes || []), like]
    }));
  };

  // Функция для добавления комментария в кэш
  const addCommentToCache = (postId: string, comment: any) => {
    updateCache(postId, (post) => ({
      ...post,
      comments: [comment, ...(post.comments || [])]
    }));
  };

  // Функция для обновления комментария в кэше
  const updateCommentInCache = (postId: string, updatedComment: any) => {
    updateCache(postId, (post) => ({
      ...post,
      comments: (post.comments || []).map((comment: any) => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    }));
  };

  // Функция для удаления комментария из кэша
  const removeCommentFromCache = (postId: string, commentId: string) => {
    updateCache(postId, (post) => ({
      ...post,
      comments: (post.comments || []).filter((comment: any) => comment.id !== commentId)
    }));
  };

  return {
    updateCache,
    addLikeToCache,
    addCommentToCache,
    updateCommentInCache,
    removeCommentFromCache
  };
}
