import { API_CONFIG, UI_CONFIG, THEME_COLORS } from '../../shared/constants';

// Apollo Client configuration
export const apolloConfig = {
  uri: API_CONFIG.GRAPHQL_ENDPOINT,
  credentials: 'include',
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
} as const;

// Theme configuration
export const themeConfig = {
  colors: THEME_COLORS,
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animations: {
    duration: UI_CONFIG.ANIMATION_DURATION,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Validation configuration
export const validationConfig = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Введите корректный email адрес',
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Пароль должен содержать минимум 6 символов',
  },
  username: {
    required: true,
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: 'Имя пользователя должно содержать 3-20 символов (буквы, цифры, _)',
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Имя должно содержать 2-50 символов',
  },
} as const;

// Pagination configuration
export const paginationConfig = {
  defaultLimit: UI_CONFIG.PAGINATION_LIMIT,
  maxLimit: 100,
  commentsPerPage: UI_CONFIG.COMMENTS_PER_PAGE,
} as const;

// File upload configuration
export const uploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxFiles: 10,
} as const;

// Cache configuration
export const cacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
} as const;
