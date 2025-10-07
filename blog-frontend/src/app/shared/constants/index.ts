// API Configuration
export const API_CONFIG = {
  GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3001/graphql',
  TIMEOUT: 10000,
} as const;

// UI Constants
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  PAGINATION_LIMIT: 10,
  COMMENTS_PER_PAGE: 5,
} as const;

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#f1f5f9',
  SUCCESS: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  ACCENT: '#f59e0b',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  THEME: 'blog-theme',
  LANGUAGE: 'blog-language',
  USER_PREFERENCES: 'blog-user-preferences',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  AUTH_ERROR: 'Ошибка авторизации. Войдите в систему заново.',
  VALIDATION_ERROR: 'Проверьте правильность заполнения полей.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Добро пожаловать!',
  REGISTER_SUCCESS: 'Регистрация прошла успешно!',
  POST_CREATED: 'Пост успешно создан!',
  POST_LIKED: 'Пост добавлен в избранное!',
  COMMENT_ADDED: 'Комментарий добавлен!',
  PROFILE_UPDATED: 'Профиль обновлен!',
} as const;
