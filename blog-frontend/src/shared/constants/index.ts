// API Configuration
export const API_CONFIG = {
  GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Application Constants
export const APP_CONFIG = {
  NAME: 'БлогПлатформа',
  DESCRIPTION: 'Сообщество авторов и читателей',
  VERSION: '1.0.0',
  AUTHOR: 'Blog Platform Team',
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  INFINITE_SCROLL_THRESHOLD: 100,
  MODAL_Z_INDEX: 50,
  TOAST_DURATION: 5000,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  INFINITE_SCROLL_PAGE_SIZE: 20,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  MAX_FILES: 10,
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 500,
  MAX_POST_TITLE_LENGTH: 200,
  MAX_POST_TEXT_LENGTH: 5000,
  MAX_COMMENT_LENGTH: 1000,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER: 'user',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  SEARCH: 'search',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  USER_PREFERENCES: 'userPreferences',
  RECENT_SEARCHES: 'recentSearches',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  VALIDATION_ERROR: 'Ошибка валидации данных.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещен.',
  NOT_FOUND: 'Ресурс не найден.',
  CONFLICT: 'Конфликт данных.',
  TIMEOUT: 'Превышено время ожидания.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Пост успешно создан',
  POST_UPDATED: 'Пост обновлен',
  POST_DELETED: 'Пост удален',
  COMMENT_ADDED: 'Комментарий добавлен',
  COMMENT_UPDATED: 'Комментарий обновлен',
  COMMENT_DELETED: 'Комментарий удален',
  PROFILE_UPDATED: 'Профиль обновлен',
  LOGIN_SUCCESS: 'Вход выполнен',
  LOGOUT_SUCCESS: 'Выход выполнен',
  REGISTRATION_SUCCESS: 'Регистрация успешна',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1536,
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#8b5cf6',
  SECONDARY: '#ec4899',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const;

// Social Links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com',
  TWITTER: 'https://twitter.com',
  LINKEDIN: 'https://linkedin.com',
  DISCORD: 'https://discord.gg',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  DARK_MODE: true,
  INFINITE_SCROLL: true,
  REAL_TIME_NOTIFICATIONS: false,
  FILE_UPLOAD: true,
  SEARCH_SUGGESTIONS: true,
  ANALYTICS: false,
} as const;
