import { Post } from '../../types/post';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_POST_MUTATION } from '../../requests/mutations/auth';
import { GET_USER_BY_ID } from '../../requests/queries/getUserById';
import { useAuth } from '../../hooks/useAuth';
import { Comments } from './Comments';
import { UserInfo } from '../ui/UserInfo';
import { UserAvatar } from '../ui/UserAvatar';
import { MediaGallery } from './MediaGallery';
import { PostStats } from './PostStats';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [likePost] = useMutation(LIKE_POST_MUTATION);
  const { user, isAuthenticated } = useAuth();
  
  return (
    <article className="group relative overflow-hidden card-hi-tech rounded-lg shadow-2xl border border-gray-600 hover:border-green-400 transition-all duration-700 hover:-translate-y-4 hover:scale-[1.02] hover:hi-tech-glow">
      {/* Hi-Tech Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Hi-Tech Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <PostHeader post={post} />

        {/* Content */}
        <div className="px-8 pb-6">
          <PostContent post={post} />
        </div>

        {/* Media */}
        {(post.photos?.length > 0 || post.videos?.length > 0) && (
          <div className="px-8 pb-6">
            <MediaGallery photos={post.photos} videos={post.videos} />
          </div>
        )}

        {/* Stats */}
        <div className="px-8 pb-6">
          <PostStats 
            postId={post.id} 
            likes={post.likes || []} 
            comments={post.comments || []}
            currentUser={user}
          />
        </div>

        {/* Comments */}
        <div className="px-8 pb-8">
          <Comments 
            postId={post.id} 
            initialComments={post.comments || []} 
          />
        </div>
      </div>
    </article>
  );
}

// Hi-Tech Post Header Component
function PostHeader({ post }: { post: Post }) {
  const { data: userData, loading: userLoading } = useQuery(GET_USER_BY_ID, {
    variables: { id: post.userId },
    skip: !post.userId
  });
  
  const user = userData?.getUserById;
  const authorName = user ? `${user.firstName} ${user.lastName}` : 'LOADING...';
  const authorUsername = user?.userName || 'loading';
  
  return (
    <div className="flex items-center justify-between p-8 pb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <UserAvatar 
            user={{ 
              id: user?.id || post.userId, 
              firstName: user?.firstName || 'User', 
              lastName: user?.lastName || 'Name', 
              userName: user?.userName || 'username',
              avatar: user?.avatar 
            }} 
            size="lg"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black animate-hi-tech-pulse"></div>
        </div>
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-white text-lg font-mono">{authorName}</h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded border border-green-500/30 font-mono">
              AUTHOR
            </span>
          </div>
          <div className="flex items-center space-x-2 text-white/60 text-sm font-mono">
            <span>@{authorUsername}</span>
            <span>•</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              }).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-3 rounded-lg hover:bg-green-400/10 transition-all duration-300 group border border-gray-600 hover:border-green-400">
          <svg className="w-5 h-5 text-green-400 group-hover:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
        <button className="p-3 rounded-lg hover:bg-blue-400/10 transition-all duration-300 group border border-gray-600 hover:border-blue-400">
          <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Hi-Tech Post Content Component
function PostContent({ post }: { post: Post }) {
  return (
    <div className="space-y-6">
      {post.title && (
        <h2 className="text-2xl font-bold text-hi-tech leading-tight group-hover:text-green-400 transition-colors duration-500 font-mono">
          {post.title.toUpperCase()}
        </h2>
      )}
      
      {post.text && (
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap font-mono">
            {post.text}
          </p>
        </div>
      )}
    </div>
  );
}