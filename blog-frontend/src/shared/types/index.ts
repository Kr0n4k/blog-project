// Base Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User extends BaseEntity {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  isActive: boolean;
}

// Post Types
export interface Post extends BaseEntity {
  title: string;
  text?: string;
  photos?: string[];
  videos?: string[];
  userId: string;
  user?: User;
  likes?: Like[];
  comments?: Comment[];
  _count?: {
    likes: number;
    comments: number;
  };
}

// Comment Types
export interface Comment extends BaseEntity {
  text: string;
  postId: string;
  userId: string;
  user?: User;
  post?: Post;
}

// Like Types
export interface Like extends BaseEntity {
  postId: string;
  userId: string;
  post?: Post;
  user?: User;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// GraphQL Types
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

// Form Types
export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | undefined;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme Types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Hook Types
export interface UsePaginationReturn {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setLimit: (limit: number) => void;
}

export interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

// Cache Types
export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

// Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// File Types
export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// State Management Types
export interface AppState {
  user: User | null;
  theme: Theme;
  notifications: Notification[];
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  errors: {
    global: AppError | null;
    [key: string]: AppError | null;
  };
}

export interface AppAction {
  type: string;
  payload?: any;
}

// Context Types
export interface AppContextType {
  state: AppState;
  dispatch: (action: AppAction) => void;
}

// Router Types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
}

// SEO Types
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}
