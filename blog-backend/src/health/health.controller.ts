import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../core/prisma/prisma.service';
import { RedisService } from '../core/redis/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check',
    description: 'Проверка состояния сервиса и подключений к БД'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Сервис работает нормально',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00Z' },
        uptime: { type: 'number', example: 12345 },
        database: { type: 'string', example: 'connected' },
        redis: { type: 'string', example: 'connected' },
        version: { type: 'string', example: '1.0.0' }
      }
    }
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Сервис недоступен' 
  })
  async check() {
    const startTime = Date.now();
    
    try {
      // Проверка подключения к базе данных
      await this.prismaService.$queryRaw`SELECT 1`;
      const databaseStatus = 'connected';
      
      // Проверка подключения к Redis
      await this.redisService.ping();
      const redisStatus = 'connected';
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: databaseStatus,
        redis: redisStatus,
        version: process.env.npm_package_version || '1.0.0',
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'disconnected',
        redis: 'disconnected',
        error: error.message,
        responseTime: Date.now() - startTime,
      };
    }
  }

  @Get('ready')
  @ApiOperation({ 
    summary: 'Readiness check',
    description: 'Проверка готовности сервиса к обработке запросов'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Сервис готов к работе' 
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Сервис не готов' 
  })
  async ready() {
    try {
      // Проверяем все критические зависимости
      await this.prismaService.$queryRaw`SELECT 1`;
      await this.redisService.ping();
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Service not ready: ${error.message}`);
    }
  }

  @Get('live')
  @ApiOperation({ 
    summary: 'Liveness check',
    description: 'Проверка жизнеспособности сервиса'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Сервис жив' 
  })
  async live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
