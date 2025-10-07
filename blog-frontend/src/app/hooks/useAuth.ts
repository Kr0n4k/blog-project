// hooks/useAuth.ts
'use client';
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      userName
      email
      firstName
      lastName
      avatar
      bio
      createdAt
      updatedAt
    }
  }
`;

const IS_AUTHENTICATED_QUERY = gql`
  query IsAuthenticated {
    isAuthenticated
  }
`;

interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error?: string;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  // Проверяем авторизацию
  const { 
    data: authData, 
    loading: authLoading, 
    error: authError 
  } = useQuery(IS_AUTHENTICATED_QUERY, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore'
  });

  // Загружаем данные пользователя если авторизован
  const { 
    data: userData, 
    loading: userLoading, 
    error: userError 
  } = useQuery(CURRENT_USER_QUERY, {
    skip: !authData?.isAuthenticated,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore'
  });

  useEffect(() => {
    if (!authLoading && !userLoading) {
      const error = authError?.message || userError?.message;
      
      setAuthState({
        isAuthenticated: authData?.isAuthenticated || false,
        user: userData?.currentUser || null,
        isLoading: false,
        error
      });
    }
  }, [authData, userData, authLoading, userLoading, authError, userError]);

  return authState;
}