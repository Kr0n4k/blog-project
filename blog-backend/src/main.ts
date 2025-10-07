import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import { ms, StringValue } from './shared/utils/ms.util';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

import { ValidationPipe } from '@nestjs/common';
import { parseBoolean } from './shared/utils/parse-boolean.util';
import Redis from 'ioredis';
import { setupSwagger } from './core/config/swagger.config';

// Импорт для connect-redis v6
import * as connectRedis from 'connect-redis';

import * as express from 'express';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, { rawBody: true });
  const config = app.get(ConfigService);
  const isProduction = process.env.NODE_ENV === 'production';
  // За прокси (нужно для secure-cookie в проде)
  if (isProduction) {
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
  }

  // 1. Cookie parser
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  // 2. Обработка тела запроса
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 2.1 Безопасность и сжатие
  app.use(helmet());
  app.use(compression());

  // 3. Redis клиент для сессий
  const redisClient = new Redis({
    host: config.getOrThrow<string>('REDIS_HOST') || 'localhost',
    port: config.getOrThrow<number>('REDIS_PORT') || 6379,
    password: config.getOrThrow<string>('REDIS_PASSWORD') || undefined,
    db: config.get<number>('REDIS_DB') || 0,
  });

  // 4. RedisStore
  const RedisStore = (connectRedis as any)(session);
  const redisStore = new RedisStore({
    client: redisClient as any,
    prefix: config.getOrThrow<string>('SESSION_FOLDER'),
    ttl: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')) / 1000
  });

  // 5. Session middleware
  const sessionMiddleware = session({
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    cookie: {
      domain: isProduction 
        ? config.getOrThrow<string>('SESSION_DOMAIN') 
        : undefined,
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
      httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax'
    },
    rolling: false,
    proxy: isProduction,
  });

  app.use(sessionMiddleware);

  // 6. CORS - ДОЛЖЕН БЫТЬ ПЕРЕД ГЛОБАЛЬНЫМИ PIPE!
  const allowedOrigins = config.get<string>('ALLOWED_ORIGIN')?.split(',').map(s => s.trim()).filter(Boolean) || [];

  app.enableCors({
    // Разрешаем доступ с любого IP для разработки
    origin: (origin, callback) => {
      // Разрешаем запросы без origin (например, мобильные приложения)
      if (!origin) return callback(null, true);
      
      // Разрешаем localhost и IP адреса
      if (origin.includes('localhost') || 
          origin.includes('127.0.0.1') || 
          origin.includes('192.168.') ||
          origin.includes('10.') ||
          origin.includes('172.')) {
        return callback(null, true);
      }
      
      // В продакшене проверяем разрешенные домены
      if (isProduction && allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Для разработки разрешаем все
      if (!isProduction) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // Разрешаем заголовки, которые шлёт Apollo и браузер при preflight
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'Set-Cookie',
      'apollo-require-preflight',
      'x-apollo-operation-name',
      'apollographql-client-name',
      'apollographql-client-version'
    ]
  });

  // 7. Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  // 8. Swagger документация
  setupSwagger(app);

  // 9. Middleware для отладки (только для разработки)
  if (!isProduction) {
    app.use((req, res, next) => {
      console.log('Session ID:', req.sessionID);
      console.log('Cookies:', req.headers.cookie);
      console.log('Origin:', req.headers.origin);
      next();
    });
  }

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'), '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
}

bootstrap();