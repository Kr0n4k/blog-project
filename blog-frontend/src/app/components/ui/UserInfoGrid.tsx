import { User } from '../types/user';

interface UserInfoGridProps {
  user: User;
}

export function UserInfoGrid({ user }: UserInfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <div>
          <div className="text-sm text-muted">Email</div>
          <div className="font-medium text-card-foreground">{user.email}</div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <div>
          <div className="text-sm text-muted">Зарегистрирован</div>
          <div className="font-medium text-card-foreground">
            {new Date(user.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}