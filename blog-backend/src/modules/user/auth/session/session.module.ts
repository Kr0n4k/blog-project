import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RedisService } from 'src/core/redis/redis.service';
import { SessionResolver } from './session.resolver';
import { SessionService } from './session.service';

@Module({
  providers: [
    SessionResolver, 
    SessionService, 
    PrismaService,
    RedisService,
  ]
})
export class SessionModule {}