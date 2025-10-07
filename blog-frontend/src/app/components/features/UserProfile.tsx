'use client';

import { useQuery } from '@apollo/client';
import { getUserByID } from '../../requests/queries/getUserByID';
import { GET_USER_POSTS } from '../../requests/queries/getUserPosts';
import { UserData } from '../../types/user';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { UserAvatar } from '../ui/UserAvatar';
import { Post } from '../../types/post';
import { PostCard } from './PostCard';
import { ProfileEditForm } from './ProfileEditForm';
import { UserInfoGrid } from '../ui/UserInfoGrid';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { loading, error, data } = useQuery<UserData>(getUserByID, {
    variables: { id: userId }
  });
  const { data: postsData } = useQuery<{ getUserPosts: Post[] }>(GET_USER_POSTS, {
    variables: { id: userId }
  });

  if (loading) return <LoadingSpinner size="lg" className="min-h-64" />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.findUserByID) return <ErrorMessage title="Пользователь не найден" message="" />;

  const user = data.findUserByID;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card">
        <h1 className="text-3xl font-bold text-card-foreground mb-8 pb-4 border-b border-border">
          Профиль пользователя
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <UserAvatar user={user} size="lg" />

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted text-lg">@{user.userName}</p>
              </div>
              {currentUser?.id === user.id && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-secondary"
                >
                  {isEditing ? 'Отмена' : 'Редактировать'}
                </button>
              )}
            </div>

            {isEditing && currentUser?.id === user.id ? (
              <ProfileEditForm
                initialBio={user.bio || ''}
                initialAvatar={user.avatar || ''}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                {user.bio && (
                  <div className="bg-secondary rounded-xl p-4">
                    <h3 className="font-semibold text-secondary-foreground mb-2">О себе</h3>
                    <p className="text-secondary-foreground leading-relaxed">{user.bio}</p>
                  </div>
                )}

                <UserInfoGrid user={user} />
              </>
            )}
          </div>
        </div>
      </div>

      {postsData?.getUserPosts && (
        <div className="card mt-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4">Посты пользователя</h2>
          <div className="space-y-6">
            {postsData.getUserPosts.length === 0 ? (
              <div className="text-muted">Постов пока нет</div>
            ) : (
              postsData.getUserPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}