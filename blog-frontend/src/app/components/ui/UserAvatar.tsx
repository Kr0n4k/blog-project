import Link from 'next/link';

interface UserAvatarProps {
  user: {
    avatar?: string | null;
    firstName?: string;
    lastName?: string;
    userName?: string;
    id?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  linkToProfile?: boolean;
}

export function UserAvatar({ user, size = 'md', linkToProfile = true }: UserAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg'
  };

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` || 
                   user.userName?.[0]?.toUpperCase() || '?';

  const avatarElement = (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0 hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      {user.avatar ? (
        <img 
          src={user.avatar} 
          alt="Avatar" 
          className="w-full h-full rounded-full object-cover" 
        />
      ) : (
        <span className="font-bold text-white">
          {initials}
        </span>
      )}
    </div>
  );

  if (linkToProfile && user.id) {
    return (
      <Link href={`/user/${user.id}`} className="inline-block">
        {avatarElement}
      </Link>
    );
  }

  return avatarElement;
}