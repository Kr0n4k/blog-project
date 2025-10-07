import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AccountService } from '../user/auth/account/account.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [AccountService, PrismaService],
  exports: [AccountService]
})
export class UsersModule {}
