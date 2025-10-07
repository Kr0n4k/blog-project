# Backend Structure

## 📁 Project Structure

```
src/
├── core/                    # Core application modules
│   ├── config/             # Configuration files
│   ├── prisma/             # Database module
│   ├── redis/              # Cache module
│   └── graphql/            # GraphQL schema
├── modules/                # Feature modules
│   ├── auth/               # Authentication module
│   ├── comments/           # Comments module
│   ├── posts/              # Posts module
│   └── user/               # User module
├── shared/                 # Shared utilities
│   ├── constants/          # Application constants
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Exception filters
│   ├── guards/             # Auth guards
│   ├── interceptors/       # Request interceptors
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── lib/                    # External libraries
│   ├── config/             # Library configurations
│   ├── database/           # Database utilities
│   └── helpers/            # Helper functions
└── main.ts                 # Application entry point
```

## 🏗️ Architecture

### Core Modules
- **Config**: Application configuration
- **Prisma**: Database ORM and connection
- **Redis**: Caching and session storage
- **GraphQL**: API schema and resolvers

### Feature Modules
Each module follows the same structure:
```
module/
├── inputs/          # GraphQL input types
├── models/          # GraphQL output types
├── module.ts        # Module definition
├── resolver.ts      # GraphQL resolvers
└── service.ts       # Business logic
```

### Shared Utilities
- **Constants**: HTTP status codes, error messages, configuration values
- **Decorators**: Custom decorators for authentication and authorization
- **Filters**: Global exception handling
- **Guards**: Route protection
- **Interceptors**: Request/response transformation
- **Types**: TypeScript type definitions
- **Utils**: Helper functions and utilities

## 🔧 Key Features

### Authentication & Authorization
- Session-based authentication
- Redis session storage
- Role-based access control
- JWT token support (optional)

### Database
- Prisma ORM
- PostgreSQL database
- Connection pooling
- Migration support

### Caching
- Redis integration
- Session storage
- Query result caching
- Rate limiting

### API
- GraphQL API
- RESTful endpoints
- Request validation
- Error handling

## 📝 Best Practices

### Code Organization
1. **Single Responsibility**: Each module has one clear purpose
2. **Dependency Injection**: Use NestJS DI container
3. **Type Safety**: Full TypeScript support
4. **Error Handling**: Consistent error responses
5. **Validation**: Input validation on all endpoints

### Naming Conventions
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Methods**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `HTTP_STATUS`)

### Module Structure
```typescript
// Module definition
@Module({
  imports: [/* dependencies */],
  providers: [/* services */],
  controllers: [/* controllers */],
  exports: [/* public services */],
})
export class UserModule {}
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Setup environment**:
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Setup database**:
   ```bash
   yarn prisma generate
   yarn prisma db push
   ```

4. **Start development server**:
   ```bash
   yarn start:dev
   ```

## 📊 Monitoring & Logging

- **Health checks**: `/health` endpoint
- **Metrics**: Application metrics
- **Logging**: Structured logging with Winston
- **Error tracking**: Global exception handling

## 🔒 Security

- **CORS**: Configured for frontend domains
- **Helmet**: Security headers
- **Rate limiting**: Request rate limiting
- **Input validation**: All inputs validated
- **SQL injection**: Protected by Prisma ORM