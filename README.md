# Blog Platform

Современная блоговая платформа с полным стеком технологий, включающая систему пользователей, постов, комментариев и лайков.

## 🚀 Технологии

### Backend
- **NestJS** - Прогрессивный Node.js фреймворк
- **GraphQL** - API для эффективной работы с данными
- **Prisma** - Современная ORM для TypeScript
- **PostgreSQL** - Надежная реляционная база данных
- **Redis** - Кэширование и управление сессиями
- **Swagger** - Автоматическая документация API

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - Типизированный JavaScript
- **Apollo Client** - GraphQL клиент
- **Tailwind CSS** - Utility-first CSS фреймворк

## 📁 Структура проекта

```
blog-platform/
├── blog-backend/          # NestJS API сервер
│   ├── src/
│   │   ├── core/          # Основная конфигурация
│   │   ├── modules/       # Бизнес-логика
│   │   └── shared/        # Общие утилиты
│   ├── prisma/           # Схема базы данных
│   └── docker-compose.yml
├── blog-frontend/         # Next.js приложение
│   ├── src/
│   │   ├── app/          # App Router страницы
│   │   ├── components/   # React компоненты
│   │   └── lib/          # Утилиты и конфигурация
│   └── public/           # Статические файлы
└── README.md
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

## 🔧 Основные функции

### Пользователи
- ✅ Регистрация и аутентификация
- ✅ Управление профилем
- ✅ Система сессий с Redis

### Посты
- ✅ Создание и редактирование постов
- ✅ Загрузка медиафайлов
- ✅ Система лайков
- ✅ Комментарии

### Безопасность
- ✅ Хеширование паролей (Argon2)
- ✅ Защита от CSRF
- ✅ Валидация данных
- ✅ CORS настройки

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

## 📈 Мониторинг и логирование

- Логирование запросов и ошибок
- Health checks для сервисов
- Метрики производительности

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 👥 Авторы

- **Ваше имя** - *Начальная разработка* - [GitHub](https://github.com/yourusername)

## 🙏 Благодарности

- NestJS команде за отличный фреймворк
- Next.js команде за React фреймворк
- Prisma команде за современную ORM
- Всем контрибьюторам проекта
