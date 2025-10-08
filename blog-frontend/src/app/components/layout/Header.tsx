// Header.tsx
'use client';
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useMutation } from '@apollo/client';
import { User } from '../../types/user';
import LoginForm from '../ui/forms/LoginForm';
import { LOGOUT_MUTATION } from '../../requests/mutations/auth';
import RegisterForm from '../ui/forms/RegisterForm';
import { SearchModal } from '../features/SearchModal';
import Link from 'next/link';

export default function Header() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      window.location.reload();
    }
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      window.location.reload();
    }
  };

  const handleLoginClick = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  if (isLoading) {
    return (
      <header className="nav-hi-tech border-b border-green-400/30 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-700 h-10 w-10"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 bg-gray-700 rounded w-32"></div>
              <div className="rounded-full bg-gray-700 h-10 w-10"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const getUserInitials = (user: User | null) => {
    if (!user) return 'Ю';
    return `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` || user.userName?.charAt(0) || 'Ю';
  };

  const getUserName = (user: User | null) => {
    if (!user) return 'Юзер';
    return `${user.firstName} ${user.lastName}`.trim() || user.userName || 'Юзер';
  };

  return (
    <>
      <header className="nav-hi-tech border-b border-green-400/30 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between w-full">
            {/* Hi-Tech Логотип и название - левая часть */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 hover:scale-105 group">
                <div className="w-10 h-10 card-hi-tech rounded-lg flex items-center justify-center border border-green-400 group-hover:hi-tech-glow transition-all duration-300">
                  <span className="text-green-400 font-bold text-lg group-hover:scale-110 transition-transform duration-300 font-mono">B</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-hi-tech font-mono">
                    BLOG.PLATFORM
                  </h1>
                  <p className="text-white/80 text-xs font-mono tracking-wider">DIGITAL COMMUNITY</p>
                </div>
              </Link>
            </div>

            {/* Hi-Tech Центральная часть - поиск и навигация */}
            <div className="flex-1 flex items-center justify-center max-w-2xl mx-8">
              {/* Hi-Tech Поисковая строка */}
              <div className="hidden md:flex w-full max-w-md">
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="w-full px-4 py-2 pl-10 input-hi-tech rounded-lg text-white/60 hover:text-white hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all duration-300 text-left flex items-center font-mono"
                >
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>SEARCH POSTS, AUTHORS...</span>
                </button>
              </div>

              {/* Hi-Tech Навигационные кнопки - только на десктопе */}
              <div className="hidden lg:flex items-center space-x-2 ml-4">
                <Link href="/" className="p-2 rounded-lg hover:bg-green-400/10 transition-all duration-300 group relative border border-gray-600 hover:border-green-400">
                  <svg className="w-5 h-5 text-green-400 group-hover:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </Link>
                
                <button className="p-2 rounded-lg hover:bg-blue-400/10 transition-all duration-300 group relative border border-gray-600 hover:border-blue-400">
                  <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-hi-tech-pulse"></span>
                </button>
                
                <button className="p-2 rounded-lg hover:bg-green-400/10 transition-all duration-300 group relative border border-gray-600 hover:border-green-400">
                  <svg className="w-5 h-5 text-green-400 group-hover:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-hi-tech-pulse"></span>
                </button>
              </div>
            </div>

            {/* Hi-Tech Правая часть - пользователь или кнопки входа */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {/* Hi-Tech Уведомления */}
                  <button className="p-2 rounded-lg hover:bg-blue-400/10 transition-all duration-300 group relative md:hidden border border-gray-600 hover:border-blue-400">
                    <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-hi-tech-pulse"></span>
                  </button>

                  {/* Hi-Tech Профиль пользователя */}
                  <div className="relative group">
                    <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-green-400/10 transition-all duration-300 border border-gray-600 hover:border-green-400">
                      <div className="w-8 h-8 card-hi-tech rounded-lg flex items-center justify-center border border-green-400">
                        <span className="text-green-400 font-bold text-sm font-mono">
                          {getUserInitials(user)}
                        </span>
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-white font-medium text-sm font-mono">{getUserName(user)}</div>
                        <div className="text-white/60 text-xs font-mono">@{user.userName || 'user'}</div>
                      </div>
                      <svg className="w-4 h-4 text-green-400 group-hover:text-green-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Hi-Tech Выпадающее меню */}
                    <div className="absolute right-0 mt-2 w-56 modal-hi-tech-content rounded-lg shadow-2xl border border-green-400/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 animate-slideIn">
                      <div className="py-2">
                        <Link href={`/user/${user.id}`} className="flex items-center px-4 py-3 text-white hover:bg-green-400/10 transition-all duration-300 hover:translate-x-2 font-mono">
                          <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          MY PROFILE
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-3 text-white hover:bg-green-400/10 transition-all duration-300 hover:translate-x-2 font-mono">
                          <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          SETTINGS
                        </Link>
                        <div className="border-t border-green-400/30 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all duration-300 hover:translate-x-2 font-mono"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLoginClick}
                    className="px-4 py-2 text-white/90 hover:text-green-400 transition-all duration-300 hover:scale-105 touch-button font-mono"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="btn-hi-tech px-4 py-2 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 touch-button font-mono"
                  >
                    REGISTER
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hi-Tech Модальные окна */}
      {showLoginModal && (
        <div className="fixed inset-0 modal-hi-tech flex items-center justify-center z-50 p-4">
          <div className="modal-hi-tech-content rounded-lg shadow-2xl max-w-md w-full animate-scaleIn">
            <LoginForm onSuccess={handleCloseModal} onCancel={handleCloseModal} onRegisterClick={handleRegisterClick} onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 modal-hi-tech flex items-center justify-center z-50 p-4">
          <div className="modal-hi-tech-content rounded-lg shadow-2xl max-w-md w-full animate-scaleIn">
            <RegisterForm onSuccess={handleCloseModal} onCancel={handleCloseModal} onLoginClick={handleLoginClick} onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)} 
      />
    </>
  );
}