export function PostSkeleton() {
  return (
    <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-8 pb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-white/10 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/20 rounded-full border-2 border-white/20"></div>
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-6 bg-white/10 rounded w-32" />
              <div className="h-4 bg-white/10 rounded w-16" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-white/10 rounded w-20" />
              <div className="h-4 bg-white/10 rounded w-1" />
              <div className="h-4 bg-white/10 rounded w-24" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-white/10 rounded-full" />
          <div className="w-10 h-10 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-8 pb-6">
        <div className="space-y-4">
          <div className="h-8 bg-white/10 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-2/3" />
          </div>
        </div>
      </div>

      {/* Media Skeleton */}
      <div className="px-8 pb-6">
        <div className="aspect-video bg-white/10 rounded-2xl" />
      </div>

      {/* Stats Skeleton */}
      <div className="px-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded w-16" />
            </div>
          </div>
          <div className="w-10 h-8 bg-white/10 rounded-lg" />
        </div>
      </div>

      {/* Comments Skeleton */}
      <div className="px-8 pb-8">
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded w-24" />
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-32 mb-1" />
                <div className="h-3 bg-white/10 rounded w-48" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-28 mb-1" />
                <div className="h-3 bg-white/10 rounded w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}