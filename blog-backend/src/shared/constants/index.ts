// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Неверные учетные данные',
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_ALREADY_EXISTS: 'Пользователь уже существует',
  SESSION_EXPIRED: 'Сессия истекла',
  UNAUTHORIZED: 'Необходима авторизация',
  
  // Posts
  POST_NOT_FOUND: 'Пост не найден',
  POST_ALREADY_LIKED: 'Пост уже лайкнут',
  POST_NOT_LIKED: 'Пост не лайкнут',
  
  // Comments
  COMMENT_NOT_FOUND: 'Комментарий не найден',
  COMMENT_NOT_OWNER: 'Недостаточно прав для редактирования комментария',
  
  // Validation
  INVALID_EMAIL: 'Неверный формат email',
  INVALID_PASSWORD: 'Пароль должен содержать минимум 8 символов',
  REQUIRED_FIELD: 'Поле обязательно для заполнения',
  
  // General
  INTERNAL_ERROR: 'Внутренняя ошибка сервера',
  VALIDATION_ERROR: 'Ошибка валидации',
  NETWORK_ERROR: 'Ошибка сети',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Пользователь успешно создан',
  USER_UPDATED: 'Профиль обновлен',
  POST_CREATED: 'Пост создан',
  POST_LIKED: 'Пост лайкнут',
  POST_UNLIKED: 'Лайк убран',
  COMMENT_CREATED: 'Комментарий добавлен',
  COMMENT_UPDATED: 'Комментарий обновлен',
  COMMENT_DELETED: 'Комментарий удален',
  LOGOUT_SUCCESS: 'Выход выполнен',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER: 'user',
  POST: 'post',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
} as const;

// Rate Limiting
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  LOGIN_MAX_REQUESTS: 5,
} as const;