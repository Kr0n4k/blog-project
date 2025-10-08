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
    <div className="min-h-screen bg-black relative overflow-hidden hi-tech-grid">
      {/* Фоновые элементы */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 hi-tech-circuit opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-hi-tech-scan"></div>
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-hi-tech-scan" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-hi-tech-scan" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-hi-tech-scan" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-10 left-10 w-2 h-20 bg-green-400 opacity-60 animate-hi-tech-pulse"></div>
        <div className="absolute top-20 right-10 w-2 h-16 bg-blue-400 opacity-60 animate-hi-tech-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-24 bg-green-400 opacity-60 animate-hi-tech-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок страницы */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 card-hi-tech rounded-lg border border-green-400 mb-8 animate-fadeIn">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-hi-tech-pulse hi-tech-glow"></div>
              <span className="text-green-400 font-mono font-medium text-sm tracking-wider">USER PROFILE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-hi-tech mb-4 font-mono animate-fadeIn delay-200">
              USER PROFILE
            </h1>
            <div className="w-24 h-1 bg-green-400 mx-auto hi-tech-glow animate-fadeIn delay-400"></div>
          </div>

          {/* Профиль пользователя */}
          <div className="card-hi-tech rounded-lg p-8 border border-gray-600 mb-8 animate-fadeIn delay-600">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="relative">
                <UserAvatar user={user} size="lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-black animate-hi-tech-pulse"></div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-hi-tech font-mono mb-2">
                      {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                    </h2>
                    <p className="text-green-400 text-lg font-mono">@{user.userName}</p>
                  </div>
                  {currentUser?.id === user.id && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-hi-tech px-6 py-3 font-mono"
                    >
                      {isEditing ? 'CANCEL' : 'EDIT PROFILE'}
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
                      <div className="card-hi-tech rounded-lg p-6 border border-blue-400">
                        <h3 className="font-bold text-blue-400 mb-3 font-mono text-sm tracking-wider">ABOUT</h3>
                        <p className="text-white/80 leading-relaxed font-mono">{user.bio}</p>
                      </div>
                    )}

                    <UserInfoGrid user={user} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Посты пользователя */}
          {postsData?.getUserPosts && (
            <div className="card-hi-tech rounded-lg p-8 border border-gray-600 animate-fadeIn delay-800">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-hi-tech mb-4 font-mono">USER POSTS</h2>
                <div className="w-24 h-1 bg-green-400 mx-auto hi-tech-glow"></div>
              </div>
              
              <div className="space-y-8">
                {postsData.getUserPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-white/60 font-mono text-lg">NO POSTS YET</div>
                    <div className="text-white/40 font-mono text-sm mt-2">USER HASN'T CREATED ANY POSTS</div>
                  </div>
                ) : (
                  postsData.getUserPosts.map((post: Post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}