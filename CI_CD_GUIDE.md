# 🚀 CI/CD Руководство

## 📋 Обзор

Проект настроен с полным CI/CD пайплайном, включающим:
- ✅ Автоматическое тестирование
- ✅ Линтинг и форматирование кода
- ✅ Проверки безопасности
- ✅ Сборка и развертывание
- ✅ Мониторинг производительности

## 🔧 Настройка

### 1. GitHub Secrets

Добавьте следующие секреты в настройках репозитория:

#### Общие секреты
```bash
SNYK_TOKEN=your_snyk_token
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password
```

#### Frontend секреты
```bash
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.yourdomain.com/graphql
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

#### Backend секреты (для развертывания)
```bash
SERVER_HOST=your_server_ip
SERVER_USERNAME=your_server_username
SERVER_SSH_KEY=your_private_ssh_key
```

### 2. Локальная настройка

#### Установка зависимостей для тестирования
```bash
# Backend
cd blog-backend
yarn install
yarn prisma generate

# Frontend
cd blog-frontend
yarn install
```

## 🧪 Тестирование

### Unit тесты
```bash
# Backend
cd blog-backend
yarn test
yarn test:cov

# Frontend
cd blog-frontend
yarn test
```

### E2E тесты
```bash
# Backend
cd blog-backend
yarn test:e2e
```

### Линтинг
```bash
# Backend
cd blog-backend
yarn lint
yarn format

# Frontend
cd blog-frontend
yarn lint
```

## 🔄 CI/CD Пайплайны

### 1. Main Pipeline (`.github/workflows/main.yml`)
- **Триггер**: Push/PR в main/develop
- **Функции**:
  - Детекция изменений
  - Запуск соответствующих пайплайнов
  - Интеграционные тесты
  - Уведомления о результатах

### 2. Backend Pipeline (`.github/workflows/backend-ci.yml`)
- **Триггер**: Изменения в `blog-backend/`
- **Этапы**:
  - ✅ Установка зависимостей
  - ✅ Генерация Prisma клиента
  - ✅ Миграции БД
  - ✅ Линтинг
  - ✅ Сборка
  - ✅ Unit тесты
  - ✅ E2E тесты
  - ✅ Проверки безопасности
  - ✅ Сборка Docker образа

### 3. Frontend Pipeline (`.github/workflows/frontend-ci.yml`)
- **Триггер**: Изменения в `blog-frontend/`
- **Этапы**:
  - ✅ Установка зависимостей
  - ✅ Линтинг
  - ✅ Сборка
  - ✅ Тесты
  - ✅ Проверки безопасности
  - ✅ Lighthouse аудит
  - ✅ Развертывание на Vercel

### 4. Deploy Pipeline (`.github/workflows/deploy.yml`)
- **Триггер**: Push в main
- **Этапы**:
  - ✅ Развертывание backend
  - ✅ Развертывание frontend
  - ✅ Уведомления

## 🐳 Docker

### Backend
```bash
# Сборка образа
docker build -t blog-backend ./blog-backend

# Запуск контейнера
docker run -p 4000:4000 blog-backend
```

### Frontend
```bash
# Сборка образа
docker build -t blog-frontend ./blog-frontend

# Запуск контейнера
docker run -p 3000:3000 blog-frontend
```

## 📊 Мониторинг

### Health Checks
- **Backend**: `http://localhost:4000/health`
- **Readiness**: `http://localhost:4000/health/ready`
- **Liveness**: `http://localhost:4000/health/live`

### Метрики
- Покрытие кода (Codecov)
- Производительность (Lighthouse)
- Безопасность (Snyk)
- Качество кода (ESLint)

## 🚀 Развертывание

### Автоматическое развертывание
1. Push в ветку `main`
2. Пайплайн автоматически:
   - Запускает тесты
   - Собирает приложения
   - Развертывает на сервер

### Ручное развертывание
```bash
# Backend
cd blog-backend
yarn build
pm2 start ecosystem.config.js

# Frontend
cd blog-frontend
yarn build
pm2 start ecosystem.config.js
```

## 🔍 Отладка

### Логи
```bash
# PM2 логи
pm2 logs blog-backend
pm2 logs blog-frontend

# Docker логи
docker logs blog-backend
docker logs blog-frontend
```

### Статус сервисов
```bash
# PM2 статус
pm2 status

# Docker статус
docker ps
```

## 📈 Оптимизация

### Производительность
- Кластерный режим PM2
- Кэширование зависимостей
- Параллельные тесты
- Оптимизированные Docker образы

### Безопасность
- Регулярные аудиты зависимостей
- Сканирование уязвимостей
- Проверка секретов
- Изоляция окружений

## 🛠 Устранение неполадок

### Частые проблемы

#### 1. Тесты не проходят
```bash
# Очистка кэша
yarn cache clean

# Переустановка зависимостей
rm -rf node_modules yarn.lock
yarn install
```

#### 2. Проблемы с БД
```bash
# Сброс БД
yarn prisma db push --force-reset

# Генерация клиента
yarn prisma generate
```

#### 3. Проблемы с Docker
```bash
# Очистка Docker
docker system prune -a

# Пересборка образов
docker build --no-cache -t blog-backend ./blog-backend
```

## 📚 Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Snyk Documentation](https://docs.snyk.io/)
