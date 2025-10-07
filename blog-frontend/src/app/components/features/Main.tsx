'use client';

import { useQuery } from '@apollo/client';
import { GET_RANDOM_POSTS } from '../../requests/queries/getRandomPosts';
import { GetRandomPostsData, Post } from '../../types/post';
import { PostCard } from './PostCard';
import { PostSkeleton } from './PostSkeleton';
import { ErrorMessage } from '../ui/ErrorMessage';
import { CreatePostForm } from './CreatePostForm';
import { useAuth } from '../../hooks/useAuth';
import { Notification } from '../ui/Notification';
import { useState } from 'react';

export function Main() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
  const { isAuthenticated } = useAuth();
  const { loading, error, data } = useQuery<GetRandomPostsData>(GET_RANDOM_POSTS);
  const posts = data?.getRandomPosts || [];

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      setNotification({
        message: 'Для создания поста необходимо войти в систему',
        type: 'warning'
      });
      return;
    }
    setShowCreateForm(true);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <HeroSection postsCount={posts.length} onCreatePost={handleCreatePost} />
      
      {/* Floating Action Button */}
      <FloatingActionButton onCreatePost={handleCreatePost} />
      
      {/* Create Post Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-scaleIn">
            <CreatePostForm 
              onSuccess={() => setShowCreateForm(false)} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      {/* Posts Section */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <PostListSkeleton />
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      </div>
    </div>
  );
}

// Premium Hero Section
function HeroSection({ postsCount, onCreatePost }: { postsCount: number; onCreatePost?: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fadeIn">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white/90 font-medium">Платформа активна</span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 animate-fadeIn delay-200">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Блог
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Платформа
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto animate-fadeIn delay-400">
            Создавайте, делитесь и вдохновляйте. Присоединяйтесь к сообществу творческих людей
          </p>
          <p className="text-lg text-white/60 mb-12 animate-fadeIn delay-600">
            Где каждая идея имеет значение
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fadeIn delay-800">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">{postsCount}</div>
              <div className="text-white/60">Постов создано</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">2.4K</div>
              <div className="text-white/60">Активных авторов</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">15.7K</div>
              <div className="text-white/60">Взаимодействий</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeIn delay-1000">
            <button
              onClick={onCreatePost}
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Создать пост
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
            
            <button className="px-12 py-6 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group">
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Узнать больше
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

// Premium Floating Action Button
function FloatingActionButton({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <button
      onClick={onCreatePost}
      className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 hover:-translate-y-2 group md:hidden"
    >
      <svg className="w-8 h-8 mx-auto group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

// Premium Post List Skeleton
function PostListSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-white/10 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-white/10 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Premium Post List Component
function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
          <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Пока нет постов</h3>
        <p className="text-white/60 mb-8 text-lg">Станьте первым, кто поделится своей историей!</p>
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
          Создать первый пост
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <div 
          key={post.id} 
          className="animate-fadeIn"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}