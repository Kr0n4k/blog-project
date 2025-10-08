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
    <div className="fixed inset-0 modal-hi-tech flex items-center justify-center z-50 p-4">
      <div className="modal-hi-tech-content rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] animate-scaleIn">
        {/* Hi-Tech Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-400/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-hi-tech-pulse hi-tech-glow"></div>
            <h2 className="text-2xl font-bold text-hi-tech font-mono tracking-wider">SEARCH SYSTEM</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-red-400 hover:text-red-300 text-2xl font-light transition-all duration-300 hover:scale-110 hover:rotate-90 font-mono"
            title="CLOSE SEARCH"
          >
            ×
          </button>
        </div>

        {/* Hi-Tech Search Input */}
        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ENTER SEARCH QUERY..."
              className="w-full pl-12 pr-4 py-4 input-hi-tech rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 font-mono"
              autoFocus
            />
          </div>
        </div>

        {/* Hi-Tech Tabs */}
        <div className="px-6">
          <div className="flex space-x-1 card-hi-tech rounded-lg p-1 border border-gray-600">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 px-6 rounded-lg font-mono font-medium transition-all duration-300 ${
                activeTab === 'posts'
                  ? 'bg-green-400 text-black shadow-lg hi-tech-glow'
                  : 'text-white/60 hover:text-white hover:bg-green-400/10 hover:border-green-400/50'
              }`}
            >
              POSTS
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 px-6 rounded-lg font-mono font-medium transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-blue-400 text-black shadow-lg hi-tech-glow'
                  : 'text-white/60 hover:text-white hover:bg-blue-400/10 hover:border-blue-400/50'
              }`}
            >
              USERS
            </button>
          </div>
        </div>

        {/* Hi-Tech Results */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {!debouncedQuery ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 card-hi-tech rounded-full flex items-center justify-center mx-auto mb-4 border border-green-400/30">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-white/60 text-lg font-mono">ENTER SEARCH QUERY TO BEGIN</p>
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
                  <div key={post.id} className="card-hi-tech rounded-lg p-4 border border-gray-600 hover:border-green-400/50 hover:hi-tech-glow transition-all duration-300">
                    <PostCard post={post} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 card-hi-tech rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/30">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-white/60 font-mono">NO POSTS FOUND</p>
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
                    className="flex items-center space-x-4 p-4 card-hi-tech rounded-lg border border-gray-600 hover:border-blue-400/50 hover:hi-tech-glow transition-all duration-300 group"
                  >
                    <UserAvatar user={user} size="lg" linkToProfile={false} />
                    <div className="flex-1">
                      <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors duration-300 font-mono">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-white/60 text-sm font-mono">@{user.userName}</p>
                      {user.bio && (
                        <p className="text-white/40 text-sm mt-1 line-clamp-2 font-mono">{user.bio}</p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-white/40 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 card-hi-tech rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/30">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-white/60 font-mono">NO USERS FOUND</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
