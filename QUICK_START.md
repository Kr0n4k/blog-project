# 🚀 Быстрый старт

## Предварительные требования
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Yarn

## 1. Настройка базы данных

```bash
# Запуск PostgreSQL и Redis через Docker
cd blog-backend
docker-compose up -d

# Или установите PostgreSQL и Redis локально
```

## 2. Настройка Backend

```bash
cd blog-backend

# Установка зависимостей
yarn install

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env файл с вашими настройками

# Настройка базы данных
yarn prisma generate
yarn prisma db push

# Запуск в режиме разработки
yarn start:dev
```

## 3. Настройка Frontend

```bash
cd blog-frontend

# Установка зависимостей
yarn install

# Настройка переменных окружения
cp .env.example .env.local
# Отредактируйте .env.local файл

# Запуск в режиме разработки
yarn dev
```

## 4. Проверка работы

- **Backend API**: http://localhost:4000
- **Swagger документация**: http://localhost:4000/api/docs
- **GraphQL Playground**: http://localhost:4000/graphql
- **Frontend**: http://localhost:3000

## 📚 API Endpoints

### Пользователи
- `POST /api/users/register` - Регистрация
- `POST /api/users/login` - Вход
- `GET /api/users/me` - Текущий пользователь
- `PUT /api/users/me` - Обновление профиля
- `GET /api/users/:id` - Пользователь по ID

### Посты
- `GET /api/posts` - Список постов
- `GET /api/posts/random` - Случайные посты
- `GET /api/posts/:id` - Пост по ID
- `POST /api/posts` - Создание поста
- `PUT /api/posts/:id` - Обновление поста
- `DELETE /api/posts/:id` - Удаление поста

### Комментарии
- `GET /api/comments/post/:postId` - Комментарии к посту
- `POST /api/comments` - Создание комментария
- `PUT /api/comments/:id` - Обновление комментария
- `DELETE /api/comments/:id` - Удаление комментария

## 🔧 Переменные окружения

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD="your_redis_password"
SESSION_SECRET="your_session_secret"
COOKIES_SECRET="your_cookies_secret"
APPLICATION_PORT=4000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:4000/graphql"
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## 🐛 Решение проблем

### Ошибка подключения к базе данных
- Проверьте, что PostgreSQL запущен
- Убедитесь, что DATABASE_URL корректный
- Выполните `yarn prisma db push`

### Ошибка подключения к Redis
- Проверьте, что Redis запущен
- Убедитесь, что REDIS_HOST и REDIS_PORT корректные

### CORS ошибки
- Проверьте настройки ALLOWED_ORIGIN в .env
- Убедитесь, что фронтенд запущен на правильном порту

## 📖 Дополнительная документация

- [Полная документация](README.md)
- [API документация](http://localhost:4000/api/docs)
- [GraphQL схема](http://localhost:4000/graphql)
