'use client';

import { useQuery } from '@apollo/client';
import { getUserByID } from '../../requests/queries/getUserByID';
import { UserData } from '../../types/user';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface UserInfoProps {
  userId: string;
}

export function UserInfo({ userId }: UserInfoProps) {
  const { loading, error, data } = useQuery<UserData>(getUserByID, {
    variables: { id: userId }
  });

  if (loading) return (
    <span className="inline-flex items-center space-x-2 text-muted">
      <LoadingSpinner size="sm" />
      <span>Загрузка...</span>
    </span>
  );
  
  if (error) return (
    <span className="text-red-500">Ошибка загрузки</span>
  );

  const user = data?.findUserByID;

  return (
    <span className="font-medium text-card-foreground">
      {user ? `${user.firstName} ${user.lastName} (@${user.userName})` : 'Неизвестный пользователь'}
    </span>
  );
}