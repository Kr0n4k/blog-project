import { useState, useEffect } from 'react';

interface RealtimeNotificationProps {
  message: string;
  type: 'like' | 'comment';
  duration?: number;
}

export function RealtimeNotification({ message, type, duration = 3000 }: RealtimeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`card-hi-tech rounded-lg p-4 border ${
        type === 'like' ? 'border-green-400' : 'border-blue-400'
      } shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full animate-hi-tech-pulse ${
            type === 'like' ? 'bg-green-400' : 'bg-blue-400'
          }`}></div>
          <span className="text-white font-mono text-sm">{message}</span>
        </div>
      </div>
    </div>
  );
}
