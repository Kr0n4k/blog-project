import { useMemo, useState, useEffect } from 'react';
import { useMutation, useSubscription } from '@apollo/client';
import { LIKE_POST_MUTATION } from '../../requests/mutations/auth';
import { LIKE_ADDED_SUBSCRIPTION } from '../../requests/subscriptions/subscriptions';
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import { RealtimeNotification } from '../ui/RealtimeNotification';
import { User } from '../../types/user';

interface PostStatsProps {
  postId: string;
  likes: Array<{ id: string; userId: string }>;
  comments: Array<{ id: string }>;
  currentUser?: User | null;
}

export function PostStats({ postId, likes, comments, currentUser }: PostStatsProps) {
  const [likePost] = useMutation(LIKE_POST_MUTATION);
  const { addLikeToCache } = useRealtimeUpdates();
  const [liked, setLiked] = useState(() => {
    if (!currentUser) return false;
    return likes.some(like => like.userId === currentUser.id);
  });
  const [count, setCount] = useState(likes.length);
  const [busy, setBusy] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Подписка на новые лайки
  const { data: likeData } = useSubscription(LIKE_ADDED_SUBSCRIPTION, {
    variables: { postId },
    skip: !postId
  });

  // Обновляем состояние при получении нового лайка
  useEffect(() => {
    if (likeData?.likeAdded) {
      const newLike = likeData.likeAdded;
      // Проверяем, не наш ли это лайк (чтобы избежать дублирования)
      if (newLike.userId !== currentUser?.id) {
        setCount(prev => prev + 1);
        // Обновляем кэш
        addLikeToCache(postId, newLike);
        // Показываем уведомление
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    }
  }, [likeData, currentUser?.id, postId, addLikeToCache]);

  const heartClass = useMemo(
    () => `transition-all duration-300 ${liked ? 'scale-110 text-green-400 animate-hi-tech-pulse' : 'text-white/60 hover:text-green-400'}`,
    [liked]
  );

  const handleLike = async () => {
    if (liked || busy || !currentUser) return;
    
    // Дополнительная проверка на существующий лайк
    const alreadyLiked = likes.some(like => like.userId === currentUser.id);
    if (alreadyLiked) {
      console.log('Post already liked by user');
      return;
    }
    
    setBusy(true);
    setLiked(true);
    setCount(c => c + 1);
    
    try {
      await likePost({
        variables: { postId },
        optimisticResponse: {
          likePost: {
            id: 'temp',
            userId: currentUser.id,
            postId: postId,
            createdAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      // Revert optimistic update
      setLiked(false);
      setCount(c => c - 1);
      
      // Проверяем, если это ошибка дублирования лайка
      if (error.message && error.message.includes('Unique constraint failed')) {
        console.log('Post already liked by user (server validation)');
        // Не показываем ошибку пользователю, так как это нормальное поведение
      } else {
        console.error('Error liking post:', error);
        // Здесь можно добавить уведомление пользователю об ошибке
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {showNotification && (
        <RealtimeNotification 
          message="NEW LIKE ADDED" 
          type="like" 
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-white/60 font-mono">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>{comments.length} COMMENTS</span>
          </div>
          <button
            type="button"
            onClick={handleLike}
            disabled={liked || busy || !currentUser}
            className={`flex items-center gap-2 group transition-all duration-300 hover:scale-105 ${
              liked ? 'opacity-100 cursor-default' : 'disabled:opacity-60 disabled:cursor-not-allowed'
            }`}
          >
            <svg className={`w-4 h-4 ${heartClass}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-6-4.35-9-7.5C1 12 1 9 3 7s5-2 7 0l2 2 2-2c2-2 5-2 7 0s2 5 0 6.5C18 16.65 12 21 12 21z" />
            </svg>
            <span className="text-white/60 group-hover:text-green-400 transition-colors">{count} LIKES</span>
          </button>
        </div>

        <button className="px-3 py-2 card-hi-tech text-white/80 text-sm rounded-lg hover:bg-green-400/10 transition-all duration-300 hover:scale-105 border border-gray-600 hover:border-green-400">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
    </>
  );
}