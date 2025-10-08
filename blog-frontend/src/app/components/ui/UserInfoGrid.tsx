import { User } from '../types/user';

interface UserInfoGridProps {
  user: User;
}

export function UserInfoGrid({ user }: UserInfoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card-hi-tech rounded-lg p-6 border border-green-400 hover:border-green-400 transition-all duration-300 group">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center group-hover:bg-green-400/30 transition-colors duration-300">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-green-400 font-mono tracking-wider">EMAIL ADDRESS</div>
            <div className="font-mono text-white/80 text-lg">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="card-hi-tech rounded-lg p-6 border border-blue-400 hover:border-blue-400 transition-all duration-300 group">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center group-hover:bg-blue-400/30 transition-colors duration-300">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm text-blue-400 font-mono tracking-wider">REGISTRATION DATE</div>
            <div className="font-mono text-white/80 text-lg">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}