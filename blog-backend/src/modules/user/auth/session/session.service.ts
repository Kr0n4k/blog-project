import { PrismaService } from 'src/core/prisma/prisma.service';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './inputs/login.input';
import { verify } from 'argon2';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/core/redis/redis.service';
import { destroySession, saveSession } from 'src/shared/utils/session.util';

// Интерфейсы для типизации
export interface UserSession {
  id: string;
  userId: string;
  createdAt: number;
  [key: string]: any;
}

interface SessionData {
  userId?: string;
  createdAt?: number;
  [key: string]: any;
}

interface ExtendedSession {
  userId?: string;
  id?: string;
  [key: string]: any;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  
  public constructor(
    private readonly prismaService: PrismaService, 
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  public async findByUser(req: Request): Promise<UserSession[]> {
    const session = req.session as ExtendedSession;
    const userId = session.userId;

    if (!userId) {
      throw new NotFoundException('Session not found');
    }

    try {
      const keys = await this.redisService.keys('*');
      const userSessions: UserSession[] = [];

      for (const key of keys) {
        const sessionData = await this.redisService.get(key);

        if (sessionData) {
          try {
            const sessionDataParsed: SessionData = JSON.parse(sessionData);

            if (sessionDataParsed.userId === userId) {
              const sessionId = key.split(':')[1] || key;
              userSessions.push({
                id: sessionId,
                userId: sessionDataParsed.userId || userId,
                createdAt: sessionDataParsed.createdAt || Date.now(),
                ...sessionDataParsed
              });
            }
          } catch (error) {
            this.logger.error(`Error parsing session data for key ${key}:`, error);
          }
        }
      }

      // Безопасная сортировка с проверкой свойства
      userSessions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      // Безопасная фильтрация с проверкой свойства
      return userSessions.filter(session => session.id && session.id !== session.id);

    } catch (error) {
      this.logger.error(`Error finding sessions by user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve user sessions');
    }
  }

  public async findCurrent(req: Request): Promise<UserSession> {
    const session = req.session as ExtendedSession;
    const sessionId = session.id;

    if (!sessionId) {
      throw new NotFoundException('Session not found');
    }

    const sessionFolder = this.configService.get<string>('SESSION_FOLDER') || 'sess:';
    
    try {
      const sessionData = await this.redisService.get(`${sessionFolder}${sessionId}`);
      
      if (!sessionData) {
        throw new NotFoundException('Session not found');
      }

      const parsedSession: SessionData = JSON.parse(sessionData);
      
      return {
        id: sessionId,
        userId: parsedSession.userId || session.userId || '',
        createdAt: parsedSession.createdAt || Date.now(),
        ...parsedSession
      };
    } catch (error) {
      this.logger.error(`Error parsing current session data:`, error);
      throw new InternalServerErrorException('Invalid session data');
    }
  }

  public async login(req: Request, input: LoginInput): Promise<any> {
    const { login, password } = input;

    this.logger.log(`Login attempt for: ${login}`);
    this.logger.debug(`Session ID: ${req.sessionID}`);

    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { userName: { equals: login, mode: 'insensitive' } },
            { email: { equals: login, mode: 'insensitive' } }
          ]
        },
        select: {
          bio: true,
          id: true,
          email: true,
          userName: true,
          password: true,
          firstName: true,
          lastName: true,
          avatar: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        this.logger.warn(`Login attempt failed: user ${login} not found`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isValidPassword = await verify(user.password, password);
      if (!isValidPassword) {
        this.logger.warn(`Invalid password attempt for user: ${user.id}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Создаем сессию
      const sessionData = await saveSession(req, user);

      this.logger.log(`Successful login for user: ${user.id}`);

      return {
        success: true,
        requiresTotp: false,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        session: sessionData
      };

    } catch (error) {
      this.logger.error(`Login error for ${login}: ${error.message}`, error.stack);
      
      if (error instanceof UnauthorizedException || 
          error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Login failed. Please try again later.');
    }
  }

  public async logout(req: Request): Promise<boolean> {
    this.logger.log('Logout attempt started');
    this.logger.debug('Current session ID:', req.sessionID);

    try {
      await destroySession(req, this.configService);
      return true;
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Logout failed');
    }
  }

  public async clearSession(req: Request): Promise<boolean> {
    try {
      const sessionName = this.configService.get<string>('SESSION_NAME') || 'sid';
      this.logger.log(`Clearing cookie: ${sessionName}`);
      
      if (req.res) {
        req.res.clearCookie(sessionName, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        this.logger.log('Cookie cleared successfully');
      } else {
        this.logger.warn('Response object not available, skipping cookie clear');
      }
      
      return true;
    } catch (cookieError) {
      this.logger.error('Cookie clear error:', cookieError);
      return false;
    }
  }

  public async remove(req: Request, id: string): Promise<boolean> {
    const session = req.session as ExtendedSession;
    const currentSessionId = session.id;
    
    if (currentSessionId === id) {
      throw new ConflictException('You cannot remove your current session');
    }

    const sessionFolder = this.configService.get<string>('SESSION_FOLDER') || 'sess:';
    
    try {
      await this.redisService.del(`${sessionFolder}${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Error removing session ${id}:`, error);
      throw new InternalServerErrorException('Failed to remove session');
    }
  }
}