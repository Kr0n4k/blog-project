// Base types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// User types
export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
}

export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

// Post types
export interface Post extends BaseEntity {
  title: string;
  text?: string | null;
  userId: string;
  photos: string[];
  videos: string[];
  user?: Pick<User, 'userName' | 'firstName' | 'lastName' | 'avatar'>;
  comments?: Comment[];
  likes?: Like[];
}

export interface CreatePostInput {
  title: string;
  text?: string;
  photos?: string[];
  videos?: string[];
}

// Comment types
export interface Comment extends BaseEntity {
  text: string;
  userId: string;
  postId: string;
  user?: Pick<User, 'userName' | 'firstName' | 'lastName' | 'avatar'>;
}

export interface CreateCommentInput {
  text: string;
  postId: string;
}

// Like types
export interface Like extends BaseEntity {
  userId: string;
  postId: string;
}

// Auth types
export interface LoginInput {
  login: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

// UI types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Theme types
export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    card: string;
    success: string;
    danger: string;
    warning: string;
  };
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  badge?: number;
  children?: NavItem[];
}

// Search types
export interface SearchFilters {
  query?: string;
  type?: 'posts' | 'users' | 'all';
  dateRange?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: SearchFilters;
}

// Notification types
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  relatedId?: string;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
  };
  privacy: {
    showEmail: boolean;
    showPosts: boolean;
    allowMessages: boolean;
  };
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// Hook types
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UsePaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  reset: () => void;
}
