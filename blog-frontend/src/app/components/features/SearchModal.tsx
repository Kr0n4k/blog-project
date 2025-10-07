'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RANDOM_POSTS } from '../../requests/queries/getRandomPosts';
import { GET_ALL_USERS } from '../../requests/queries/getAllUsers';
import { PostCard } from './PostCard';
import { UserAvatar } from '../ui/UserAvatar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Get all posts for search
  const { data: postsData, loading: postsLoading, error: postsError } = useQuery(GET_RANDOM_POSTS, {
    skip: !isOpen
  });

  // For now, we'll use mock users until the backend schema updates
  const mockUsers = [
    {
      id: 'user1',
      userName: 'babijon',
      firstName: 'Галина',
      lastName: 'Бабиджоновна',
      avatar: null,
      bio: 'Автор блога',
      createdAt: new Date().toISOString()
    }
  ];

  const handleClose = () => {
    setQuery('');
    setDebouncedQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] border border-white/20 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Поиск</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <svg className="w-6 h-6 text-white/60 hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск постов и пользователей..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              autoFocus
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex space-x-1 bg-white/5 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Посты
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Пользователи
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {!debouncedQuery ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-white/60 text-lg">Введите запрос для поиска</p>
            </div>
          ) : activeTab === 'posts' ? (
            <div className="space-y-4">
              {postsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : postsError ? (
                <ErrorMessage message={postsError.message} />
              ) : postsData?.getRandomPosts?.filter((post: any) => 
                post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                (post.text && post.text.toLowerCase().includes(debouncedQuery.toLowerCase()))
              ).length ? (
                postsData.getRandomPosts.filter((post: any) => 
                  post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                  (post.text && post.text.toLowerCase().includes(debouncedQuery.toLowerCase()))
                ).map((post: any) => (
                  <div key={post.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <PostCard post={post} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">Посты не найдены</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {mockUsers.filter((user: any) => 
                user.userName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                user.firstName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                (user.bio && user.bio.toLowerCase().includes(debouncedQuery.toLowerCase()))
              ).length ? (
                mockUsers.filter((user: any) => 
                  user.userName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                  user.firstName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                  user.lastName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                  (user.bio && user.bio.toLowerCase().includes(debouncedQuery.toLowerCase()))
                ).map((user: any) => (
                  <Link
                    key={user.id}
                    href={`/user/${user.id}`}
                    onClick={handleClose}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <UserAvatar user={user} size="lg" linkToProfile={false} />
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-white/60 text-sm">@{user.userName}</p>
                      {user.bio && (
                        <p className="text-white/40 text-sm mt-1 line-clamp-2">{user.bio}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">Пользователи не найдены</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
