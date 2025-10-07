# Blog Frontend Structure

## 📁 Project Structure

```
src/app/
├── components/           # React components
│   ├── features/        # Feature-specific components
│   │   ├── Comments.tsx
│   │   ├── CreatePostForm.tsx
│   │   ├── Main.tsx
│   │   ├── MediaGallery.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostSkeleton.tsx
│   │   ├── PostStats.tsx
│   │   ├── ProfileEditForm.tsx
│   │   └── UserProfile.tsx
│   ├── layout/          # Layout components
│   │   └── Header.tsx
│   ├── ui/             # Reusable UI components
│   │   ├── forms/      # Form components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── ClientApolloProvider.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── UserInfo.tsx
│   │   └── UserInfoGrid.tsx
│   └── index.ts        # Component exports
├── hooks/              # Custom React hooks
│   ├── useAsync.ts
│   ├── useAuth.ts
│   ├── useForm.ts
│   ├── useLocalStorage.ts
│   ├── usePagination.ts
│   └── index.ts
├── lib/                # Library code
│   ├── config/         # Configuration
│   │   └── index.ts
│   ├── helpers/        # Helper functions
│   │   └── index.ts
│   ├── apollo-client.ts
│   └── index.ts
├── shared/             # Shared utilities and types
│   ├── constants/      # Application constants
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── index.ts
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   └── index.ts
├── requests/           # GraphQL requests
│   ├── mutations/      # GraphQL mutations
│   │   └── auth.ts
│   └── queries/        # GraphQL queries
│       ├── getRandomPosts.ts
│       ├── getUserByID.ts
│       └── getUserPosts.ts
├── types/             # Legacy types (to be migrated)
│   ├── post.ts
│   └── user.ts
├── user/              # User-specific pages
│   └── [id]/
│       └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

## 🎯 Component Organization

### Features (`components/features/`)
Feature-specific components that contain business logic:
- **PostCard** - Display individual posts
- **Comments** - Comment system
- **UserProfile** - User profile pages
- **CreatePostForm** - Post creation
- **MediaGallery** - Media display

### Layout (`components/layout/`)
Layout components that define page structure:
- **Header** - Navigation and user menu

### UI (`components/ui/`)
Reusable UI components without business logic:
- **Forms** - Login/Register forms
- **LoadingSpinner** - Loading indicators
- **ErrorMessage** - Error display
- **UserAvatar** - User avatar display

## 🔧 Shared Utilities

### Constants (`shared/constants/`)
- API configuration
- UI constants
- Theme colors
- Error messages

### Utils (`shared/utils/`)
- Date formatting
- String utilities
- Validation helpers
- Array/object utilities
- Storage helpers

### Types (`shared/types/`)
- Base entity types
- User/Post/Comment types
- API response types
- Form state types
- UI component props

## 🎣 Custom Hooks

### useAsync
Handles async operations with loading/error states

### useForm
Form state management with validation

### usePagination
Pagination logic for lists

### useLocalStorage
Local storage with React state sync

### useAuth
Authentication state management

## 📚 Library Code

### Config (`lib/config/`)
- Apollo Client configuration
- Theme configuration
- Validation rules
- Upload settings

### Helpers (`lib/helpers/`)
- Form validation
- Error handling
- Performance utilities
- URL helpers
- Type guards

## 🚀 Usage Examples

### Importing Components
```typescript
import { PostCard, Header, LoadingSpinner } from '@/app/components';
```

### Using Hooks
```typescript
import { useForm, useAsync, usePagination } from '@/app/hooks';
```

### Using Utilities
```typescript
import { formatDate, validateEmail, debounce } from '@/app/shared';
```

### Using Configuration
```typescript
import { apolloConfig, themeConfig } from '@/app/lib';
```

## 📝 Best Practices

1. **Component Organization**: Group by feature, not by type
2. **Shared Code**: Put reusable utilities in `shared/`
3. **Type Safety**: Use TypeScript types from `shared/types/`
4. **Constants**: Define all constants in `shared/constants/`
5. **Hooks**: Create custom hooks for reusable logic
6. **Imports**: Use barrel exports for clean imports
