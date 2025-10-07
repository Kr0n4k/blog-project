// src/core/redis/redis.service.ts
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeRedis();
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }

  private async initializeRedis(): Promise<void> {
    try {
      const redisUri = this.configService.get<string>('REDIS_URI');
      
      if (redisUri) {
        // Парсим URI вручную для совместимости с ioredis 5.x
        this.redisClient = this.createClientFromUri(redisUri);
      } else {
        // Используем отдельные переменные окружения
        this.redisClient = this.createClientFromConfig();
      }

      await this.setupEventListeners();
      await this.testConnection();
      
    } catch (error) {
      this.logger.error('Failed to initialize Redis client:', error);
      throw error;
    }
  }

  private createClientFromUri(uri: string): Redis {
    try {
      const url = new URL(uri);
      
      const options: any = {
        host: url.hostname,
        port: parseInt(url.port) || 6379,
      };

      // Для ioredis 5.x используем только password
      if (url.password) {
        options.password = url.password;
      }

      // База данных из pathname
      const dbMatch = url.pathname.match(/\/(\d+)/);
      if (dbMatch) {
        options.db = parseInt(dbMatch[1]);
      }

      this.logger.log(`Connecting to Redis at ${options.host}:${options.port}`);
      return new Redis(options);

    } catch (error) {
      this.logger.error('Invalid REDIS_URI, using default configuration');
      return new Redis();
    }
  }

  private createClientFromConfig(): Redis {
    const options: any = {
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: this.configService.get<number>('REDIS_PORT') || 6379,
      db: this.configService.get<number>('REDIS_DB') || 0,
    };

    // Только password для ioredis 5.x
    const password = this.configService.get<string>('REDIS_PASSWORD');
    if (password) {
      options.password = password;
    }

    this.logger.log(`Connecting to Redis at ${options.host}:${options.port}`);
    return new Redis(options);
  }

  private async setupEventListeners(): Promise<void> {
    this.redisClient.on('connect', () => {
      this.logger.log('Redis client connected');
    });

    this.redisClient.on('error', (error) => {
      this.logger.error('Redis client error:', error.message);
    });

    this.redisClient.on('ready', () => {
      this.logger.log('Redis client ready');
    });

    this.redisClient.on('close', () => {
      this.logger.log('Redis client disconnected');
    });
  }

  private async testConnection(): Promise<void> {
    try {
      await this.redisClient.ping();
      this.logger.log('Redis connection test successful');
    } catch (error) {
      this.logger.error('Redis connection test failed:', error);
      throw error;
    }
  }

  // Public methods
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    if (expireInSeconds) {
      await this.redisClient.setex(key, expireInSeconds, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }

  async quit(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }

  async ping(): Promise<string> {
    return this.redisClient.ping();
  }

  get client(): Redis {
    return this.redisClient;
  }
}