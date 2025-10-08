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
    <div className="min-h-screen bg-black relative overflow-hidden hi-tech-grid">
      {/* Hi-Tech Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 hi-tech-circuit opacity-20"></div>
        
        {/* Scanning Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-hi-tech-scan"></div>
        <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-hi-tech-scan" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-hi-tech-scan" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-hi-tech-scan" style={{animationDelay: '1.5s'}}></div>
        
        {/* Data Streams */}
        <div className="absolute top-10 left-10 w-2 h-20 bg-green-400 opacity-60 animate-hi-tech-pulse"></div>
        <div className="absolute top-20 right-10 w-2 h-16 bg-blue-400 opacity-60 animate-hi-tech-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-24 bg-green-400 opacity-60 animate-hi-tech-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <HeroSection postsCount={posts.length} onCreatePost={handleCreatePost} />
      
      {/* Floating Action Button */}
      <FloatingActionButton onCreatePost={handleCreatePost} />
      
      {/* Create Post Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 modal-hi-tech flex items-center justify-center z-50 p-4">
          <div className="modal-hi-tech-content rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
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
      
      {/* Hi-Tech Posts Section */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-hi-tech mb-4 font-mono">LATEST POSTS</h2>
            <div className="w-24 h-1 bg-green-400 mx-auto hi-tech-glow"></div>
          </div>
          
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

// Hi-Tech Hero Section
function HeroSection({ postsCount, onCreatePost }: { postsCount: number; onCreatePost?: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hi-Tech Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full hi-tech-grid"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Hi-Tech Status Badge */}
          <div className="inline-flex items-center px-6 py-3 card-hi-tech rounded-lg border border-green-400 mb-8 animate-fadeIn">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-hi-tech-pulse hi-tech-glow"></div>
            <span className="text-green-400 font-mono font-medium text-sm tracking-wider">SYSTEM ONLINE</span>
          </div>

          {/* Hi-Tech Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 animate-fadeIn delay-200">
            <span className="text-hi-tech font-mono">
              BLOG
            </span>
            <br />
            <span className="text-hi-tech-accent font-mono">
              PLATFORM
            </span>
          </h1>

          {/* Hi-Tech Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto animate-fadeIn delay-400 font-mono">
            CREATE. SHARE. INSPIRE. JOIN THE DIGITAL COMMUNITY
          </p>
          <p className="text-lg text-white/60 mb-12 animate-fadeIn delay-600 font-mono">
            WHERE EVERY IDEA MATTERS
          </p>

          {/* Hi-Tech Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fadeIn delay-800">
            <div className="card-hi-tech rounded-lg p-6 border border-green-400 hover:border-green-400 transition-all duration-300 group">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300 font-mono">{postsCount}</div>
              <div className="text-white/60 font-mono text-sm tracking-wider">POSTS CREATED</div>
            </div>
            <div className="card-hi-tech rounded-lg p-6 border border-blue-400 hover:border-blue-400 transition-all duration-300 group">
              <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300 font-mono">2.4K</div>
              <div className="text-white/60 font-mono text-sm tracking-wider">ACTIVE USERS</div>
            </div>
            <div className="card-hi-tech rounded-lg p-6 border border-green-400 hover:border-green-400 transition-all duration-300 group">
              <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300 font-mono">15.7K</div>
              <div className="text-white/60 font-mono text-sm tracking-wider">INTERACTIONS</div>
            </div>
          </div>

          {/* Hi-Tech CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeIn delay-1000">
            <button
              onClick={onCreatePost}
              className="btn-hi-tech px-12 py-6 text-lg font-bold rounded-lg transition-all duration-500 hover:scale-105 hover:-translate-y-2 group font-mono"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                CREATE POST
              </span>
            </button>
            
            <button className="btn-hi-tech px-12 py-6 text-lg font-bold rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-300 hover:scale-105 hover:-translate-y-2 group font-mono">
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                LEARN MORE
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Hi-Tech Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-green-400 rounded-full flex justify-center hi-tech-glow">
          <div className="w-1 h-3 bg-green-400 rounded-full mt-2 animate-hi-tech-pulse"></div>
        </div>
      </div>
    </section>
  );
}

// Hi-Tech Floating Action Button
function FloatingActionButton({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <button
      onClick={onCreatePost}
      className="fixed bottom-8 right-8 z-40 w-16 h-16 btn-hi-tech rounded-full shadow-2xl hover:scale-110 hover:-translate-y-2 group md:hidden hi-tech-glow"
    >
      <svg className="w-8 h-8 mx-auto group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

// Hi-Tech Post List Skeleton
function PostListSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="card-hi-tech rounded-lg p-8 border border-gray-600">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hi-Tech Post List Component
function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-32 h-32 mx-auto mb-8 card-hi-tech rounded-full flex items-center justify-center border border-green-400">
          <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-white mb-4 font-mono">NO POSTS FOUND</h3>
        <p className="text-white/60 mb-8 text-lg font-mono">BE THE FIRST TO SHARE YOUR STORY!</p>
        <button className="btn-hi-tech px-8 py-4 text-white font-bold rounded-lg hover:scale-105 hover:-translate-y-1 font-mono">
          CREATE FIRST POST
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