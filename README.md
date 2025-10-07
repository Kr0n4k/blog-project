# Blog Platform

Современная блоговая платформа с полным стеком технологий, включающая систему пользователей, постов, комментариев и лайков.

## 🏗 Архитектура проекта

### Общая схема
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • React 18      │    │ • GraphQL API   │    │ • User data     │
│ • Apollo Client │    │ • REST API      │    │ • Posts         │
│ • Tailwind CSS  │    │ • Prisma ORM    │    │ • Comments      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │                 │
                       │ • Sessions      │
                       │ • Caching       │
                       └─────────────────┘
```

## 🚀 Технологический стек

### Backend
- **NestJS** - Прогрессивный Node.js фреймворк с модульной архитектурой
- **GraphQL** - API для эффективной работы с данными и типизации
- **Prisma** - Современная ORM для TypeScript с миграциями
- **PostgreSQL** - Надежная реляционная база данных
- **Redis** - Кэширование и управление сессиями
- **Swagger** - Автоматическая документация API
- **Jest** - Тестирование с покрытием кода

### Frontend
- **Next.js 15** - React фреймворк с App Router и SSR
- **TypeScript** - Строгая типизация для надежности
- **Apollo Client** - GraphQL клиент с кэшированием
- **Tailwind CSS** - Utility-first CSS фреймворк
- **React Hook Form** - Управление формами
- **Zustand** - Управление состоянием

## 📁 Детальная структура проекта

```
blog-platform/
├── 📁 .github/                    # GitHub Actions CI/CD
│   └── workflows/
│       ├── main.yml              # Основной пайплайн
│       ├── backend-ci.yml        # Backend тесты
│       ├── frontend-ci.yml       # Frontend тесты
│       └── deploy.yml            # Деплой
├── 📁 blog-backend/              # NestJS API сервер
│   ├── 📁 src/
│   │   ├── 📁 core/              # Основная конфигурация
│   │   │   ├── 📁 config/        # Конфигурационные файлы
│   │   │   ├── 📁 prisma/        # Prisma сервис и модуль
│   │   │   ├── 📁 redis/         # Redis сервис и модуль
│   │   │   └── core.module.ts    # Основной модуль
│   │   ├── 📁 modules/           # Бизнес-логика
│   │   │   ├── 📁 auth/          # Аутентификация
│   │   │   ├── 📁 user/          # Пользователи
│   │   │   ├── 📁 posts/         # Посты
│   │   │   ├── 📁 comments/      # Комментарии
│   │   │   └── 📁 users/         # REST API пользователей
│   │   ├── 📁 shared/            # Общие компоненты
│   │   │   ├── 📁 decorators/    # Кастомные декораторы
│   │   │   ├── 📁 guards/        # Guards для авторизации
│   │   │   ├── 📁 interceptors/  # Интерцепторы
│   │   │   ├── 📁 filters/       # Exception фильтры
│   │   │   ├── 📁 dto/           # Data Transfer Objects
│   │   │   ├── 📁 types/         # TypeScript типы
│   │   │   └── 📁 utils/         # Утилиты
│   │   ├── 📁 health/            # Health checks
│   │   └── main.ts               # Точка входа
│   ├── 📁 prisma/                # Схема базы данных
│   │   └── schema.prisma         # Prisma схема
│   ├── 📁 test/                  # E2E тесты
│   ├── docker-compose.yml        # Docker конфигурация
│   ├── Dockerfile               # Docker образ
│   └── package.json             # Зависимости backend
├── 📁 blog-frontend/             # Next.js приложение
│   ├── 📁 src/
│   │   ├── 📁 app/              # App Router (Next.js 13+)
│   │   │   ├── 📁 components/   # React компоненты
│   │   │   │   ├── 📁 features/ # Бизнес-компоненты
│   │   │   │   ├── 📁 ui/       # UI компоненты
│   │   │   │   └── 📁 layout/   # Layout компоненты
│   │   │   ├── 📁 hooks/        # Кастомные хуки
│   │   │   ├── 📁 lib/          # Утилиты и конфигурация
│   │   │   ├── 📁 requests/     # GraphQL запросы
│   │   │   ├── 📁 types/        # TypeScript типы
│   │   │   ├── 📁 user/         # Страницы пользователей
│   │   │   ├── layout.tsx       # Корневой layout
│   │   │   └── page.tsx         # Главная страница
│   │   ├── 📁 shared/           # Общие компоненты
│   │   └── 📁 types/            # Общие типы
│   ├── 📁 public/               # Статические файлы
│   ├── next.config.ts           # Next.js конфигурация
│   └── package.json             # Зависимости frontend
├── 📄 README.md                  # Документация проекта
├── 📄 CI_CD_GUIDE.md            # Руководство по CI/CD
├── 📄 QUICK_START.md            # Быстрый старт
└── 📄 .gitignore               # Git исключения
```

## 🔄 Архитектурные паттерны

### Backend (NestJS)
```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Controllers │  │  Resolvers  │  │   Guards    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Business Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Services   │  │  Providers  │  │ Interceptors│     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Data Access Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Prisma    │  │    Redis    │  │   External  │     │
│  │   Service   │  │   Service   │  │    APIs     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Frontend (Next.js)
```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Pages     │  │ Components  │  │   Layouts   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Business Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Hooks    │  │   Context   │  │   Stores    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Apollo      │  │   Requests  │  │   Utils     │     │
│  │  Client     │  │   (GraphQL) │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## 🛠 Установка и запуск

### Предварительные требования
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Yarn или npm

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd blog-platform
```

### 2. Настройка Backend

```bash
cd blog-backend

# Установка зависимостей
yarn install

# Копирование переменных окружения
cp .env.example .env

# Настройка базы данных
yarn prisma generate
yarn prisma db push

# Запуск в режиме разработки
yarn start:dev
```

### 3. Настройка Frontend

```bash
cd blog-frontend

# Установка зависимостей
yarn install

# Копирование переменных окружения
cp .env.example .env.local

# Запуск в режиме разработки
yarn dev
```

### 4. Запуск с Docker

```bash
# Запуск базы данных и Redis
cd blog-backend
docker-compose up -d

# Запуск приложений
yarn start:dev  # Backend
cd ../blog-frontend
yarn dev        # Frontend
```

## 📚 API Документация

После запуска backend сервера, документация API доступна по адресам:

- **Swagger UI**: http://localhost:4000/api/docs
- **GraphQL Playground**: http://localhost:4000/graphql

## 🧩 Модульная архитектура

### Backend модули
```
┌─────────────────────────────────────────────────────────┐
│                    Core Module                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Prisma    │  │    Redis    │  │   Config    │     │
│  │   Module    │  │   Module    │  │   Module    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                  Feature Modules                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Auth     │  │    User      │  │    Post     │     │
│  │   Module    │  │   Module     │  │   Module    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Comment    │  │   Health    │  │   Shared   │     │
│  │   Module    │  │   Module    │  │   Module    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Frontend компоненты
```
┌─────────────────────────────────────────────────────────┐
│                  App Router Structure                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Pages    │  │  Layouts    │  │  Components │     │
│  │             │  │             │  │             │     │
│  │ • /         │  │ • Root      │  │ • Features  │     │
│  │ • /user/[id]│  │ • User      │  │ • UI        │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Основные функции

### Пользователи
- ✅ **Регистрация и аутентификация** - JWT токены + сессии
- ✅ **Управление профилем** - CRUD операции с профилем
- ✅ **Система сессий с Redis** - Масштабируемые сессии
- ✅ **Поиск пользователей** - GraphQL запросы с фильтрацией

### Посты
- ✅ **Создание и редактирование постов** - Rich text editor
- ✅ **Загрузка медиафайлов** - Изображения и видео
- ✅ **Система лайков** - Взаимодействие с контентом
- ✅ **Комментарии** - Вложенные комментарии
- ✅ **Поиск постов** - Полнотекстовый поиск

### Безопасность
- ✅ **Хеширование паролей** - Argon2id алгоритм
- ✅ **Защита от CSRF** - CSRF токены
- ✅ **Валидация данных** - Class-validator
- ✅ **CORS настройки** - Конфигурируемые домены
- ✅ **Rate limiting** - Защита от DDoS
- ✅ **Input sanitization** - XSS защита

## 📊 База данных

### Схема данных
```sql
-- Основные сущности
User {
  id: String @id @default(cuid())
  email: String @unique
  username: String @unique
  password: String
  avatar: String?
  bio: String?
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

Post {
  id: String @id @default(cuid())
  title: String
  content: String
  authorId: String
  author: User @relation(fields: [authorId], references: [id])
  likes: Like[]
  comments: Comment[]
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

Comment {
  id: String @id @default(cuid())
  content: String
  postId: String
  authorId: String
  post: Post @relation(fields: [postId], references: [id])
  author: User @relation(fields: [authorId], references: [id])
  createdAt: DateTime @default(now())
}

Like {
  id: String @id @default(cuid())
  userId: String
  postId: String
  user: User @relation(fields: [userId], references: [id])
  post: Post @relation(fields: [postId], references: [id])
  createdAt: DateTime @default(now())
}
```

## 🔄 API Endpoints

### GraphQL API
```graphql
# Запросы
type Query {
  # Пользователи
  users(search: String, limit: Int, offset: Int): [User!]!
  user(id: ID!): User
  me: User
  
  # Посты
  posts(search: String, limit: Int, offset: Int): [Post!]!
  post(id: ID!): Post
  userPosts(userId: ID!, limit: Int, offset: Int): [Post!]!
}

# Мутации
type Mutation {
  # Аутентификация
  register(input: CreateUserInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  logout: Boolean!
  
  # Пользователи
  updateProfile(input: UpdateProfileInput!): User!
  
  # Посты
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
  
  # Комментарии
  createComment(input: CreateCommentInput!): Comment!
  deleteComment(id: ID!): Boolean!
  
  # Лайки
  likePost(postId: ID!): Like!
  unlikePost(postId: ID!): Boolean!
}
```

### REST API
```
GET    /api/users           # Список пользователей
GET    /api/users/:id       # Пользователь по ID
POST   /api/users           # Создание пользователя
PUT    /api/users/:id       # Обновление пользователя
DELETE /api/users/:id        # Удаление пользователя

GET    /api/posts           # Список постов
GET    /api/posts/:id       # Пост по ID
POST   /api/posts           # Создание поста
PUT    /api/posts/:id       # Обновление поста
DELETE /api/posts/:id       # Удаление поста

GET    /api/health          # Health check
```

## 🧪 Тестирование

```bash
# Backend тесты
cd blog-backend
yarn test              # Unit тесты
yarn test:e2e         # E2E тесты
yarn test:cov         # Покрытие кода

# Frontend тесты
cd blog-frontend
yarn test             # Jest тесты
```

## 🚀 Развертывание

### Production сборка

```bash
# Backend
cd blog-backend
yarn build
yarn start:prod

# Frontend
cd blog-frontend
yarn build
yarn start
```

### Переменные окружения

Создайте `.env` файлы на основе `.env.example` и настройте:

- **DATABASE_URL** - Строка подключения к PostgreSQL
- **REDIS_HOST/PORT** - Настройки Redis
- **SESSION_SECRET** - Секретный ключ для сессий
- **NEXT_PUBLIC_GRAPHQL_ENDPOINT** - URL GraphQL API

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# Основной пайплайн
┌─────────────────────────────────────────────────────────┐
│                    Trigger                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Push      │  │   PR        │  │   Release   │     │
│  │   to main   │  │   Create    │  │   Tag       │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                  Build & Test                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Lint      │  │   Test      │  │   Build     │     │
│  │   Code      │  │   Suite     │  │   Apps      │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                    Deploy                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Docker    │  │   Deploy    │  │   Notify    │     │
│  │   Build     │  │   to Prod   │  │   Team      │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Этапы развертывания
1. **Code Quality** - ESLint, Prettier, TypeScript проверки
2. **Testing** - Unit тесты, E2E тесты, покрытие кода
3. **Build** - Сборка production версий
4. **Docker** - Создание Docker образов
5. **Deploy** - Развертывание на сервере
6. **Health Check** - Проверка работоспособности

## 📈 Мониторинг и логирование

### Система мониторинга
```
┌─────────────────────────────────────────────────────────┐
│                  Monitoring Stack                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Logs      │  │  Metrics    │  │   Alerts    │     │
│  │             │  │             │  │             │     │
│  │ • Winston   │  │ • Prometheus│  │ • Slack     │     │
│  │ • Morgan    │  │ • Grafana   │  │ • Email     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Метрики и логи
- ✅ **Структурированное логирование** - Winston + Morgan
- ✅ **Health checks** - /health endpoint для всех сервисов
- ✅ **Performance metrics** - Время ответа, память, CPU
- ✅ **Error tracking** - Централизованная обработка ошибок
- ✅ **Request tracing** - Отслеживание запросов через систему
- ✅ **Database metrics** - Производительность запросов

### Алерты
- 🚨 **High error rate** - >5% ошибок за 5 минут
- 🚨 **Slow response** - >2 секунд средний ответ
- 🚨 **Database issues** - Проблемы с подключением
- 🚨 **Memory usage** - >80% использования памяти
- 🚨 **Disk space** - <10% свободного места

## ⚡ Производительность

### Оптимизации Backend
- ✅ **Database indexing** - Индексы для быстрых запросов
- ✅ **Query optimization** - Оптимизированные Prisma запросы
- ✅ **Redis caching** - Кэширование часто используемых данных
- ✅ **Connection pooling** - Пул соединений с БД
- ✅ **Compression** - Gzip сжатие ответов
- ✅ **Rate limiting** - Защита от перегрузки

### Оптимизации Frontend
- ✅ **Code splitting** - Ленивая загрузка компонентов
- ✅ **Image optimization** - Оптимизация изображений Next.js
- ✅ **Bundle analysis** - Анализ размера бандла
- ✅ **Apollo caching** - Кэширование GraphQL запросов
- ✅ **SSR/SSG** - Server-side rendering для SEO
- ✅ **CDN** - Content Delivery Network

## 📊 Масштабирование

### Горизонтальное масштабирование
```
┌─────────────────────────────────────────────────────────┐
│                  Load Balancer                          │
│                    (Nginx)                              │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                  Application Servers                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   App 1     │  │   App 2     │  │   App 3     │     │
│  │  (NestJS)   │  │  (NestJS)   │  │  (NestJS)   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────┐
│                  Database Cluster                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ PostgreSQL  │  │ PostgreSQL  │  │ PostgreSQL  │     │
│  │  Primary    │  │  Replica 1  │  │  Replica 2  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Стратегии масштабирования
- **Database sharding** - Разделение данных по шардам
- **Microservices** - Разделение на микросервисы
- **Caching layers** - Многоуровневое кэширование
- **CDN** - Распределение статического контента
- **Auto-scaling** - Автоматическое масштабирование

## 🔒 Безопасность

### Уровни защиты
```
┌─────────────────────────────────────────────────────────┐
│                  Security Layers                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Network   │  │ Application │  │   Database  │     │
│  │             │  │             │  │             │     │
│  │ • Firewall  │  │ • Auth      │  │ • Encryption│     │
│  │ • DDoS      │  │ • Validation│  │ • Access    │     │
│  │ • SSL/TLS   │  │ • CORS      │  │ • Audit     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Меры безопасности
- 🔐 **HTTPS everywhere** - SSL/TLS шифрование
- 🔐 **Password hashing** - Argon2id алгоритм
- 🔐 **JWT tokens** - Безопасная аутентификация
- 🔐 **Input validation** - Валидация всех входных данных
- 🔐 **SQL injection protection** - Prisma ORM защита
- 🔐 **XSS protection** - Санитизация HTML
- 🔐 **CSRF protection** - CSRF токены
- 🔐 **Rate limiting** - Защита от брутфорса

## 🛠 Разработка

### Git Flow
```
main ────────────────────────────────────────────────
  │
  ├── develop ───────────────────────────────────────
  │     │
  │     ├── feature/user-auth ──────────────────────
  │     ├── feature/post-system ────────────────────
  │     └── feature/comment-system ─────────────────
  │
  └── release/v1.0.0 ────────────────────────────────
```

### Code Style
- **ESLint** - Линтинг JavaScript/TypeScript
- **Prettier** - Форматирование кода
- **Husky** - Git hooks для проверок
- **Conventional Commits** - Стандартные коммиты
- **TypeScript strict mode** - Строгая типизация

## 🤝 Участие в разработке

### Процесс разработки
1. **Fork** репозитория
2. **Clone** локально (`git clone <your-fork>`)
3. **Create** feature ветку (`git checkout -b feature/amazing-feature`)
4. **Install** зависимости (`yarn install`)
5. **Make** изменения
6. **Test** код (`yarn test`)
7. **Commit** изменения (`git commit -m 'feat: add amazing feature'`)
8. **Push** в ветку (`git push origin feature/amazing-feature`)
9. **Create** Pull Request

### Требования к PR
- ✅ Все тесты проходят
- ✅ Покрытие кода >80%
- ✅ ESLint проверки пройдены
- ✅ TypeScript без ошибок
- ✅ Обновлена документация
- ✅ Описание изменений

## 📚 Дополнительные ресурсы

### Документация
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)

### Полезные ссылки
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👥 Авторы

- **Kr0n4k** - *Полная разработка* - [GitHub](https://github.com/Kr0n4k)

## 🙏 Благодарности

- **NestJS команде** за отличный фреймворк
- **Next.js команде** за React фреймворк  
- **Prisma команде** за современную ORM
- **Apollo GraphQL** за отличный клиент
- **Tailwind CSS** за utility-first подход
- **Всем контрибьюторам** проекта

---

<div align="center">
  <strong>Сделано с ❤️ для изучения современных веб-технологий</strong>
</div>
