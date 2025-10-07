// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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

// Query Types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter Types
export interface PostFilters extends SearchQuery {
  userId?: string;
  hasPhotos?: boolean;
  hasVideos?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface UserFilters extends SearchQuery {
  isActive?: boolean;
  hasPosts?: boolean;
}

// Error Types
export interface AppErrorInterface {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}

// Session Types
export interface SessionData {
  userId: string;
  user: User;
  isAuthenticated: boolean;
}

// GraphQL Context
export interface GraphQLContext {
  req: any;
  res: any;
  user?: User;
  isAuthenticated: boolean;
}

// File Upload Types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Cache Types
export interface CacheOptions {
  ttl?: number;
  key?: string;
  tags?: string[];
}

// Validation Types
export interface ValidationErrorInterface {
  field: string;
  message: string;
  value?: any;
}

// Event Types
export interface DomainEvent {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  userId: string;
  relatedUserId?: string;
  relatedPostId?: string;
  isRead: boolean;
  createdAt: Date;
}